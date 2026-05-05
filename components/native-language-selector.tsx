"use client";

import { useTransition } from "react";
import { updateNativeLanguage } from "@/actions/user-settings";
import { Languages } from "lucide-react";

type Props = {
  currentNativeLanguage: string;
};

const LANGUAGE_LIST = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
];

export const NativeLanguageSelector = ({ currentNativeLanguage }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    startTransition(async () => {
      await updateNativeLanguage(newLang);
    });
  };

  return (
    <div className="group relative w-full transition-all duration-200 hover:shadow-md">
      <label
        htmlFor="native-language"
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        <span className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-blue-500" />
          I understand
        </span>
      </label>
      <div className="relative">
        <select
          id="native-language"
          value={currentNativeLanguage}
          onChange={handleChange}
          disabled={isPending}
          className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-10 text-gray-700 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 disabled:text-gray-400"
        >
          {LANGUAGE_LIST.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {isPending && (
        <p className="mt-1 text-xs text-gray-500 animate-pulse">Saving...</p>
      )}
    </div>
  );
};