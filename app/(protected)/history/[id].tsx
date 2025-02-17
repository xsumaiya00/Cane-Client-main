import React from "react";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Loading from "@/components/Loading";
import Wrapper from "@/components/Wrapper";
import {
  useActivitiesWeeklyActivitiesRetrieve,
  useQuestionsBySlugRetrieve,
} from "@/utils/api/apiComponents";
import { useLocalSearchParams } from "expo-router";
import { Activity } from "@/utils/api/apiSchemas";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";

const formatResult = (slug: string, resultString: string) => {
  try {
    const results: any = JSON.parse(resultString);
    if (!Array.isArray(results)) {
      return resultString;
    }

    const values = results.map((item, index) => {
      let probability = "???";
      switch (slug) {
        case "ser":
          probability = parseFloat(item.probability).toFixed(1) + "%";
          break;
        case "ter":
          probability = parseFloat(item.percentage).toFixed(1) + "%";
          break;
        default:
          break;
      }

      return (
        <HStack key={index}>
          <Heading className="font-bold text-md">{item.emotion}: </Heading>
          <Text>{probability}</Text>
        </HStack>
      );
    });

    return values;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return resultString;
  }
};

export default function History() {
  const { id } = useLocalSearchParams();
  const { data: history, isLoading: historyLoading } =
    useActivitiesWeeklyActivitiesRetrieve({
      queryParams: { slug: typeof id === "string" ? id.toUpperCase() : id[0] },
    });
  const { data: questions, isLoading: questionsLoading } =
    useQuestionsBySlugRetrieve({
      queryParams: { slug: typeof id === "string" ? id.toUpperCase() : id[0] },
    });

  const hasActivities =
    Array.isArray(history) && history?.some((day) => day.activities.length > 0);

  const questionTitles = React.useMemo(() => {
    if (!questions || !Array.isArray(questions)) return new Map();
    return new Map(questions.map((q) => [q.id, q.title]));
  }, [questions]);

  if (historyLoading || questionsLoading) {
    return <Loading />;
  }

  if (
    (id !== "ser" &&
      id !== "ter" &&
      id !== "hrt" &&
      id !== "who" &&
      id !== "wss" &&
      id !== "sad" &&
      id !== "gad") ||
    !hasActivities
  ) {
    return (
      <Wrapper>
        <Center className="flex-1">
          <Text className="text-gray-500">No history available</Text>
        </Center>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Card variant="ghost" className="flex-1">
        {Array.isArray(history) &&
          history?.map(
            (dayData, index) =>
              dayData.activities.length > 0 && (
                <VStack key={index} className="w-full py-8">
                  <Heading className="text-xl font-bold mb-4">
                    {new Date(dayData.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Heading>
                  <Box className="rounded-lg overflow-hidden w-full border border-secondary-200 my-2">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Question</TableHead>
                          <TableHead>Results</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(dayData.activities) &&
                          dayData.activities.map(
                            (activity: Activity, activityIndex: number) => (
                              <TableRow key={activityIndex}>
                                {activity.timestamp && (
                                  <TableData>
                                    <Text>
                                      {new Date(
                                        activity.timestamp,
                                      ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </Text>
                                  </TableData>
                                )}
                                <TableData>
                                  <Text>
                                    {questionTitles.get(activity.question) ||
                                      "Unknown Question"}
                                  </Text>
                                </TableData>
                                <TableData>
                                  <VStack className="my-1">
                                    {formatResult(
                                      id as string,
                                      activity.result,
                                    )}
                                  </VStack>
                                </TableData>
                              </TableRow>
                            ),
                          )}
                      </TableBody>
                    </Table>
                  </Box>
                </VStack>
              ),
          )}
      </Card>
    </Wrapper>
  );
}
