import { Button, ButtonText } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";
import {
  AndroidAudioEncoder,
  AndroidOutputFormat,
  IOSOutputFormat,
  Recording,
} from "expo-av/build/Audio";
import { Platform, useWindowDimensions } from "react-native";
import ErrorAlert from "@/components/ErrorAlert";
import { useSession } from "@/utils/AuthContext";
import Wrapper from "@/components/Wrapper";
import { Card } from "@/components/ui/card";
import { Mic, PauseCircle, PlayCircleIcon } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { white } from "tailwindcss/colors";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { router } from "expo-router";
import Loading from "@/components/Loading";
import { Icon } from "@/components/ui/icon";
import React from "react";
import {
  useActivitiesWeeklyStatsRetrieve,
  useModulesBySlugRetrieve,
  usePredictSerCreate,
  useQuestionsBySlugRetrieve,
  useSaveActivityCreate,
} from "@/utils/api/apiComponents";
import HistoryLink from "@/components/HistoryLink";
// import { getUnansweredQuestions } from "@/utils/getUnansweredQuestions";

export default function AudioModule() {
  if (Platform.OS === "web") {
    document.title = "Audio";
  }

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 640;

  const { session } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [predictions, setPredictions] = useState<
    { emotion: string; probability: string }[]
  >([]);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [recording, setRecording] = useState<Recording>();
  const [audioPermissionResponse, audioRequestPermission] =
    Audio.usePermissions();
  const { mutateAsync: predict, isPending: predictPending } =
    usePredictSerCreate({});

  const { data: serModule, isLoading: serModuleLoading } =
    useModulesBySlugRetrieve({
      queryParams: { slug: "SER" },
    });
  const { data: serQuestions, isLoading: serLoading } =
    useQuestionsBySlugRetrieve({
      queryParams: { slug: "SER" },
    });
  const { mutateAsync: saveData, isPending: savePending } =
    useSaveActivityCreate({});
  const { data: stats, isLoading: statsLoading } =
    useActivitiesWeeklyStatsRetrieve({});
  // Enable when the decision is made to use the getUnansweredQuestions function
  // const serQuestions = rawQuestions
  //   ? getUnansweredQuestions(stats, rawQuestions, "SER")
  //   : null;

  async function startRecording() {
    try {
      if (audioPermissionResponse?.status !== "granted") {
        console.log("Requesting audio permission..");
        await audioRequestPermission();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync({
        isMeteringEnabled: true,
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
          extension: ".wav",
          outputFormat: AndroidOutputFormat.DEFAULT,
          audioEncoder: AndroidAudioEncoder.DEFAULT,
        },
        ios: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
          extension: ".wav",
          outputFormat: IOSOutputFormat.LINEARPCM,
        },
        web: {
          mimeType: "audio/webm",
          bitsPerSecond: 128000,
        },
      });
      setRecording(recording);
      console.log("Recording started");
    } catch (err: any) {
      setPredictionError(err?.message || "Failed to start recording");
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setPredictions([]);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const recordingUri = recording?.getURI();

    if (recordingUri) {
      console.log("Sending recording to server..");

      const formData: any = new FormData();
      if (Platform.OS === "web") {
        const response = await fetch(recordingUri);
        const blob = await response.blob();
        formData.append("file", blob, "audio.wav");
      } else {
        formData.append("file", {
          uri: recordingUri,
          name: "audio.wav",
          type: "audio/wav",
        });
      }

      await predict({
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${session}`,
        },
        body: formData,
      })
        .then(async (data: any) => {
          const sortedPredictions = data?.predictions
            .map((prediction: any) => {
              const value = Array.isArray(prediction.probability)
                ? Math.max(...prediction.probability)
                : prediction.probability;

              return {
                emotion:
                  prediction.emotion.charAt(0).toUpperCase() +
                  prediction.emotion.slice(1),
                probability: (value * 100).toFixed(2),
              };
            })
            .sort((a: any, b: any) => b.probability - a.probability)
            .slice(0, 3);

          setRecording(undefined);
          setPredictions(sortedPredictions);
          await saveData({
            body: {
              activities: [
                {
                  question_id: currentQuestion.id,
                  result: JSON.stringify(sortedPredictions),
                },
              ],
            },
          });
          setFormSubmitted(true);
        })
        .catch((error) => {
          setRecording(undefined);
          if (error?.stack?.detail) {
            setPredictionError(error?.stack?.detail);
          } else {
            setPredictionError(
              error?.message || "An unknown error has occurred",
            );
          }
        });
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (serQuestions?.length || 1) - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setFormSubmitted(false);
      setPredictions([]);
    }
  };

  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, []);

  if (
    serLoading ||
    !serQuestions ||
    serModuleLoading ||
    !serModule ||
    !stats ||
    statsLoading
  ) {
    return <Loading />;
  } else if (serQuestions?.length === 0) {
    return (
      <Wrapper>
        <Center className="flex-1">
          <Text>There is no tasks yet</Text>
        </Center>
      </Wrapper>
    );
  }

  const currentQuestion = serQuestions?.[currentQuestionIndex];
  const isLastQuestion =
    serQuestions && currentQuestionIndex === serQuestions.length - 1;

  const MicSized = () => <Mic size={24} color="black" />;
  const PlayCircleSized = () => <PlayCircleIcon size={36} color="white" />;
  const PauseCircleSized = () => <PauseCircle size={36} color="white" />;

  return (
    <Wrapper>
      <Center className="flex-1">
        <Card
          variant={isSmallScreen ? "ghost" : "outline"}
          className="w-96 py-6"
        >
          <VStack className="pb-5">
            <HStack className="text-xl flex items-center space-x-2 pb-2">
              <Icon as={MicSized} />
              <Heading className="pl-4">{serModule[0].title}</Heading>
            </HStack>

            {!formSubmitted ? (
              <>
                <Text className="text-sm text-typography-500">
                  {serModule[0].instructions}
                </Text>
                <VStack className="items-center justify-center">
                  <Heading className="my-8">
                    {currentQuestion?.title || "Loading question"}...
                  </Heading>
                  <Pressable
                    onPress={recording ? stopRecording : startRecording}
                    className={`flex items-center justify-center rounded-full w-16 h-16 ${
                      recording || predictPending || savePending
                        ? "bg-secondary-500"
                        : "bg-primary-950"
                    }`}
                  >
                    {predictPending || savePending ? (
                      <Spinner className="w-6 h-6" color={white} />
                    ) : recording ? (
                      <Icon as={PauseCircleSized} />
                    ) : (
                      <Icon as={PlayCircleSized} />
                    )}
                  </Pressable>
                </VStack>
              </>
            ) : (
              <VStack className="mt-4">
                {predictions.map((prediction, index) => (
                  <HStack key={index} className="items-center mb-1">
                    <Heading size="md">{prediction.emotion}: </Heading>
                    <Text size="md">{prediction.probability}%</Text>
                  </HStack>
                ))}

                {!isLastQuestion ? (
                  <Button onPress={handleNextQuestion} className="mt-4">
                    <ButtonText>Next Question</ButtonText>
                  </Button>
                ) : (
                  <Button
                    onPress={() => {
                      setCurrentQuestionIndex(0);
                      setFormSubmitted(false);
                      setPredictions([]);
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
          <HistoryLink module="ser" />
        </Card>
      </Center>
    </Wrapper>
  );
}
