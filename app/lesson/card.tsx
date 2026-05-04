"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useKey } from "react-use";
import Lottie from "lottie-react";

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
  const [isAnimating, setIsAnimating] = useState(false);
  const lottieRef = useRef<any>(null);

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

  // Stop animation when audio ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      setIsAnimating(false);
      if (lottieRef.current) lottieRef.current.stop();
    };
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioSrc]); // re-run when audio source changes

  // Wrap words for tooltips (unchanged)
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
    setIsAnimating(true);
    if (lottieRef.current) lottieRef.current.play();
  }, [disabled, audioSrc, playAudio]);

  useKey(shortcut, handleCardClick, {}, [handleCardClick]);

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 p-4 lg:p-6 cursor-pointer active:border-b-2",
        selected && "border-sky-300 bg-sky-100 hover:bg-sky-100",
        selected && status === "correct" 
          && "border-green-300 bg-green-100 hover:bg-green-100",
        selected && status === "wrong" 
          && "border-rose-300 bg-rose-100 hover:bg-rose-100",
        disabled && "pointer-events-none hover:bg-white",
        type === "ASSIST" && "lg:p-3 w-full"
      )}
    >
      {imageSrc && (
        <div className="relative aspect-square mb-4 max-h-[80px] lg:max-h-[150px] w-full">
          <Image src={imageSrc} fill alt={text} />
        </div>
      )}
      <div className={cn(
        "flex items-center justify-between",
        type === "ASSIST" && "flex-row-reverse",
      )}>
        {type === "ASSIST" && <div />}
        <p
          ref={textRef}
          className={cn(
            "text-neutral-600 text-sm lg:text-base",
            selected && "text-sky-500",
            selected && status === "correct" 
              && "text-green-500",
            selected && status === "wrong" 
              && "text-rose-500",
          )}
        >
          {text}
        </p>
        <div className="flex items-center gap-2">
          {audioSrc && (
            <div
              onClick={handleSpeakerClick}
              className="cursor-pointer hover:opacity-70 transition"
            >
              <Lottie
                lottieRef={lottieRef}
                path="/speaker.lottie"
                className="w-6 h-6"
                loop={false}
                autoplay={false}
                style={{ cursor: 'pointer' }}
              />
            </div>
          )}
          <div className={cn(
            "lg:w-[30px] lg:h-[30px] w-[20px] h-[20px] border-2 flex items-center justify-center rounded-lg text-neutral-400 lg:text-[15px] text-xs font-semibold",
            selected && "border-sky-300 text-sky-500",
            selected && status === "correct" 
              && "border-green-500 text-green-500",
            selected && status === "wrong" 
              && "border-rose-500 text-rose-500",
          )}>
            {shortcut}
          </div>
        </div>
      </div>
    </div>
  );
};