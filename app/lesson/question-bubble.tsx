import { forwardRef, useRef, useEffect, useState } from 'react';
import { Circle, CheckCircle } from 'lucide-react';
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
        <div className="flex-shrink-0 font-bold text-gray-700 self-center">
          {speaker.charAt(0).toUpperCase() + speaker.slice(1)}:
        </div>
      )}
      <div className="relative max-w-2xl flex flex-col h-full w-full">
        <div
          ref={ref}
          className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg p-4 text-gray-800 text-base lg:text-lg leading-relaxed"
        >
          {question}
        </div>
        {translation && (
          <div className="mt-2 text-xs text-gray-500 italic border-l-2 border-gray-300 pl-3">
            {translation}
          </div>
        )}
        {romanized && (
          <div ref={romanizedRef} className="mt-1 text-sm text-gray-600 pl-3">
            {romanized}
          </div>
        )}
        {/* Status icon – bottom right inside bubble */}
        <div className="flex justify-end mt-2">
          {isCompleted ? (
            <CheckCircle className="w-6 h-6 text-green-600" strokeWidth={1.8} />
          ) : isActive ? (
            <button
              onClick={handleStatusClick}
              className="focus:outline-none"
              aria-label="Mark as complete"
            >
              <Circle className="w-6 h-6 text-gray-500 hover:text-gray-600 transition-colors" strokeWidth={1.8} />
            </button>
          ) : (
            <Circle className="w-6 h-6 text-gray-300" strokeWidth={1.8} />
          )}
        </div>
        {/* Arrow pointer */}
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