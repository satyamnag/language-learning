import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getPronunciationHistoryGrouped } from "@/db/queries";

const HistoryPage = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const records = await getPronunciationHistoryGrouped();

  if (records.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-neutral-800 mb-6">Pronunciation History</h1>
        <p className="text-muted-foreground">No assessments yet.</p>
      </div>
    );
  }

  // Group records by unit → lesson
  const grouped: Record<string, Record<string, typeof records>> = {};
  for (const rec of records) {
    if (!grouped[rec.unitTitle]) {
      grouped[rec.unitTitle] = {};
    }
    if (!grouped[rec.unitTitle][rec.lessonTitle]) {
      grouped[rec.unitTitle][rec.lessonTitle] = [];
    }
    grouped[rec.unitTitle][rec.lessonTitle].push(rec);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">Pronunciation History</h1>

      {Object.entries(grouped).map(([unitTitle, lessons]) => (
        <div key={unitTitle} className="mb-8">
          <h2 className="text-lg font-bold text-[#7C3AED] mb-2">{unitTitle}</h2>

          {Object.entries(lessons).map(([lessonTitle, items]) => (
            <div key={lessonTitle} className="mb-4 ml-4">
              <h3 className="text-base font-semibold text-neutral-700 mb-2">{lessonTitle}</h3>
              <div className="space-y-3">
                {items.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm text-gray-600">{rec.targetSentence}</p>
                        <p className="text-xs text-gray-500">You said: “{rec.spokenText}”</p>
                      </div>
                      <span className="text-lg font-bold text-[#7C3AED]">{rec.score}%</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{rec.explanation}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(rec.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HistoryPage;