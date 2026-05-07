import { forwardRef, useRef, useEffect } from 'react';
import { Circle, CheckCircle, Clock } from 'lucide-react';
import { useWordTranslator } from "@/hooks/useWordTranslator";

type Props = {
  question: string;
  translation?: string;
  speaker?: string;
  romanized?: string;
  isActive?: boolean;
  isCompleted?: boolean;
};

export const QuestionBubble = forwardRef<HTMLDivElement, Props>(({
  question,
  translation,
  speaker,
  romanized,
  isActive = false,
  isCompleted = false,
}, ref) => {
  const { wrapWords, attachTooltips } = useWordTranslator('ta', 'en');

  useEffect(() => {
    const el = ref as React.RefObject<HTMLDivElement>;
    if (el?.current) {
      const html = wrapWords(question);
      el.current.innerHTML = html;
      attachTooltips(el.current);
    }
  }, [question, wrapWords, attachTooltips, ref]);

  return (
    <div className="flex items-start gap-x-4 mb-8">
      {speaker && (
        <div className="flex-shrink-0 font-semibold text-gray-600 self-center text-sm">
          {speaker.charAt(0).toUpperCase() + speaker.slice(1)}:
        </div>
      )}
      <div className="relative max-w-2xl w-full flex flex-col">
        {/* Main bubble – now contains the status icon */}
        <div
          ref={ref}
          className="relative bg-white border border-gray-100 rounded-3xl shadow-md hover:shadow-lg transition-shadow p-5 pr-12 text-gray-800 text-base lg:text-lg leading-relaxed"
        >
          {question}

          {/* Status icon placed inside the bubble, bottom‑right corner */}
          <span className="absolute bottom-3 right-3">
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-green-500" strokeWidth={1.8} />
            ) : isActive ? (
              <Circle className="w-6 h-6 text-gray-400" strokeWidth={1.8} />
            ) : (
              <Clock className="w-6 h-6 text-gray-400" strokeWidth={1.8} />
            )}
          </span>
        </div>

        {translation && (
          <div className="mt-2 ml-1 text-xs text-gray-400 italic border-l-2 border-gray-200 pl-3">
            {translation}
          </div>
        )}
        {romanized && (
          <div className="mt-1 ml-1 text-sm text-gray-500 pl-3">
            {romanized}
          </div>
        )}

        {/* Speech arrow pointer (unchanged) */}
        <div
          className="absolute left-[-10px] top-[24px] w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-gray-100"
          style={{ filter: 'drop-shadow(-1px 1px 1px rgba(0,0,0,0.03))' }}
        />
        <div
          className="absolute left-[-8px] top-[24px] w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-white"
        />
      </div>
    </div>
  );
});

QuestionBubble.displayName = 'QuestionBubble';