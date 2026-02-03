import { useState, useRef, useEffect } from 'react';
import WhiteNoiseProcessor from './white-noise-processor.ts?worker&url';

export const useWhiteNoiseInjector = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const audioContextRef = useRef<AudioContext>(null);
  const whiteNoiseInjectorNodeRef = useRef<AudioWorkletNode>(null);
  const audioSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioDestinationNodeRef =
    useRef<MediaStreamAudioDestinationNode | null>(null);
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

  const cleanupResources = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.ondataavailable = null;

      stopMediaRecorder();
      mediaRecorderRef.current = null;
    }

    [
      audioSourceNodeRef,
      whiteNoiseInjectorNodeRef,
      audioDestinationNodeRef,
    ].forEach((ref) => {
      if (ref.current) {
        ref.current.disconnect();
        ref.current = null;
      }
    });

    if (mediaStreamRef.current) {
      stopStreamTracks(mediaStreamRef.current);
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const reset = async () => {
    await cleanupResources();
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
      void cleanupResources();
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
      void cleanupResources();
    };

    return recorder;
  };

  const startRecording = async () => {
    try {
      await reset();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!isMountedRef.current) {
        stopStreamTracks(stream);
        return;
      }

      mediaStreamRef.current = stream;
      audioContextRef.current = new AudioContext();
      await audioContextRef.current.audioWorklet.addModule(WhiteNoiseProcessor);
      whiteNoiseInjectorNodeRef.current = new AudioWorkletNode(
        audioContextRef.current,
        'white-noise-processor',
      );

      audioSourceNodeRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      audioDestinationNodeRef.current =
        audioContextRef.current.createMediaStreamDestination();
      mediaRecorderRef.current = createMediaRecorder(
        audioDestinationNodeRef.current.stream,
      );

      audioSourceNodeRef.current.connect(whiteNoiseInjectorNodeRef.current);
      whiteNoiseInjectorNodeRef.current.connect(
        audioDestinationNodeRef.current,
      );
      mediaRecorderRef.current.start();
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
