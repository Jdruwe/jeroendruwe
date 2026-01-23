import { useState, useRef, useEffect } from 'react';

export const useStereoPanner = () => {
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

  const cleanupResources = () => {
    if (mediaStreamRef.current) {
      stopStreamTracks(mediaStreamRef.current);
      mediaStreamRef.current = null;
    }

    // todo: proper cleanup!
  };

  const reset = () => {
    cleanupResources();
    setError(null);
  };

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      cleanupResources();
    };
  }, []);

  const startRecording = async () => {
    try {
      reset();

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
  };

  // Value ranges from -1 (Left) to 1 (Right)
  const updatePanning = (value: number) => {
    if (!audioContextRef.current) return;

    if (stereoPannerNodeRef.current) {
      stereoPannerNodeRef.current.pan.setTargetAtTime(
        value,
        audioContextRef.current.currentTime,
        0.05,
      );
    }
  };

  return { isPanning, updatePanning, error, startRecording, stopRecording };
};
