import { forwardRef } from 'react';
import Image from "next/image";

type Props = {
  question: string;
  translation?: string; // kept only for backward compatibility, not used
  speaker?: string;
};

export const QuestionBubble = forwardRef<HTMLDivElement, Props>(({ question, speaker }, ref) => {
  const imageSrc = speaker ? `/${speaker.toLowerCase()}.jpg` : null;

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
        {/* The Romanized translation line has been removed */}
        <div
          className="absolute -left-3 top-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-y-1/2 rotate-90"
        />
      </div>
    </div>
  );
});

QuestionBubble.displayName = 'QuestionBubble';