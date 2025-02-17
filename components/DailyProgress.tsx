import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Grid, GridItem } from "@/components/ui/grid";
import { Icon } from "@/components/ui/icon";
import { CheckIcon } from "lucide-react-native";
import { Heading } from "@/components/ui/heading";
import { Stats } from "@/utils/getUnansweredQuestions";

const ProgressCircle = ({
  percentage,
  day,
  isActive,
}: {
  percentage: number;
  day: string;
  isActive: boolean;
}) => {
  const COLORS = {
    bgZeroActive: "bg-red-100",
    bgZeroInactive: "bg-gray-50",
    bgLowActive: "bg-orange-100",
    bgLowInactive: "bg-orange-50",
    bgMediumActive: "bg-yellow-100",
    bgMediumInactive: "bg-yellow-50",
    bgHighActive: "bg-green-100",
    bgHighInactive: "bg-green-50",
    bgComplete: "bg-green-600",

    textZeroActive: "text-red-600",
    textZeroInactive: "text-gray-400",
    textLowActive: "text-orange-600",
    textLowInactive: "text-orange-400",
    textMediumActive: "text-yellow-600",
    textMediumInactive: "text-yellow-400",
    textHigh: "text-green-600",

    borderZero: "border-red-600",
    borderLow: "border-orange-600",
    borderMedium: "border-yellow-600",
    borderHigh: "border-green-600",
    borderDashed: "border-dashed",
  };

  const getBackgroundColor = () => {
    if (percentage === 100)
      return isActive ? COLORS.bgComplete : COLORS.bgComplete;
    if (percentage === 0)
      return isActive ? COLORS.bgZeroActive : COLORS.bgZeroInactive;
    if (percentage < 30)
      return isActive ? COLORS.bgLowActive : COLORS.bgLowInactive;
    if (percentage < 70)
      return isActive ? COLORS.bgMediumActive : COLORS.bgMediumInactive;
    return isActive ? COLORS.bgHighActive : COLORS.bgHighInactive;
  };

  const getTextColor = () => {
    if (percentage === 100) return isActive ? COLORS.textHigh : COLORS.textHigh;
    if (percentage === 0)
      return isActive ? COLORS.textZeroActive : COLORS.textZeroInactive;
    if (percentage < 30)
      return isActive ? COLORS.textLowActive : COLORS.textLowInactive;
    if (percentage < 70)
      return isActive ? COLORS.textMediumActive : COLORS.textMediumInactive;
    return isActive ? COLORS.textHigh : COLORS.textHigh;
  };

  const getBorderStyle = () => {
    if (percentage === 0) return `${COLORS.borderZero} ${COLORS.borderDashed}`;
    if (percentage < 30) return COLORS.borderLow;
    if (percentage < 70) return COLORS.borderMedium;
    return COLORS.borderHigh;
  };

  return (
    <Box
      className={`flex flex-col items-center justify-center p-2 ${isActive ? `rounded-xl border-2 ${getBorderStyle()}` : ""}`}
    >
      <Text
        className={`mb-1 text-bold text-base md:text-2xl ${getTextColor()}`}
      >
        {day}
      </Text>
      <Box
        className={`w-8 h-8 md:w-12 md:h-12 flex content-center items-center justify-center rounded-full 
          ${percentage === 0 && !isActive ? "border border-dashed" : ""} 
          ${getBackgroundColor()}`}
      >
        {percentage === 100 ? (
          <Icon as={CheckIcon} color="white" />
        ) : (
          <Text className={getTextColor()}>{Math.round(percentage)}%</Text>
        )}
      </Box>
    </Box>
  );
};

const DailyProgress = ({
  stats,
}: {
  stats: {
    date: string;
    overall_percentage_for_day: number;
    modules: Record<
      string,
      {
        questions: number[];
        percentage: number;
      }
    >;
  }[];
}) => {
  const days = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  const getWeekdayIndex = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getDay() === 0 ? 6 : date.getDay() - 1;
  };

  const getCurrentWeekStats = (stats: Stats[]) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - adjustedToday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return stats.filter((stat) => {
      const date = new Date(stat.date);
      return date >= startOfWeek && date <= endOfWeek;
    });
  };

  const currentWeekStats: Stats[] = getCurrentWeekStats(stats);

  const weekdayToStatsMap = currentWeekStats.reduce(
    (acc, stat) => {
      const weekdayIndex = getWeekdayIndex(stat.date);
      acc[weekdayIndex] = stat.overall_percentage_for_day;
      return acc;
    },
    {} as Record<number, number>,
  );

  return (
    <>
      <Box className="flex flex-row items-center mb-6">
        <Heading className="text-2xl font-bold text-gray-800 mr-8">
          Daily Progress
        </Heading>
      </Box>

      <Grid
        className="gap-4 mb-12"
        _extra={{
          className: "grid-cols-7",
        }}
      >
        {days.map((day, index) => (
          <GridItem
            key={`progress-circles-${days.length}-${index}`}
            _extra={{
              className: "col-span-2 md:col-span-1",
            }}
          >
            <ProgressCircle
              key={day}
              day={day}
              percentage={weekdayToStatsMap[index] || 0}
              isActive={index === adjustedToday}
            />
          </GridItem>
        ))}
      </Grid>
    </>
  );
};

export default DailyProgress;
