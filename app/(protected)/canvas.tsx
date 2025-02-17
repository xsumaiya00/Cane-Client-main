import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  PanResponder,
  NativeModules,
  NativeEventEmitter,
} from "react-native";
import { Canvas, Path, SkPath, Skia } from "@shopify/react-native-skia";
import base64 from "react-native-base64";
import { router } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import ErrorAlert from "@/components/ErrorAlert";
import Wrapper from "@/components/Wrapper";
import Loading from "@/components/Loading";
import { Brush } from "lucide-react-native";
import { Image } from "@/components/ui/image";

import { TEventObject, normalizeEventData } from "@/utils/normalizeEvent";
import { useWindowDimensions } from "react-native";
import { Icon } from "@/components/ui/icon";
import { gray } from "tailwindcss/colors";
import { useIsFocused } from "@react-navigation/native";
import {
  useModulesBySlugRetrieve,
  usePredictHrtaCreate,
  usePredictHrtdCreate,
  usePredictHrtsCreate,
  useQuestionsBySlugRetrieve,
  useSaveActivityCreate,
} from "@/utils/api/apiComponents";

const taskImages: Record<number, any> = {
  1: require("../../assets/images/hrt_1.png"),
  2: require("../../assets/images/hrt_2.png"),
  4: require("../../assets/images/hrt_4.png"),
  5: require("../../assets/images/hrt_4.png"),
  6: require("../../assets/images/hrt_6.png"),
};

const { MotionEventModule } = NativeModules;
const motionEventEmitter = new NativeEventEmitter(MotionEventModule);

