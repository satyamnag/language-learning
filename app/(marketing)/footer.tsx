import { Button } from "@/components/ui/button";
import { getUserProgress } from "@/db/queries";

// Map language codes to their names in various native languages
const LOCALIZED_NAMES: Record<string, Record<string, string>> = {
  or: { en: "Odia", hi: "ओड़िया", or: "ଓଡ଼ିଆ", te: "ఒడియా", ta: "ஒடியா", kn: "ಒಡಿಯಾ", bn: "ওড়িয়া" },
  te: { en: "Telugu", hi: "तेलुगु", or: "ତେଲୁଗୁ", te: "తెలుగు", ta: "தெலுங்கு", kn: "ತೆಲುಗು", bn: "তেলুগু" },
  ta: { en: "Tamil", hi: "तमिल", or: "ତାମିଲ", te: "తమిళం", ta: "தமிழ்", kn: "ತಮಿಳು", bn: "তামিল" },
  kn: { en: "Kannada", hi: "कन्नड़", or: "କନ୍ନଡ", te: "కన్నడ", ta: "கன்னடம்", kn: "ಕನ್ನಡ", bn: "ಕನ್ನಡ" },
  bn: { en: "Bengali", hi: "बंगाली", or: "ବଙ୍ଗାଳୀ", te: "బెంగాలీ", ta: "வங்காளம்", kn: "ಬಂಗಾಳಿ", bn: "বাংলা" },
};

export const Footer = async () => {
  const userProgress = await getUserProgress();
  const nativeLang = userProgress?.nativeLanguage || "en";

  const languages = [
    { code: "or", nameEn: "Odia" },
    { code: "te", nameEn: "Telugu" },
    { code: "ta", nameEn: "Tamil" },
    { code: "kn", nameEn: "Kannada" },
    { code: "bn", nameEn: "Bengali" },
  ];

  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            size="lg"
            className="w-full bg-[#0140a1] text-white hover:bg-[#0140a1]/90"
          >
            {LOCALIZED_NAMES[lang.code]?.[nativeLang] || lang.nameEn}
          </Button>
        ))}
      </div>
    </footer>
  );
};