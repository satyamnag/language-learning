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
import { getUserProgress } from "@/db/queries";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
  kn: "Kannada",
  or: "Odia",
  bn: "Bengali",
};

export const Header = async () => {
  const userProgress = await getUserProgress();
  const nativeLanguage = userProgress?.nativeLanguage || "en";
  const nativeLangName = LANGUAGE_NAMES[nativeLanguage] || nativeLanguage;
  const learningLangName = userProgress?.activeCourse?.title || "";

  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-4">
      <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
        {/* Always visible logo – prevents layout shift */}
        <Link href="/" className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <span className="text-2xl font-extrabold text-[#7C3AED] tracking-wide">
            Bol Bol Ke
          </span>
        </Link>

        <SignedIn>
          {learningLangName && (
            <div className="text-xs sm:text-sm font-semibold bg-[#7C3AED] text-white px-3 py-1.5 rounded-full shadow-md shadow-purple-200/50 whitespace-nowrap">
              {nativeLangName} → {learningLangName}
            </div>
          )}
        </SignedIn>

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