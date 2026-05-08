// app/(marketing)/header.tsx

import Link from "next/link";
import { Loader } from "lucide-react";
import { 
  ClerkLoaded, 
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const Header = async () => {
  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-4">
      <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
        {/* Left: brand logo (visible only when signed out) */}
        <SignedOut>
          <Link href="/" className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
            <span className="text-2xl font-extrabold text-[#7C3AED] tracking-wide">
              Bol Bol Ke
            </span>
          </Link>
        </SignedOut>
        
        {/* Left spacer (keeps layout balanced when signed in) */}
        <SignedIn>
          <div className="w-10" />
        </SignedIn>

        {/* Right: login / loading */}
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/">
              <Button size="lg" variant="ghost">Login</Button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>
      </div>
    </header>
  );
};