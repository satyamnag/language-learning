import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
};

export const UnitBanner = ({ title, description }: Props) => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] p-6 text-white shadow-lg shadow-purple-200/50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <h3 className="text-2xl font-extrabold tracking-tight">{title}</h3>
          <p className="text-base text-purple-100 leading-relaxed">{description}</p>
        </div>
        <Link href="/lesson" className="shrink-0">
          <Button
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto bg-white text-[#7C3AED] hover:bg-purple-50 font-semibold border-0 shadow-md transition-all duration-200 hover:scale-105"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};