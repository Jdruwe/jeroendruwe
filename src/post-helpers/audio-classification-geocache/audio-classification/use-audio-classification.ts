import { useState, useRef, useEffect } from 'react';
import BufferedAudioProcessor from './buffered-audio-processor.ts?worker&url';

import { FilesetResolver, AudioClassifier } from '@mediapipe/tasks-audio';

const SAMPLE_RATE = 16000;

type Category = {
  label: string;
  score: number;
};

type Status = 'idle' | 'starting' | 'running' | 'stopping' | 'error';

export const useAudioClassification = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [categories, setCategories] = useState<Category[]>([]);

  const isMountedRef = useRef(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const audioClassifierRef = useRef<AudioClassifier | null>(null);
  const audioContextRef = useRef<AudioContext>(null);
  const bufferAudioProcessorNodeRef = useRef<AudioWorkletNode>(null);
  const audioSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioDestinationNodeRef =
    useRef<MediaStreamAudioDestinationNode | null>(null);

  const createAudioClassifier = async (): Promise<AudioClassifier> => {
    const audio = await FilesetResolver.forAudioTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.22-rc.20250304/wasm',
    );
    return AudioClassifier.createFromOptions(audio, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/audio_classifier/yamnet/float32/1/yamnet.tflite',
      },
      maxResults: 5,
    });
  };

  const stopStreamTracks = (mediaStream: MediaStream) => {
    mediaStream.getTracks().forEach((track) => track.stop());
  };

  const cleanupResources = async () => {
    [
      audioSourceNodeRef,
      bufferAudioProcessorNodeRef,
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

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      void cleanupResources();
    };
  }, []);

  const handleProcessorMessage = (event: MessageEvent) => {
    if (event.data.type === 'audio') {
      if (!audioClassifierRef.current) return;

      try {
        const results = audioClassifierRef.current.classify(
          event.data.data,
          SAMPLE_RATE,
        );

        const nextCategories = results[0].classifications[0].categories.map(
          (category) => {
            return {
              label: category.categoryName,
              score: category.score,
            };
          },
        );

        setCategories(nextCategories);
      } catch (error) {
        setStatus('error');
      }
    }
  };

  const startClassification = async () => {
    try {
      setStatus('starting');
      setCategories([]);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!isMountedRef.current) {
        stopStreamTracks(stream);
        return;
      }

      mediaStreamRef.current = stream;
      audioContextRef.current = new AudioContext({ sampleRate: SAMPLE_RATE });
      await audioContextRef.current.audioWorklet.addModule(
        BufferedAudioProcessor,
      );
      bufferAudioProcessorNodeRef.current = new AudioWorkletNode(
        audioContextRef.current,
        'buffered-audio-processor',
        {
          processorOptions: {
            bufferSize: SAMPLE_RATE,
          },
        },
      );

      audioSourceNodeRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      audioDestinationNodeRef.current =
        audioContextRef.current.createMediaStreamDestination();

      audioClassifierRef.current = await createAudioClassifier();
      bufferAudioProcessorNodeRef.current.port.onmessage =
        handleProcessorMessage;
      audioSourceNodeRef.current.connect(bufferAudioProcessorNodeRef.current);
      bufferAudioProcessorNodeRef.current.connect(
        audioDestinationNodeRef.current,
      );

      setStatus('running');
    } catch (error) {
      setStatus('error');
    }
  };

  const stopClassification = async () => {
    setStatus('stopping');
    await cleanupResources();
    setStatus('idle');
  };

  return {
    status,
    startClassification,
    stopClassification,
    categories,
  };
};
