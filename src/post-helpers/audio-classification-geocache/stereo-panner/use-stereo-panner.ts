import { useState, useRef, useEffect } from 'react';

export const useStereoPanner = () => {
  const [pan, setPan] = useState<number>(0);
  const [isPanning, setIsPanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const startRecording = async () => {
    try {
      await cleanupResources();
      setError(null);

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

      setIsPanning(true);
    } catch (err) {
      setError('Failed to start recording. Please try again.');
      setIsPanning(false);
    }
  };

  const stopRecording = () => {
    setIsPanning(false);
    setPan(0);
    void cleanupResources();
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

  return { isPanning, pan, setPan, error, startRecording, stopRecording };
};
