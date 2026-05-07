import { forwardRef, useRef, useEffect, useState } from 'react';
import { Circle, CheckCircle, Clock } from 'lucide-react';
import { useWordTranslator } from "@/hooks/useWordTranslator";

type Props = {
  question: string;
  translation?: string;
  speaker?: string;
  romanized?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  onComplete?: () => void;
};

export const QuestionBubble = forwardRef<HTMLDivElement, Props>(({
  question,
  translation,
  speaker,
  romanized,
  isActive = false,
  isCompleted = false,
  onComplete,
}, ref) => {
  const { wrapWords, attachTooltips } = useWordTranslator('ta', 'en');
  const romanizedRef = useRef<HTMLDivElement>(null);
  const [localCompleted, setLocalCompleted] = useState(false);

  // Reset local completed when a new challenge becomes active
  useEffect(() => {
    if (isActive) {
      setLocalCompleted(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (romanized && romanizedRef.current) {
      const html = wrapWords(romanized);
      romanizedRef.current.innerHTML = html;
      attachTooltips(romanizedRef.current);
    }
  }, [romanized, wrapWords, attachTooltips]);

  const handleStatusClick = () => {
    if (!isActive || isCompleted || localCompleted) return;
    setLocalCompleted(true);
    onComplete?.();
  };

  return (
    <div className="flex items-start gap-x-4 mb-8">
      {speaker && (
        <div className="flex-shrink-0 font-semibold text-gray-600 self-center text-sm">
          {speaker.charAt(0).toUpperCase() + speaker.slice(1)}:
        </div>
      )}
      <div className="relative max-w-2xl w-full flex flex-col">
        <div
          ref={ref}
          className="bg-white border border-gray-100 rounded-3xl shadow-md hover:shadow-lg transition-shadow p-5 text-gray-800 text-base lg:text-lg leading-relaxed"
        >
          {question}
        </div>
        {translation && (
          <div className="mt-2 ml-1 text-xs text-gray-400 italic border-l-2 border-gray-200 pl-3">
            {translation}
          </div>
        )}
        {romanized && (
          <div ref={romanizedRef} className="mt-1 ml-1 text-sm text-gray-500 pl-3">
            {romanized}
          </div>
        )}
        {/* Status icon – bottom right */}
        <div className="flex justify-end mt-3 mr-2">
          {isCompleted ? (
            <CheckCircle className="w-6 h-6 text-green-500" strokeWidth={1.8} />
          ) : isActive ? (
            <button
              onClick={handleStatusClick}
              className="focus:outline-none"
              aria-label="Mark as complete"
            >
              <Circle className="w-6 h-6 text-gray-400 hover:text-[#7C3AED] transition-colors" strokeWidth={1.8} />
            </button>
          ) : (
            <Clock className="w-6 h-6 text-gray-400" strokeWidth={1.8} />
          )}
        </div>
        {/* Speech arrow pointer */}
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