"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateNativeLanguage } from "@/actions/user-settings";
import { Languages } from "lucide-react";

const LANGUAGE_LIST = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
];

type Props = {
  currentNativeLanguage: string;
};

export const NativeLanguageSelector = ({ currentNativeLanguage }: Props) => {
  const router = useRouter();
  const current = LANGUAGE_LIST.find((l) => l.code === currentNativeLanguage);

  const handleSelect = async (code: string) => {
    try {
      await updateNativeLanguage(code);
      router.refresh();
    } catch {
      toast.error("Failed to update language");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between border border-gray-300 bg-white shadow-sm"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Languages className="h-4 w-4" />
            I understand
          </span>
          {current && (
            <span className="ml-2 text-[#7C3AED]">{current.name}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {LANGUAGE_LIST.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className="flex justify-between"
          >
            {lang.name}
            {lang.code === currentNativeLanguage && <span className="text-green-500">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};