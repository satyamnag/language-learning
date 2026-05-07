import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { getPronunciationHistory } from "@/db/queries";
import { Card } from "@/components/ui/card";

const HistoryPage = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const records = await getPronunciationHistory(userId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">Pronunciation History</h1>
      {records.length === 0 ? (
        <p className="text-muted-foreground">No assessments yet.</p>
      ) : (
        <div className="space-y-4">
          {records.map((rec) => (
            <Card key={rec.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{rec.targetSentence}</p>
                  <p className="text-sm text-gray-500">You said: “{rec.spokenText}”</p>
                </div>
                <span className="text-2xl font-bold text-[#7C3AED]">{rec.score}%</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{rec.explanation}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(rec.createdAt).toLocaleString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;