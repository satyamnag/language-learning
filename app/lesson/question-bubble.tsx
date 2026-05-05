import { forwardRef } from 'react';

type Props = {
  question: string;
  translation?: string;
  speaker?: string;
  romanized?: string; // new – Romanized Tamil text (from challenge.directAnswer)
};

export const QuestionBubble = forwardRef<HTMLDivElement, Props>(({ question, translation, speaker, romanized }, ref) => {
  return (
    <div className="flex items-start gap-x-4 mb-8">
      {speaker && (
        <div className="flex-shrink-0 font-bold text-gray-700 self-center">
          {speaker.charAt(0).toUpperCase() + speaker.slice(1)}:
        </div>
      )}
      <div className="relative max-w-2xl">
        {/* Main question bubble (Tamil) – tooltips applied in parent component */}
        <div
          ref={ref}
          className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg p-4 text-gray-800 text-base lg:text-lg leading-relaxed"
        >
          {question}
        </div>
        {/* English translation – plain text, no tooltips */}
        {translation && (
          <div className="mt-2 text-xs text-gray-500 italic border-l-2 border-gray-300 pl-3">
            {translation}
          </div>
        )}
        {/* Romanized Tamil text – slightly larger, plain, no button */}
        {romanized && (
          <div className="mt-1 text-sm text-gray-600 pl-3">
            {romanized}
          </div>
        )}
        {/* Arrow pointing to the left */}
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