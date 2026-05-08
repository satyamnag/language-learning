import Link from "next/link";
import {
  ClerkLoading,
  ClerkLoaded,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";
import { Promo } from "./promo";
import { getUserSubscription } from "@/db/queries";
import { SidebarProgress } from "./sidebar-progress";

type Props = {
  className?: string;
};

export const Sidebar = async ({ className }: Props) => {
  const userSubscription = await getUserSubscription();
  const isPro = !!userSubscription?.isActive;

  return (
    <div className={cn(
      "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
      className,
    )}>
      <Link href="/">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <span className="text-2xl font-extrabold text-[#7C3AED] tracking-wide">
            Bol Bol Ke
          </span>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        {/* Courses item REMOVED */}
        <SidebarItem label="Leaderboard" href="/leaderboard" iconSrc="/leaderboard.svg" />
        <SidebarItem label="quests" href="/quests" iconSrc="/quests.svg" />
        <SidebarItem label="shop" href="/shop" iconSrc="/shop.svg" />
        <SidebarItem label="History" href="/history" iconSrc="/history.svg" />
      </div>

      <SidebarProgress />

      {!isPro && <Promo />}
      <div className="p-4">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div>
    </div>
  );
};