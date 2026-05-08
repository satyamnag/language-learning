import Link from "next/link";
import { Infinity } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Promo = () => {
  return (
    <div className="border-2 rounded-xl p-3 lg:p-4 space-y-3 lg:space-y-4 w-3/4 lg:w-auto">
      <div className="space-y-1.5 lg:space-y-2">
        <div className="flex items-center gap-x-1.5 lg:gap-x-2">
          <Infinity className="h-5 w-5 lg:h-[26px] lg:w-[26px]" />
          <h3 className="font-bold text-base lg:text-lg">
            Upgrade to Pro
          </h3>
        </div>
        <p className="text-gray-700 text-xs lg:text-sm leading-tight">
          Get unlimited access
        </p>
      </div>
      <Button
        asChild
        className="w-full bg-[#7C3AED] hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md shadow-purple-200/50 transition-all text-xs lg:text-sm"
        size="sm"
      >
        <Link href="/upgrade">
          Upgrade today
        </Link>
      </Button>
    </div>
  );
};