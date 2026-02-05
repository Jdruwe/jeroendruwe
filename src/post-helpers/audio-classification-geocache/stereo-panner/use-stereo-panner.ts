import { useState, useRef, useEffect } from 'react';

type Status = 'idle' | 'starting' | 'running' | 'stopping' | 'error';

export const useStereoPanner = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [pan, setPan] = useState<number>(0);

  const isMountedRef = useRef(false);
  const audioContextRef = useRef<AudioContext>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const stereoPannerNodeRef = useRef<StereoPannerNode | null>(null);

  const stopStreamTracks = (mediaStream: MediaStream) => {
    mediaStream.getTracks().forEach((track) => track.stop());
  };

  const cleanupResources = async () => {
    if (mediaStreamRef.current) {
      stopStreamTracks(mediaStreamRef.current);
      mediaStreamRef.current = null;
    }

    audioSourceNodeRef.current?.disconnect();
    stereoPannerNodeRef.current?.disconnect();

    audioSourceNodeRef.current = null;
    stereoPannerNodeRef.current = null;

    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        try {
          await audioContextRef.current.close();
        } catch (e) {
          console.warn('AudioContext close error:', e);
        }
      }
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      void cleanupResources();
    };
  }, []);

  const startPanning = async () => {
    try {
      setStatus('starting');
      await cleanupResources();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!isMountedRef.current) {
        stopStreamTracks(stream);
        return;
      }

      mediaStreamRef.current = stream;
      audioContextRef.current = new AudioContext();

      audioSourceNodeRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      stereoPannerNodeRef.current =
        audioContextRef.current.createStereoPanner();

      // Mic -> Panner -> Speakers
      audioSourceNodeRef.current.connect(stereoPannerNodeRef.current);
      stereoPannerNodeRef.current.connect(audioContextRef.current.destination);

      setStatus('running');
    } catch (err) {
      setStatus('error');
    }
  };

  const stopPanning = async () => {
    setStatus('stopping');
    setPan(0);
    await cleanupResources();
    setStatus('idle');
  };

  useEffect(() => {
    if (stereoPannerNodeRef.current && audioContextRef.current) {
      stereoPannerNodeRef.current.pan.setTargetAtTime(
        pan,
        audioContextRef.current.currentTime,
        0.05,
      );
    }
  }, [pan]);

  return { status, pan, setPan, startPanning, stopPanning };
};
