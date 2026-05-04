"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useKey } from "react-use";
import { Volume2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { challenges } from "@/db/schema";
import { useWordTranslator } from "@/hooks/useWordTranslator";

type Props = {
  id: number;
  imageSrc: string | null;
  audioSrc: string | null;
  text: string;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
  status?: "correct" | "wrong" | "none";
  type: typeof challenges.$inferSelect["type"];
};

export const Card = ({
  id,
  imageSrc,
  audioSrc,
  text,
  shortcut,
  selected,
  onClick,
  status,
  disabled,
  type,
}: Props) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { wrapWords, attachTooltips } = useWordTranslator('ta', 'en');
  const textRef = useRef<HTMLParagraphElement>(null);

  // Create/clean up audio object
  useEffect(() => {
    if (!audioSrc) {
      audioRef.current = null;
      return;
    }
    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioSrc]);

  // Wrap words for tooltips
  useEffect(() => {
    if (textRef.current && text) {
      const html = wrapWords(text);
      textRef.current.innerHTML = html;
      attachTooltips(textRef.current);
    }
  }, [text, wrapWords, attachTooltips]);

  const playAudio = useCallback(() => {
    if (!audioRef.current || disabled) return;
    audioRef.current.play().catch(err => console.warn("Audio play failed:", err));
  }, [disabled]);

  const handleCardClick = useCallback(() => {
    if (disabled) return;
    playAudio();
    onClick();
  }, [disabled, playAudio, onClick]);

  const handleSpeakerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || !audioSrc) return;
    playAudio();
  }, [disabled, audioSrc, playAudio]);

  useKey(shortcut, handleCardClick, {}, [handleCardClick]);

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        // Removed all box styling: border, background, shadow, padding, hover effects
        // Keep only layout and cursor behavior
        "flex items-center justify-between w-full cursor-pointer",
        // Keep selection styles (only text color changes, no background)
        selected && "text-sky-500",
        selected && status === "correct" && "text-green-500",
        selected && status === "wrong" && "text-rose-500",
        disabled && "pointer-events-none opacity-50",
        type === "ASSIST" && "w-full"
      )}
    >
      {imageSrc && (
        <div className="relative aspect-square mb-4 max-h-[80px] lg:max-h-[150px] w-full">
          <Image src={imageSrc} fill alt={text} />
        </div>
      )}
      <div className={cn(
        "flex items-center justify-between w-full",
        type === "ASSIST" && "flex-row-reverse"
      )}>
        {type === "ASSIST" && <div />}
        <p
          ref={textRef}
          className={cn(
            "text-neutral-600 text-sm lg:text-base",
            selected && "text-sky-500",
            selected && status === "correct" && "text-green-500",
            selected && status === "wrong" && "text-rose-500"
          )}
        >
          {text}
        </p>
        <div className="flex items-center gap-2">
          {audioSrc && (
            <Volume2
              onClick={handleSpeakerClick}
              className="w-6 h-6 text-gray-600 cursor-pointer hover:opacity-70 transition shrink-0"
              strokeWidth={1.5}
            />
          )}
          <div className={cn(
            "lg:w-[30px] lg:h-[30px] w-[20px] h-[20px] border-2 flex items-center justify-center rounded-lg text-neutral-400 lg:text-[15px] text-xs font-semibold",
            selected && "border-sky-300 text-sky-500",
            selected && status === "correct" && "border-green-500 text-green-500",
            selected && status === "wrong" && "border-rose-500 text-rose-500"
          )}>
            {shortcut}
          </div>
        </div>
      </div>
    </div>
  );
};