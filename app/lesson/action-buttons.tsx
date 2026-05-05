"use client";

import { Volume2, Mic } from "lucide-react";

type Props = {
  audioSrc?: string;
  disabled?: boolean;
};

export const ActionButtons = ({ audioSrc, disabled }: Props) => {
  const handleSpeakerClick = () => {
    if (!audioSrc || disabled) return;
    const audio = new Audio(audioSrc);
    audio.play().catch(err => console.warn("Audio play failed:", err));
  };

  const handleMicClick = () => {
    if (disabled) return;
    console.log("Mic clicked – voice input coming soon");
  };

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
        disabled={disabled}
        className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Voice input (coming soon)"
      >
        <Mic className="w-7 h-7 text-gray-600 hover:text-gray-700 transition-colors" strokeWidth={1.8} />
      </button>
    </div>
  );
};