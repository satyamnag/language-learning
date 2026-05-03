type Props = {
  question: string;
  translation?: string;
};

export const QuestionBubble = ({ question, translation }: Props) => {
  return (
    <div className="flex items-center gap-x-4 mb-6">
      {/* Mascot images removed */}
      <div className="relative py-2 px-4 border-2 rounded-xl text-sm lg:text-base">
        {question}
        {translation && (
          <div className="mt-2 text-xs text-gray-500 border-t pt-1">
            {translation}
          </div>
        )}
        <div
          className="absolute -left-3 top-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-y-1/2 rotate-90"
        />
      </div>
    </div>
  );
};