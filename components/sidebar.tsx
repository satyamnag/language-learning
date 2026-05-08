import Link from "next/link";
import {
  ClerkLoading,
  ClerkLoaded,
  UserButton,
} from "@clerk/nextjs";
import { Loader, Medal, Target, Crown, History, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { Promo } from "./promo";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { SidebarProgress } from "./sidebar-progress";

type Props = {
  className?: string;
};

export const Sidebar = async ({ className }: Props) => {
  const userSubscription = await getUserSubscription();
  const userProgress = await getUserProgress();
  const isPro = !!userSubscription?.isActive;
  const totalPoints = userProgress?.points ?? 0;

  const navItems = [
    { label: "Leaderboard", href: "/leaderboard", icon: Medal },
    { label: "Quests", href: "/quests", icon: Target },
    { label: "Upgrade", href: "/upgrade", icon: Crown },
    { label: "History", href: "/history", icon: History },
  ];

  return (
    <div className={cn(
      "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col bg-white",
      className,
    )}>
      {/* Brand */}
      <Link href="/">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <span className="text-2xl font-extrabold text-[#7C3AED] tracking-wide">
            Bol Bol Ke
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <div className="flex flex-col gap-y-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-purple-50 hover:text-[#7C3AED] transition-colors duration-200"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Progress section */}
      <SidebarProgress />

      {/* Pro promo */}
      {!isPro && <Promo />}

      {/* User + points */}
      <div className="p-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-x-1.5 text-gray-600">
          <Coins className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-semibold">{totalPoints}</span>
        </div>
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