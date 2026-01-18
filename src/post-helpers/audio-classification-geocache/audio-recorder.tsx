import { useEffect, useRef, useState } from 'react';
import {
  SpaceFooter,
  SpaceHeader,
  SpaceRoot,
  SpaceTitle,
} from '@/components/ui/space';
import { SpaceContent } from '@/components/ui/space/content/space-content.tsx';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      // Request only audio access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Stop the microphone stream tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied or error:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <SpaceRoot>
      <SpaceHeader className="border-b">
        <SpaceTitle>Voice recording</SpaceTitle>
      </SpaceHeader>
      <SpaceContent>Hello</SpaceContent>
      {!isRecording ? (
        <button onClick={startRecording}>🎤 Start Recording</button>
      ) : (
        <button
          onClick={stopRecording}
          style={{ background: 'red', color: 'white' }}
        >
          ⏹️ Stop Recording
        </button>
      )}
      {audioUrl && (
        <div style={{ marginTop: '20px' }}>
          <p className="my-0">Playback your recording:</p>
          <audio src={audioUrl} controls />
        </div>
      )}
      <SpaceFooter className="border-t">Footer content here</SpaceFooter>
    </SpaceRoot>
  );
};

export { AudioRecorder };
