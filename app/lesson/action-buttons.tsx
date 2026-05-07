"use client";

import { Volume2, Mic, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

type Props = {
  audioSrc?: string;
  targetSentence?: string;   // the sentence the user should speak
  disabled?: boolean;
  onComplete?: () => void;    // called after pronunciation evaluation (completes challenge)
  onReset: () => void;        // reset lesson
};

// Simple Levenshtein‑based similarity (no external dependency)
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
  const completingRef = useRef(false); // prevent double completion
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleSpeakerClick = () => {
    if (!audioSrc || disabled) return;
    // Stop any currently playing audio
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
    recognition.lang = "en-US"; // can be changed dynamically later
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

      // Complete the challenge after evaluation (only once)
      if (onComplete && !completingRef.current) {
        completingRef.current = true;
        onComplete();
      }
    };

    recognition.start();
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      completingRef.current = false; // reset on unmount
    };
  }, []);

  return (
    <div className="flex items-center justify-center gap-6 mt-8 pb-4">
      {/* Reset icon – left */}
      <button
        onClick={onReset}
        disabled={disabled}
        className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Reset lesson"
      >
        <RotateCcw className="w-7 h-7 text-gray-600 hover:text-gray-700 transition-colors" strokeWidth={1.8} />
      </button>

      {/* Speaker icon – center, large, purple */}
      <button
        onClick={handleSpeakerClick}
        disabled={disabled || !audioSrc}
        className={`p-6 bg-[#7C3AED] rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed ${
          isPlaying ? "animate-pulse ring-4 ring-purple-300" : ""
        }`}
        aria-label="Play pronunciation"
      >
        <Volume2 className="w-16 h-16 text-white" strokeWidth={1.8} />
      </button>

      {/* Mic icon – right */}
      <button
        onClick={handleMicClick}
        disabled={disabled || isListening}
        className={`p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed ${
          isListening ? "animate-pulse ring-2 ring-green-500" : ""
        }`}
        aria-label="Record your pronunciation"
      >
        <Mic className="w-7 h-7 text-gray-600 hover:text-gray-700 transition-colors" strokeWidth={1.8} />
      </button>
    </div>
  );
};