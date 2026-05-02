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
    <div className="mt-4 p-4 border rounded-xl shadow-sm bg-white">
      <label htmlFor="native-language" className="block text-sm font-medium text-gray-700 mb-2">
        I understand
      </label>
      <div className="relative">
        <select
          id="native-language"
          value={currentNativeLanguage}
          onChange={handleChange}
          disabled={isPending}
          className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
        >
          {LANGUAGE_LIST.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Languages className="h-5 w-5 text-gray-400" />
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {isPending && <p className="text-sm text-gray-500 mt-2">Saving...</p>}
    </div>
  );
};