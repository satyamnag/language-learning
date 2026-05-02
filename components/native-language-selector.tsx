"use client";

import { useTransition } from "react";
import { updateNativeLanguage } from "@/actions/user-settings";

type Props = {
  currentNativeLanguage: string;
};

const LANGUAGE_LIST = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "te", name: "Telugu" },
  { code: "ta", name: "Tamil" },
  { code: "kn", name: "Kannada" },
  { code: "or", name: "Odia" },
  { code: "bn", name: "Bengali" },
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
    <div className="mt-4 p-3 border rounded-lg shadow-sm bg-white">
      <label htmlFor="native-language" className="block text-sm font-medium text-gray-700 mb-1">
        Your native language:
      </label>
      <select
        id="native-language"
        value={currentNativeLanguage}
        onChange={handleChange}
        disabled={isPending}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      >
        {LANGUAGE_LIST.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      {isPending && <p className="text-sm text-gray-500 mt-1">Saving...</p>}
    </div>
  );
};