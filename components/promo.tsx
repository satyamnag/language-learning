import Link from "next/link";
import { Infinity } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Promo = () => {
  return (
    <div className="border-2 rounded-xl p-4 space-y-4 w-3/4 lg:w-auto">
      <div className="space-y-2">
        <div className="flex items-center gap-x-2">
          <Infinity className="h-[26px] w-[26px]" />
          <h3 className="font-bold text-lg">
            Upgrade to Pro
          </h3>
        </div>
        <p className="text-gray-700">
          Get unlimited access
        </p>
      </div>
      <Button
        asChild
        className="w-full bg-[#7C3AED] hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md shadow-purple-200/50 transition-all"
        size="lg"
      >
        <Link href="/upgrade">
          Upgrade today
        </Link>
      </Button>
    </div>
  );
};