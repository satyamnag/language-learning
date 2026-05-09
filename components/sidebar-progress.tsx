import { getCourseProgress, getLessonPercentage, getUserProgress } from "@/db/queries";

export const SidebarProgress = async () => {
  const userProgress = await getUserProgress();
  const courseProgress = await getCourseProgress();
  const lessonPercentage = await getLessonPercentage();

  if (!userProgress?.activeCourse || !courseProgress?.activeLesson) {
    return null;
  }

  const lessonTitle = courseProgress.activeLesson.title;
  const percentage = lessonPercentage;

  return (
    <div className="mt-4 px-4">
      <div className="text-sm font-medium text-gray-700 mb-1">
        {lessonTitle}
      </div>
      <div className="w-full bg-[#ede5f4] rounded-full h-2.5">
        <div
          className="bg-[#7C3AED] h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1 text-right">
        {Math.round(percentage)}% complete
      </div>
    </div>
  );
};