import { cn } from "@/lib/utils";

type Props = {
  title: string;
};

export const Header = ({ title }: Props) => {
  // Remove back arrow and course title – keep only the sticky container for layout
  return (
    <div className="sticky top-0 bg-white pb-3 lg:pt-[28px] lg:mt-[-28px] flex items-center justify-between border-b-2 mb-5 text-neutral-400 lg:z-50">
      <div className="w-10" /> {/* left spacer */}
      <div />
      <div className="w-10" /> {/* right spacer */}
    </div>
  );
};