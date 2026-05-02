import Image from "next/image";
import { Loader } from "lucide-react";
import { 
  ClerkLoaded, 
  ClerkLoading, 
  SignInButton, 
  SignUpButton, 
  SignedIn, 
  SignedOut
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserProgress } from "@/db/queries";                     // <-- NEW import
import { NativeLanguageSelector } from "@/components/native-language-selector"; // <-- NEW import

export default async function Home() {                             // <-- now async
  const userProgress = await getUserProgress();                   // <-- fetch user data
  const currentNativeLanguage = userProgress?.nativeLanguage || "en"; // <-- default to English

  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
      <div className="relative w-[240px] h-[240px] lg:w-[424px] lg:h-[424px] mb-8 lg:mb-0">
        <Image src="/hero.png" fill alt="Hero" />
      </div>
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-center">
          Learn, practice, and master Indian languages with Us.
        </h1>
        <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
          <ClerkLoading>
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedOut>
              <SignUpButton
                mode="modal"
                fallbackRedirectUrl="/learn"
              >
                <Button size="lg" variant="primary" className="w-full">
                  Get Started
                </Button>
              </SignUpButton>
              <SignInButton
                mode="modal"
                fallbackRedirectUrl="/learn"
              >
                <Button size="lg" variant="primaryOutline" className="w-full">
                  I already have an account
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              {/* NEW: Native language selector appears only for signed‑in users */}
              <NativeLanguageSelector currentNativeLanguage={currentNativeLanguage} />
              <Button size="lg" variant="secondary" className="w-full" asChild>
                <Link href="/learn">
                  Continue Learning
                </Link>
              </Button>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
}