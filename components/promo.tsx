import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export const Promo = () => {
  return (
    <div className="border-2 rounded-xl p-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-x-2">
          <Image
            src="/unlimited.svg"
            alt="Pro"
            height={26}
            width={26}
          />
          <h3 className="font-bold text-lg">
            Upgrade to Pro
          </h3>
        </div>
        <p className="text-muted-foreground">
          Get unlimited access
        </p>
      </div>
      <Button
        asChild
        className="w-full bg-[#7C3AED] hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md shadow-purple-200/50 transition-all"
        size="lg"
      >
        <Link href="/shop">
          Upgrade today
        </Link>
      </Button>
    </div>
  );
};