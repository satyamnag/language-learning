import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { useExitModal } from "@/store/use-exit-modal";

type Props = {
  title: string;            // lesson title
  currentIndex: number;    // 0‑based index of the current challenge
  totalCount: number;       // total number of challenges in the lesson
  percentage: number;       // overall lesson completion percentage
};

export const Header = ({
  title,
  currentIndex,
  totalCount,
  percentage,
}: Props) => {
  const { open } = useExitModal();

  return (
    <header className="lg:pt-[50px] pt-[20px] px-10 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
      <X
        onClick={open}
        className="text-slate-500 hover:opacity-75 transition cursor-pointer"
      />
      <div className="flex-1 text-center">
        <h2 className="text-base font-medium text-[#7C3AED] mb-1">{title}</h2>
        <Progress value={percentage} />
      </div>
      <div className="text-rose-500 flex items-center font-bold">
        {currentIndex + 1} / {totalCount}
      </div>
    </header>
  );
};