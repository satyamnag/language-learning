import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Props = {
  title: string;
  id: number;
  onClick: (id: number) => void;
  disabled?: boolean;
  active?: boolean;
};

export const Card = ({
  title,
  id,
  disabled,
  onClick,
  active,
}: Props) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        "bg-[#0140a1] text-white rounded-xl p-4 flex items-center justify-between cursor-pointer transition hover:bg-[#0140a1]/90",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <span className="text-lg font-bold">{title}</span>
      {active && (
        <div className="bg-green-500 rounded-full p-1">
          <Check className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
};