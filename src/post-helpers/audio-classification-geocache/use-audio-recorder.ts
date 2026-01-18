import { useState, useRef, useEffect } from 'react';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const stopMediaRecorder = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
  };

  const stopStreamTracks = (mediaStream: MediaStream) => {
    mediaStream.getTracks().forEach((track) => track.stop());
  };

  const cleanupResources = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.ondataavailable = null;

      stopMediaRecorder();
      mediaRecorderRef.current = null;
    }

    if (mediaStreamRef.current) {
      stopStreamTracks(mediaStreamRef.current);
      mediaStreamRef.current = null;
    }
  };

  const reset = () => {
    cleanupResources();
    setError(null);
    setAudioUrl(null);
    audioChunksRef.current = [];
  };

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      cleanupResources();
    };
  }, []);

  const createMediaRecorder = (stream: MediaStream) => {
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      stopStreamTracks(stream);
      mediaStreamRef.current = null;
    };

    return recorder;
  };

  const startRecording = async () => {
    try {
      reset();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!isMountedRef.current) {
        stopStreamTracks(stream);
        return;
      }

      mediaStreamRef.current = stream;

      const recorder = createMediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Failed to start recording. Please try again.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    stopMediaRecorder();
    setIsRecording(false);
  };

  return { isRecording, audioUrl, error, startRecording, stopRecording };
};
