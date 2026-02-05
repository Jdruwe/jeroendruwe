import { useState, useRef, useEffect, useCallback } from 'react';
import WhiteNoiseProcessor from './white-noise-processor.ts?worker&url';

type Status =
  | 'idle'
  | 'starting'
  | 'running'
  | 'finished'
  | 'stopping'
  | 'error';

const useWhiteNoiseInjector = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const isMountedRef = useRef(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const whiteNoiseInjectorNodeRef = useRef<AudioWorkletNode | null>(null);
  const audioSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioDestinationNodeRef =
    useRef<MediaStreamAudioDestinationNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const stopStreamTracks = (mediaStream: MediaStream) => {
    mediaStream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch (e) {
        console.warn('Failed to stop track', e);
      }
    });
  };

  const cleanupResources = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    const stream = mediaStreamRef.current;
    const context = audioContextRef.current;
    const source = audioSourceNodeRef.current;
    const injector = whiteNoiseInjectorNodeRef.current;
    const destination = audioDestinationNodeRef.current;

    mediaRecorderRef.current = null;
    mediaStreamRef.current = null;
    audioContextRef.current = null;
    audioSourceNodeRef.current = null;
    whiteNoiseInjectorNodeRef.current = null;
    audioDestinationNodeRef.current = null;

    try {
      if (recorder && recorder.state !== 'inactive') {
        try {
          recorder.stop();
        } catch (e) {
          console.warn('Failed to stop recorder', e);
        }
      }

      if (stream) {
        stopStreamTracks(stream);
      }

      [source, injector, destination].forEach((node) => {
        if (node) {
          try {
            node.disconnect();
          } catch (e) {
            console.warn('Failed to disconnect node', e);
          }
        }
      });

      if (context && context.state !== 'closed') {
        try {
          await context.close();
        } catch (e) {
          console.warn('Failed to close AudioContext:', e);
        }
      }
    } catch (e) {
      console.error('Failed to cleanup resources', e);
    } finally {
      if (isMountedRef.current) {
        setStatus((prev) => (prev === 'stopping' ? 'finished' : prev));
      }
    }
  }, []);

  useEffect(() => {
    if (['stopping', 'error'].includes(status)) {
      void cleanupResources();
    }
  }, [status, cleanupResources]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      void cleanupResources();
    };
  }, [cleanupResources]);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const createMediaRecorder = (stream: MediaStream) => {
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      if (!isMountedRef.current) return;

      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      if (!isMountedRef.current) return;

      try {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } catch (err) {
        setStatus('error');
      }
    };

    return recorder;
  };

  const startInjecting = async () => {
    try {
      setStatus('starting');
      setAudioUrl(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      if (!isMountedRef.current) {
        void cleanupResources();
        return;
      }

      const context = new AudioContext();
      audioContextRef.current = context;
      await audioContextRef.current.audioWorklet.addModule(WhiteNoiseProcessor);

      if (!isMountedRef.current) {
        void cleanupResources();
        return;
      }

      const injector = new AudioWorkletNode(context, 'white-noise-processor');
      whiteNoiseInjectorNodeRef.current = injector;

      const source = context.createMediaStreamSource(stream);
      audioSourceNodeRef.current = source;

      const destination = context.createMediaStreamDestination();
      audioDestinationNodeRef.current = destination;

      const recorder = createMediaRecorder(destination.stream);
      mediaRecorderRef.current = recorder;

      source.connect(injector);
      injector.connect(destination);

      recorder.start();
      setStatus('running');
    } catch (err) {
      if (!isMountedRef.current) return;
      setStatus('error');
    }
  };

  const stopInjecting = () => {
    setStatus('stopping');
  };

  return { status, audioUrl, startInjecting, stopInjecting };
};

export { useWhiteNoiseInjector, type Status };
