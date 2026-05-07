import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { useExitModal } from "@/store/use-exit-modal";

type Props = {
  title: string;
  currentIndex: number;
  totalCount: number;
  percentage: number;
};

export const Header = ({
  title,
  currentIndex,
  totalCount,
  percentage,
}: Props) => {
  const { open } = useExitModal();

  return (
    <header className="lg:pt-[50px] pt-[20px] px-4 lg:px-10 flex gap-x-4 lg:gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
      <X
        onClick={open}
        className="text-red-500 hover:text-red-600 hover:opacity-75 transition cursor-pointer w-5 h-5 lg:w-6 lg:h-6"
      />
      <div className="flex-1 text-center">
        <h2 className="text-sm lg:text-lg font-bold text-[#7C3AED] mb-1">{title}</h2>
        <Progress
          value={percentage}
          className="bg-[#ede5f4] [&>div]:bg-[#7C3AED]"
        />
      </div>
      <div className="text-[#7A7581] flex items-center font-bold text-sm lg:text-base">
        {currentIndex + 1} / {totalCount}
      </div>
    </header>
  );
};