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
        <SignedOut>
          <Link href="/" className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
            <span className="text-2xl font-extrabold text-blue-600 tracking-wide">
              bolbolke
            </span>
          </Link>
        </SignedOut>
        <SignedIn>
          <div className="w-10" /> {/* spacer to keep layout balanced */}
        </SignedIn>

        <SignedIn>
          {learningLangName && (
            <div className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
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