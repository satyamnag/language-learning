"use client";

import { Volume2, Mic } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { similarity } from "@/lib/stringSimilarity";

type Props = {
  audioSrc?: string;
  targetSentence?: string;   // the expected sentence (e.g., the Tamil or English text)
  disabled?: boolean;
};

export const ActionButtons = ({ audioSrc, targetSentence, disabled }: Props) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleSpeakerClick = () => {
    if (!audioSrc || disabled) return;
    const audio = new Audio(audioSrc);
    audio.play().catch(err => console.warn("Audio play failed:", err));
  };

  const handleMicClick = () => {
    if (disabled || isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    // Set language based on target sentence? For now use English (en-US)
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening... speak the sentence clearly.");
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      toast.error("Could not understand. Please try again.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript.trim().toLowerCase();
      if (!targetSentence) {
        toast.info(`You said: "${spoken}"`);
        return;
      }

      const expected = targetSentence.trim().toLowerCase();
      const score = similarity(spoken, expected) * 100;
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