"use client";

import { Volume2, Mic } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

type Props = {
  audioSrc?: string;
  targetSentence?: string;   // the sentence the user should speak
  disabled?: boolean;
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

export const ActionButtons = ({ audioSrc, targetSentence, disabled }: Props) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);  // use 'any' to avoid TypeScript issues with Web Speech API

  const handleSpeakerClick = () => {
    if (!audioSrc || disabled) return;
    const audio = new Audio(audioSrc);
    audio.play().catch(err => console.warn("Audio play failed:", err));
  };

  const handleMicClick = () => {
    if (disabled || isListening) return;

    // Use the correct window property for SpeechRecognition
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
      toast.success(`${emoji} ${message} (Score: ${rounded}%)`, { duration: 6000 });
    };

    recognition.start();
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="flex justify-center gap-6 mt-8 pb-4">
      <button
        onClick={handleSpeakerClick}
        disabled={disabled || !audioSrc}
        className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Play pronunciation"
      >
        <Volume2 className="w-7 h-7 text-blue-600 hover:text-blue-700 transition-colors" strokeWidth={1.8} />
      </button>
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