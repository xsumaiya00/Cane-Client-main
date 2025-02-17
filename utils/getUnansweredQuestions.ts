export type Stats = {
  date: string;
  overall_percentage_for_day: number;
  modules: Record<string, { questions: number[]; percentage: number }>;
};

type Question = {
  id: number;
  title: string;
};

const isActivityFromToday = (timestamp: string): boolean => {
  const today = new Date();
  const activityDate = new Date(timestamp);

  return (
    today.getFullYear() === activityDate.getFullYear() &&
    today.getMonth() === activityDate.getMonth() &&
    today.getDate() === activityDate.getDate()
  );
};

export const getUnansweredQuestions = (
  stats: Stats[],
  allQuestions: Question[],
  moduleSlug: string,
): Question[] => {
  const answeredQuestions = stats
    .filter((activity) => isActivityFromToday(activity.date))
    .flatMap((activity) => activity.modules[moduleSlug]?.questions || []);

  const unansweredQuestions = allQuestions.filter(
    (question) => !answeredQuestions.includes(question.id),
  );

  return unansweredQuestions;
};
