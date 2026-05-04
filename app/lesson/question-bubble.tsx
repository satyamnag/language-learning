import { forwardRef, useRef, useEffect } from 'react';
import Image from "next/image";
import { useWordTranslator } from "@/hooks/useWordTranslator";

type Props = {
  question: string;
  translation?: string;
  speaker?: string;
};

export const QuestionBubble = forwardRef<HTMLDivElement, Props>(({ question, translation, speaker }, ref) => {
  const imageSrc = speaker ? `/${speaker.trim().toLowerCase()}.jpg` : null;
  const { wrapWords, attachTooltips } = useWordTranslator('ta', 'en');
  const translationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (translation && translationRef.current) {
      const html = wrapWords(translation);
      translationRef.current.innerHTML = html;
      attachTooltips(translationRef.current);
    }
  }, [translation, wrapWords, attachTooltips]);
// ggjhg
  return (
    <div className="flex items-start gap-x-4 mb-8">
      {imageSrc && (
        <div className="flex-shrink-0">
          <Image
            src={imageSrc}
            alt="Speaker"
            height={60}
            width={60}
            className="hidden lg:block rounded-full object-cover shadow-md"
          />
          <Image
            src={imageSrc}
            alt="Speaker"
            height={40}
            width={40}
            className="block lg:hidden rounded-full object-cover shadow-md"
          />
        </div>
      )}
      <div className="relative max-w-2xl">
        {/* Main question bubble */}
        <div
          ref={ref}
          className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg p-4 text-gray-800 text-base lg:text-lg leading-relaxed"
        >
          {question}
        </div>
        {/* Translation line (Romanized) with tooltips */}
        {translation && (
          <div
            ref={translationRef}
            className="mt-2 text-xs text-gray-500 italic border-l-2 border-gray-300 pl-3"
          >
            {translation}
          </div>
        )}
        {/* Arrow pointing to the speaker image (overlapping triangles for smooth edge) */}
        <div
          className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-gray-200"
          style={{ filter: 'drop-shadow(-2px 0 2px rgba(0,0,0,0.05))' }}
        />
        <div
          className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-white"
        />
      </div>
    </div>
  );
});

QuestionBubble.displayName = 'QuestionBubble';