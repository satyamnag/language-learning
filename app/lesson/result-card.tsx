import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  variant: "points" | "hearts" | "average";
  value: number;
  isAvailable?: boolean;   // ← this is the missing prop
};

export const ResultCard = ({ variant, value, isAvailable = true }: Props) => {
  if (variant === "average") {
    const colorClass =
      isAvailable
        ? value <= 50
          ? "text-red-500"
          : value <= 75
          ? "text-yellow-500"
          : "text-green-500"
        : "text-neutral-400";

    return (
      <div className="w-full rounded-2xl border-2 p-4 bg-white text-center">
        <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
          AVERAGE %
        </p>
        <p className={cn("text-3xl font-extrabold", colorClass)}>
          {isAvailable ? `${value}%` : "N/A"}
        </p>
      </div>
    );
  }

  // points / hearts card (unchanged)
  const imageSrc = variant === "points" ? "/points.svg" : "/heart.svg";

  return (
    <div className="w-full rounded-2xl border-2 p-4 bg-white text-center">
      <Image
        src={imageSrc}
        alt={variant}
        height={30}
        width={30}
        className="mx-auto mb-2"
      />
      <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
        {variant === "points" ? "Total XP" : "Hearts Left"}
      </p>
      <p className="text-3xl font-extrabold text-neutral-700">
        {value}
      </p>
    </div>
  );
};