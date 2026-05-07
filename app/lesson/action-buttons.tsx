"use client";

import { Volume2, Mic, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

type Props = {
  audioSrc?: string;
  targetSentence?: string;
  disabled?: boolean;
  onComplete?: () => void;
  onReset: () => void;
};

function similarity(str1: string, str2: string): number {
  const a = str1.toLowerCase();
  const b = str2.toLowerCase();
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1 : (maxLen - matrix[b.length][a.length]) / maxLen;
}

export const ActionButtons = ({ audioSrc, targetSentence, disabled, onComplete, onReset }: Props) => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const recognitionRef = useRef<any>(null);
  const completingRef = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleSpeakerClick = () => {
    if (!audioSrc || disabled) return;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsPlaying(false);
    }
    const audio = new Audio(audioSrc);
    currentAudioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onEnd = () => {
      setIsPlaying(false);
      currentAudioRef.current = null;
    };
    const onError = () => {
      setIsPlaying(false);
      currentAudioRef.current = null;
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onError);
    audio.play().catch(err => {
      console.warn("Audio play failed:", err);
      setIsPlaying(false);
      currentAudioRef.current = null;
    });
  };

  const handleMicClick = () => {
    if (disabled || isListening || completingRef.current) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening... speak the sentence clearly.");
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      toast.error("Could not understand. Please try again.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript.trim();
      if (!targetSentence) {
        toast.info(`You said: "${spoken}"`);
        return;
      }

      const score = similarity(spoken, targetSentence) * 100;
      const rounded = Math.round(score);

      let emoji = "";
      let message = "";
      if (rounded >= 90) {
        emoji = "🎉";
        message = "Excellent pronunciation!";
      } else if (rounded >= 70) {
        emoji = "👍";
        message = "Good, but a few sounds need practice.";
      } else if (rounded >= 50) {
        emoji = "📖";
        message = "Not bad, listen to the speaker and try again.";
      } else {
        emoji = "🔊";
        message = "Keep practicing! Listen carefully and repeat.";
      }
      toast.success(`${emoji} ${message} (Score: ${rounded}%)`, { duration: 5000 });

      if (onComplete && !completingRef.current) {
        completingRef.current = true;
        onComplete();
      }
    };

    recognition.start();
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      completingRef.current = false;
    };
  }, []);

  return (
    <div className="flex items-center justify-center gap-6 mt-4 pb-4">
      {/* Reset icon – left, transparent background */}
      <button
        onClick={onReset}
        disabled={disabled}
        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Reset lesson"
      >
        <RotateCcw className="w-7 h-7 text-gray-500 hover:text-gray-700 transition-colors" strokeWidth={1.8} />
      </button>

      {/* Speaker icon – center, purple, now with voice animation while playing */}
      <div className="relative flex items-center justify-center">
        {/* Voice animation rings – visible only while audio is playing */}
        {isPlaying && (
          <>
            <span
              className="absolute inset-0 animate-ping rounded-full bg-purple-400 opacity-25"
              style={{ animationDuration: '1.5s', animationDelay: '0s' }}
            />
            <span
              className="absolute inset-0 animate-ping rounded-full bg-purple-400 opacity-15"
              style={{ animationDuration: '1.5s', animationDelay: '0.5s' }}
            />
            <span
              className="absolute inset-0 animate-ping rounded-full bg-purple-400 opacity-10"
              style={{ animationDuration: '1.5s', animationDelay: '1s' }}
            />
          </>
        )}
        <button
          onClick={handleSpeakerClick}
          disabled={disabled || !audioSrc}
          className={`relative z-10 p-1.5 rounded-full hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            isPlaying ? 'ring-2 ring-purple-300' : ''
          }`}
          aria-label="Play pronunciation"
        >
          <Volume2 className="w-8 h-8 text-[#7C3AED]" strokeWidth={1.8} />
        </button>
      </div>

      {/* Mic icon – right, transparent background */}
      <button
        onClick={handleMicClick}
        disabled={disabled || isListening}
        className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed ${
          isListening ? 'ring-2 ring-green-500' : ''
        }`}
        aria-label="Record your pronunciation"
      >
        <Mic className="w-7 h-7 text-gray-500 hover:text-gray-700 transition-colors" strokeWidth={1.8} />
      </button>
    </div>
  );
};