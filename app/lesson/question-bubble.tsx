import { forwardRef, useRef, useEffect } from 'react';
import Image from "next/image";
import { useWordTranslator } from "@/hooks/useWordTranslator";

type Props = {
  question: string;
  translation?: string; // Romanized Tamil line
  speaker?: string;
};

export const QuestionBubble = forwardRef<HTMLDivElement, Props>(({ question, translation, speaker }, ref) => {
  const imageSrc = speaker ? `/${speaker.toLowerCase()}.jpg` : null;
  const { wrapWords, attachTooltips } = useWordTranslator('ta', 'en');
  const translationRef = useRef<HTMLDivElement>(null);

  // Apply tooltips to the translation text (Romanized Tamil) when it exists
  useEffect(() => {
    if (translation && translationRef.current) {
      const html = wrapWords(translation);
      translationRef.current.innerHTML = html;
      attachTooltips(translationRef.current);
    }
  }, [translation, wrapWords, attachTooltips]);

  return (
    <div className="flex items-center gap-x-4 mb-6">
      {imageSrc && (
        <>
          <Image
            src={imageSrc}
            alt="Speaker"
            height={60}
            width={60}
            className="hidden lg:block rounded-full object-cover"
          />
          <Image
            src={imageSrc}
            alt="Speaker"
            height={40}
            width={40}
            className="block lg:hidden rounded-full object-cover"
          />
        </>
      )}
      <div className="relative py-2 px-4 border-2 rounded-xl text-sm lg:text-base">
        <div ref={ref}>{question}</div>
        {translation && (
          <div ref={translationRef} className="mt-2 text-xs text-gray-500 border-t pt-1">
            {translation}
          </div>
        )}
        <div
          className="absolute -left-3 top-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-y-1/2 rotate-90"
        />
      </div>
    </div>
  );
});

QuestionBubble.displayName = 'QuestionBubble';