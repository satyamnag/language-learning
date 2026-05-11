import { redirect } from "next/navigation";

import { getLesson, getUserProgress, getUserSubscription, getPronunciationHistory } from "@/db/queries";

import { Quiz } from "../quiz";

type Props = {
  params: {
    lessonId: number;
  };
};

const LessonIdPage = async ({
  params,
}: Props) => {
  const lessonData = getLesson(params.lessonId);
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const pronunciationHistoryData = getPronunciationHistory();

  const [
    lesson,
    userProgress,
    userSubscription,
    pronunciationHistory,
  ] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData,
    pronunciationHistoryData,
  ]);

  if (!lesson || !userProgress) {
    redirect("/");
  }

  const initialPercentage = lesson.challenges
    .filter((challenge) => challenge.completed)
    .length / lesson.challenges.length * 100;

  return ( 
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubscription}
      lessonTitle={lesson.title}
      initialPronunciationHistory={pronunciationHistory}
    />
  );
};
 
export default LessonIdPage;