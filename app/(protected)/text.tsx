import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Center } from "@/components/ui/center";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import ErrorAlert from "@/components/ErrorAlert";
import TextInput from "@/components/TextInput";
import { TextSchemaType, textSchema } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Wrapper from "@/components/Wrapper";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { FileText } from "lucide-react-native";
import { gray } from "tailwindcss/colors";
import { Platform, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import Loading from "@/components/Loading";
import { Icon } from "@/components/ui/icon";
import AlertIcon from "@/components/AlertIcon";
import {
  useActivitiesWeeklyStatsRetrieve,
  useModulesBySlugRetrieve,
  usePredictTerCreate,
  useQuestionsBySlugRetrieve,
  useSaveActivityCreate,
} from "@/utils/api/apiComponents";
import HistoryLink from "@/components/HistoryLink";
// import { getUnansweredQuestions } from "@/utils/getUnansweredQuestions";

export default function TextModule() {
  if (Platform.OS === "web") {
    document.title = "Text Emotion";
  }

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 640;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [isTextFocused, setIsTextFocused] = useState<boolean>(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [predictionText, setPredictionText] = useState<
    { emotion: string; percentage: string }[]
  >([]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<TextSchemaType>({
    resolver: zodResolver(textSchema),
  });

  const { mutateAsync: predict, isPending: predictPending } =
    usePredictTerCreate({});
  const { data: terModule, isLoading: terModuleLoading } =
    useModulesBySlugRetrieve({
      queryParams: { slug: "TER" },
    });
  const { data: terQuestions, isLoading: terLoading } =
    useQuestionsBySlugRetrieve({
      queryParams: { slug: "TER" },
    });
  const { mutateAsync: saveData, isPending: savePending } =
    useSaveActivityCreate({});
  const { data: stats, isLoading: statsLoading } =
    useActivitiesWeeklyStatsRetrieve({});
  // Enable when the decision is made to use the getUnansweredQuestions function
  // const terQuestions = rawQuestions
  //   ? getUnansweredQuestions(stats, rawQuestions, "TER")
  //   : null;

  const onSubmit = useCallback(
    async (_data: TextSchemaType) => {
      setPredictionText([]);
      const currentQuestion = terQuestions?.[currentQuestionIndex];
      if (!currentQuestion) return;

      await predict({
        body: {
          model_version: "EmoMosaic-base",
          context: currentQuestion.title,
          sentence: _data.text,
          labels: [
            "happiness",
            "sadness",
            "surprise",
            "fear",
            "disgust",
            "anger",
          ],
        },
      })
        .then(async (response: any) => {
          if (
            response.predictions &&
            typeof response.predictions === "object"
          ) {
            const predictions = Object.entries(response.predictions)
              .map(([emotion, value]: [emotion: any, value: any]) => ({
                emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
                percentage: (value * 100).toFixed(2),
              }))
              .sort((a: any, b: any) => b.percentage - a.percentage)
              .slice(0, 3);

            setPredictionText(predictions);
            await saveData({
              body: {
                activities: [
                  {
                    question_id: currentQuestion.id,
                    result: JSON.stringify(predictions),
                  },
                ],
              },
            });
            setFormSubmitted(true);
          }

          reset();
        })
        .catch((error) => {
          setPredictionError(error?.message || "An unknown error has occurred");
        });
    },
    [terQuestions, currentQuestionIndex, predict, reset, saveData],
  );

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (terQuestions?.length || 1) - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setFormSubmitted(false);
      reset();
      setPredictionText([]);
    }
  };

  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, []);

  if (
    terLoading ||
    terModuleLoading ||
    !terQuestions ||
    !terModule ||
    !stats ||
    statsLoading
  ) {
    return <Loading />;
  } else if (terQuestions?.length === 0) {
    return (
      <Wrapper>
        <Center className="flex-1">
          <Text>There is no tasks yet</Text>
        </Center>
      </Wrapper>
    );
  }

  const currentQuestion = terQuestions?.[currentQuestionIndex];
  const isLastQuestion =
    currentQuestionIndex === (terQuestions?.length || 1) - 1;

  const FileTextSized = () => <FileText size={24} color="black" />;

  return (
    <Wrapper>
      <Center className="flex-1">
        <Card
          variant={isSmallScreen ? "ghost" : "outline"}
          className="w-96 py-6"
        >
          <VStack className="pb-3">
            <HStack className="text-xl flex items-center space-x-2 pb-2">
              <Icon as={FileTextSized} />
              <Heading className="pl-4">{terModule[0].title}</Heading>
            </HStack>

            {formSubmitted ? (
              <>
                <VStack className="mt-4">
                  {predictionText.map((prediction, index) => (
                    <HStack key={index} className="items-center mb-1">
                      <Heading size="md">{prediction.emotion}: </Heading>
                      <Text size="md">{prediction.percentage}%</Text>
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
                        setPredictionText([]);
                        router.replace("/dashboard");
                      }}
                      className="mt-4"
                    >
                      <ButtonText>Finish</ButtonText>
                    </Button>
                  )}
                </VStack>
              </>
            ) : (
              <>
                <Text className="text-sm text-typography-500">
                  {terModule[0].instructions}
                </Text>
                <VStack className="mt-4 space-y-2">
                  <Heading className="mb-4">
                    {currentQuestion?.title || "Loading question"}...
                  </Heading>

                  <FormControl
                    isInvalid={
                      (Boolean(errors.text) || isTextFocused) &&
                      Boolean(errors.text)
                    }
                    isRequired
                  >
                    <Controller
                      name="text"
                      defaultValue=""
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          setIsTextFocused={setIsTextFocused}
                        />
                      )}
                    />
                    <FormControlError>
                      <FormControlErrorIcon size="sm" as={AlertIcon} />
                      <FormControlErrorText>
                        {errors?.text?.message}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>

                  <Button onPress={handleSubmit(onSubmit)} className="mt-4">
                    {predictPending ||
                      (savePending && (
                        <ButtonSpinner className="mr-2" color={gray[500]} />
                      ))}
                    <ButtonText>Submit</ButtonText>
                  </Button>
                </VStack>
              </>
            )}

            <ErrorAlert error={predictionError} setError={setPredictionError} />
          </VStack>
          <HistoryLink module="ter" />
        </Card>
      </Center>
    </Wrapper>
  );
}
