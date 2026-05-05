import { forwardRef, useRef, useEffect, useState } from 'react';
import { Volume2, Mic, Circle, CheckCircle } from 'lucide-react';
import { useWordTranslator } from "@/hooks/useWordTranslator";

type Props = {
  question: string;
  translation?: string;
  speaker?: string;
  romanized?: string;
  audioSrc?: string;
  onComplete?: () => void;
};

export const QuestionBubble = forwardRef<HTMLDivElement, Props>(({ question, translation, speaker, romanized, audioSrc, onComplete }, ref) => {
  const { wrapWords, attachTooltips } = useWordTranslator('ta', 'en');
  const romanizedRef = useRef<HTMLDivElement>(null);
  const [statusCompleted, setStatusCompleted] = useState(false);

  useEffect(() => {
    if (romanized && romanizedRef.current) {
      const html = wrapWords(romanized);
      romanizedRef.current.innerHTML = html;
      attachTooltips(romanizedRef.current);
    }
  }, [romanized, wrapWords, attachTooltips]);

  const handleSpeakerClick = () => {
    if (!audioSrc) return;
    const audio = new Audio(audioSrc);
    audio.play().catch(err => console.warn("Audio play failed:", err));
  };

  const handleMicClick = () => {
    console.log("Mic clicked – voice input coming soon");
  };

  const handleStatusClick = () => {
    if (!onComplete || statusCompleted) return;
    setStatusCompleted(true);
    onComplete();
  };

  return (
    <div className="flex items-start gap-x-4 mb-8">
      {speaker && (
        <div className="flex-shrink-0 font-bold text-gray-700 self-center">
          {speaker.charAt(0).toUpperCase() + speaker.slice(1)}:
        </div>
      )}
      <div className="relative max-w-2xl flex flex-col h-full w-full">
        {/* Main Tamil sentence – tooltips via parent */}
        <div
          ref={ref}
          className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg p-4 text-gray-800 text-base lg:text-lg leading-relaxed"
        >
          {question}
        </div>
        {/* English translation – plain text */}
        {translation && (
          <div className="mt-2 text-xs text-gray-500 italic border-l-2 border-gray-300 pl-3">
            {translation}
          </div>
        )}
        {/* Romanized Tamil text – with tooltips */}
        {romanized && (
          <div ref={romanizedRef} className="mt-1 text-sm text-gray-600 pl-3">
            {romanized}
          </div>
        )}
        {/* Icons container – pushed to bottom with mt-auto */}
        <div className="flex justify-center gap-3 mt-auto pt-3 pb-1">
          {audioSrc && (
            <>
              <button
                onClick={handleSpeakerClick}
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Play pronunciation"
              >
                <Volume2 className="w-6 h-6 text-blue-600 hover:text-blue-700 transition-colors" strokeWidth={1.8} />
              </button>
              <button
                onClick={handleMicClick}
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Voice input (coming soon)"
              >
                <Mic className="w-6 h-6 text-gray-600 hover:text-gray-700 transition-colors" strokeWidth={1.8} />
              </button>
            </>
          )}
          {onComplete && (
            <button
              onClick={handleStatusClick}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Mark as complete"
            >
              {statusCompleted ? (
                <CheckCircle className="w-6 h-6 text-green-600" strokeWidth={1.8} />
              ) : (
                <Circle className="w-6 h-6 text-gray-500 hover:text-gray-600 transition-colors" strokeWidth={1.8} />
              )}
            </button>
          )}
        </div>
        {/* Arrow pointer – unchanged */}
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