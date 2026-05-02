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
import { getUserProgress } from "@/db/queries";
import { NativeLanguageSelector } from "@/components/native-language-selector";

export default async function Home() {
  const userProgress = await getUserProgress();
  const currentNativeLanguage = userProgress?.nativeLanguage || "en";

  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
      {/* Hero image removed */}
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-center">
          Learn, practice, and master Indian regional languages with{" "}
          <span className="text-blue-600 font-bold">SUNO</span>{" "}
          <span className="text-green-600 font-bold">BOLO</span>.
        </h1>
        <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
          <ClerkLoading>
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedOut>
              <SignUpButton mode="modal" fallbackRedirectUrl="/learn">
                <Button size="lg" variant="primary" className="w-full">
                  Get Started
                </Button>
              </SignUpButton>
              <SignInButton mode="modal" fallbackRedirectUrl="/learn">
                <Button size="lg" variant="primaryOutline" className="w-full">
                  I already have an account
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <NativeLanguageSelector currentNativeLanguage={currentNativeLanguage} />
              <Button size="lg" variant="secondary" className="w-full mt-3" asChild>
                <Link href="/learn">Continue Learning</Link>
              </Button>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
}