export default function CanvasModule() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 640;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [taskNumber, setTaskNumber] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [paths, setPaths] = useState<SkPath[]>([]);
  const [currentPath, setCurrentPath] = useState<SkPath | null>(null);

  const eventQueueRef = useRef<string[]>([]);
  const isFocused = useIsFocused();

  const [results, setResults] = useState<{
    A?: { prediction: string; prob: string };
    D?: { prediction: string; prob: string };
    S?: { prediction: string; prob: string };
  }>({});
  const [predictionError, setPredictionError] = useState<string | null>(null);

  const { mutateAsync: predictA, isPending: predictAPending } =
    usePredictHrtaCreate({});
  const { mutateAsync: predictD, isPending: predictDPending } =
    usePredictHrtdCreate({});
  const { mutateAsync: predictS, isPending: predictSPending } =
    usePredictHrtsCreate({});

  const { data: hrtModule, isLoading: hrtModuleLoading } =
    useModulesBySlugRetrieve({
      queryParams: { slug: "HRT" },
    });
  const { data: hrtQuestions, isLoading: hrtLoading } =
    useQuestionsBySlugRetrieve({
      queryParams: { slug: "HRT" },
    });
  const { mutateAsync: saveData } = useSaveActivityCreate({});

  const updateTaskNumber = useCallback(() => {
    const currentQuestionTitle = hrtQuestions?.[currentQuestionIndex]?.title;
    const match = currentQuestionTitle?.match(/Task (\d+)/);
    setTaskNumber(match ? parseInt(match[1], 10) : 1);
  }, [hrtQuestions, currentQuestionIndex]);

  useEffect(() => {
    updateTaskNumber();
  }, [currentQuestionIndex, updateTaskNumber]);

  const handleMotionEvent = (event: TEventObject) => {
    const normalizedEvent = normalizeEventData(event);
    eventQueueRef.current.push(normalizedEvent);
  };

  useEffect(() => {
    if (isFocused) {
      MotionEventModule.startListening();

      const subscription = motionEventEmitter.addListener(
        "MotionEvent",
        handleMotionEvent,
      );

      return () => {
        subscription.remove();
        MotionEventModule.stopListening();
      };
    } else {
      MotionEventModule.stopListening();
    }
  }, [isFocused]);

  const handleSubmit = useCallback(() => {
    setResults({});
    setPredictionError(null);

    if (eventQueueRef.current.length <= 33) {
      setPredictionError("Please draw something before submitting");
      return;
    }

    const concatenatedEvents = `${eventQueueRef.current.length}\n${eventQueueRef.current.join("\n")}`;
    const base64String = base64.encode(concatenatedEvents);

    setPaths([]);
    eventQueueRef.current = [];

    const currentQuestionTitle = hrtQuestions?.[currentQuestionIndex].title;
    let taskNumber = 1;
    const match = currentQuestionTitle.match(/Task (\d+)/);
    if (match) {
      taskNumber = match[1];
    }

    Promise.all([
      predictA({
        body: { base64_svc_data: base64String, task_number: taskNumber },
      }),
      predictD({
        body: { base64_svc_data: base64String, task_number: taskNumber },
      }),
      predictS({
        body: { base64_svc_data: base64String, task_number: taskNumber },
      }),
    ])
      .then(async (responses: any) => {
        setResults({
          A: {
            prediction: responses[0]?.prediction[0] || "",
            prob: responses[0]?.prob || "",
          },
          D: {
            prediction: responses[1]?.prediction[0] || "",
            prob: responses[1]?.prob || "",
          },
          S: {
            prediction: responses[2]?.prediction[0] || "",
            prob: responses[2]?.prob || "",
          },
        });
        if (hrtQuestions && hrtQuestions[currentQuestionIndex]) {
          await saveData({
            body: {
              activities: [
                {
                  question_id: hrtQuestions[currentQuestionIndex].id,
                  result: JSON.stringify(results),
                },
              ],
            },
          });
        }
        setFormSubmitted(true);
      })
      .catch((error) => {
        setFormSubmitted(false);
        setResults({});
        setPaths([]);
        setCurrentPath(null);
        eventQueueRef.current = [];
        setPredictionError(
          error?.stack?.detail ||
            error?.message ||
            "An unknown error has occurred",
        );
      });
  }, [
    currentQuestionIndex,
    hrtQuestions,
    predictA,
    predictD,
    predictS,
    results,
    saveData,
  ]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,

        onPanResponderGrant: (event) => {
          const { locationX: x, locationY: y } = event.nativeEvent;

          if (x < 0 || x > 300 || y < 0 || y > 300) {
            return;
          }

          const newPath = Skia.Path.Make();
          newPath.moveTo(x, y);
          setCurrentPath(newPath);
          setPaths((old) => [...old, newPath]);
        },

        onPanResponderMove: (event) => {
          const { locationX: x, locationY: y } = event.nativeEvent;

          if (x < 0 || x > 300 || y < 0 || y > 300) {
            return;
          }

          if (currentPath) {
            currentPath.lineTo(x, y);

            setPaths((currentPaths) => {
              const updatedPaths = [...currentPaths];
              updatedPaths[updatedPaths.length - 1] = currentPath;
              return updatedPaths;
            });
          }
        },

        onPanResponderRelease: () => {
          setCurrentPath(null);
        },
      }),
    [currentPath],
  );

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (hrtQuestions?.length || 1) - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setFormSubmitted(false);
      setResults({});
      setPaths([]);
      setCurrentPath(null);
      eventQueueRef.current = [];
    }
  };

  if (hrtLoading || hrtModuleLoading || !hrtQuestions || !hrtModule) {
    return <Loading />;
  } else if (hrtQuestions?.length === 0) {
    return (
      <Wrapper>
        <Center className="flex-1">
          <Text>There are no tasks yet</Text>
        </Center>
      </Wrapper>
    );
  }

  const currentQuestion = hrtQuestions?.[currentQuestionIndex];
  const isLastQuestion =
    hrtQuestions && currentQuestionIndex === hrtQuestions.length - 1;

  const BrushSized = () => <Brush size={24} color="black" />;

  return (
    <Center className="flex-1">
      <Card variant={isSmallScreen ? "ghost" : "outline"} className="w-96 py-6">
        <VStack>
          <HStack className="pb-4">
            <Icon as={BrushSized} />
            <Heading className="pl-4">{hrtModule[0].title}</Heading>
          </HStack>

          {!formSubmitted ? (
            <>
              <Text className="text-sm text-typography-500">
                {hrtModule[0].instructions}
              </Text>
              <VStack className="mt-4 space-y-4 items-center justify-center">
                <Heading className="text-center my-4">
                  {currentQuestion?.title || "Loading question"}...
                </Heading>

                {taskNumber !== 3 && taskNumber !== 7 && (
                  <View className="mb-4 border border-dashed border-gray-300">
                    <Image
                      source={taskImages[taskNumber]}
                      alt="Task image"
                      style={{
                        width: 400,
                        height: 300,
                      }}
                    />
                  </View>
                )}

                <View
                  {...panResponder.panHandlers}
                  style={{
                    width: 300,
                    height: 300,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                    borderStyle: "solid",
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Canvas style={{ width: "100%", height: "100%" }}>
                    {paths.map((path, index) => (
                      <Path
                        key={index}
                        path={path}
                        color="black"
                        style="stroke"
                        strokeWidth={2}
                      />
                    ))}
                  </Canvas>
                </View>

                <Button
                  onPress={handleSubmit}
                  className="mt-4"
                  style={{ width: 300 }}
                >
                  {(predictAPending || predictDPending || predictSPending) && (
                    <ButtonSpinner className="mr-2" color={gray[500]} />
                  )}
                  <ButtonText>Submit Drawing</ButtonText>
                </Button>
              </VStack>
            </>
          ) : (
            <VStack className="mt-4 space-y-2">
              {Object.entries(results).map(([key, value]) => {
                const type =
                  key === "D"
                    ? "Depression"
                    : key === "A"
                      ? "Anxiety"
                      : "Stress";

                const severity =
                  value.prediction.at(1) === "0"
                    ? "Normal"
                    : value.prediction.at(1) === "1"
                      ? "Mild"
                      : "Above mild";

                return (
                  <VStack key={key} className="mb-2">
                    <HStack className="items-center mb-1">
                      <Heading size="md">{type} level: </Heading>
                      <Text>
                        {severity} ({value.prediction})
                      </Text>
                    </HStack>
                  </VStack>
                );
              })}

              {!isLastQuestion ? (
                <Button onPress={handleNextQuestion} className="mt-4">
                  <ButtonText>Next Question</ButtonText>
                </Button>
              ) : (
                <Button
                  onPress={() => {
                    setCurrentQuestionIndex(0);
                    setFormSubmitted(false);
                    setResults({});
                    router.replace("/dashboard");
                  }}
                  className="mt-4"
                >
                  <ButtonText>Finish</ButtonText>
                </Button>
              )}
            </VStack>
          )}

          <ErrorAlert error={predictionError} setError={setPredictionError} />
        </VStack>
      </Card>
    </Center>
  );
}
