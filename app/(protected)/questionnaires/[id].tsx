import AlertIcon from "@/components/AlertIcon";
import ErrorAlert from "@/components/ErrorAlert";
import InfoAlert from "@/components/InfoAlert";
import Loading from "@/components/Loading";
import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import Wrapper from "@/components/Wrapper";
import {
  useModulesBySlugRetrieve,
  useQuestionsBySlugRetrieve,
  useSaveActivityCreate,
} from "@/utils/api/apiComponents";
import { questionnaireSchema } from "@/utils/validations";
import { router, useLocalSearchParams } from "expo-router";
import { CircleIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gray } from "tailwindcss/colors";
import { Platform } from "react-native";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const [response, setResponse] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { data: module, isLoading: moduleLoading } = useModulesBySlugRetrieve({
    queryParams: { slug: typeof id === "string" ? id.toUpperCase() : id[0] },
  });

  const { data: questions, isLoading: questionsLoading } =
    useQuestionsBySlugRetrieve({
      queryParams: { slug: typeof id === "string" ? id.toUpperCase() : id[0] },
    });

  const { mutateAsync: saveData, isPending: savePending } =
    useSaveActivityCreate({});

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      answers: {},
    },
  });

  const submitData = async (data: any) => {
    const { answers } = data;

    // TODO: tell BE to handle this hardcoded logic on their side 💀
    const totalScore = Object.entries(answers).reduce(
      (acc, [questionId, value]) => {
        const question = questions.find((q) => q.id.toString() === questionId);
        if (question && module[0]?.scale) {
          return acc + (parseInt(value, 10) || 0);
        }
        return acc;
      },
      0,
    );

    let result = "";
    switch (module[0]?.slug) {
      case "WSS":
        if (totalScore <= 15) {
          result =
            "Chilled out and relatively calm. Stress isn’t much of an issue.";
        } else if (totalScore >= 16 && totalScore <= 20) {
          result =
            "Fairly low. Coping should be a breeze, but you probably have a tough day now and then. Still, count your blessings.";
        } else if (totalScore >= 21 && totalScore <= 25) {
          result =
            "Moderate stress. Some things about your job are likely to be pretty stressful, but probably not much more than most people experience and are able to cope with. Concentrate on what can be done to reduce items with the worst scores.";
        } else if (totalScore >= 26 && totalScore <= 30) {
          result =
            "Severe. You may still be able to cope, but life at work can sometimes be miserable. Several of your scores are probably extreme. You could be in the wrong job, or even in the right job but at the wrong time, and might benefit from counseling.";
        } else if (totalScore >= 31 && totalScore <= 40) {
          result =
            "Stress level is potentially dangerous. The more so the higher your score. You should seek professional assistance, especially if you feel your health is affected, or you might need to consider a job change to a different position within the company or to a different company.";
        }
        break;

      case "WHO":
        const specialQuestions = [
          "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
          "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
          "How often do you have problems remembering appointments or obligations?",
        ];

        const checkmarks = Object.entries(answers).reduce(
          (acc, [questionId, value]) => {
            const question = questions?.find(
              (q) => q.id.toString() === questionId,
            );

            if (!question) return acc;

            // Count if the answer is 4 or 5, or if it's 3 for one of the special questions
            const isHighScore = value === "4" || value === "5";
            const isSpecialCase =
              specialQuestions.includes(question.title) && value === "3";

            return acc + (isHighScore || isSpecialCase ? 1 : 0);
          },
          0,
        );

        if (checkmarks >= 4) {
          result =
            "Your symptoms may be consistent with Adult ADHD. It may be helpful for you to talk with your healthcare provider about getting evaluated for ADHD.";
        } else {
          result = "Your symptoms are not consistent with Adult ADHD.";
        }
        break;

      case "SAD": {
        const numAnswered = Object.values(answers).filter(
          (v) => v !== null && v !== "",
        ).length;
        let proratedTotalScore = totalScore;

        if (numAnswered < 8) {
          result =
            "The total score cannot be calculated as 3 or more items are unanswered.";
          break;
        } else if (numAnswered < 10) {
          proratedTotalScore = Math.round((totalScore * 10) / numAnswered);
        }

        const averageScore = proratedTotalScore / 10;
        if (averageScore <= 0.5) {
          result = "Severity of social anxiety disorder: None.";
        } else if (averageScore <= 1.5) {
          result = "Severity of social anxiety disorder: Mild.";
        } else if (averageScore <= 2.5) {
          result = "Severity of social anxiety disorder: Moderate.";
        } else if (averageScore <= 3.5) {
          result = "Severity of social anxiety disorder: Severe.";
        } else {
          result = "Severity of social anxiety disorder: Extreme.";
        }
        break;
      }

      case "GAD": {
        if (totalScore <= 4) {
          result = "Minimal anxiety.";
        } else if (totalScore >= 5 && totalScore <= 9) {
          result = "Mild anxiety.";
        } else if (totalScore >= 10 && totalScore <= 14) {
          result = "Moderate anxiety.";
        } else if (totalScore >= 15 && totalScore <= 21) {
          result = "Severe anxiety.";
        } else {
          result =
            "Invalid score. Please ensure all questions are answered correctly.";
        }
        break;
      }

      default:
        result = "No interpretation available for this module.";
        break;
    }

    await saveData({
      body: {
        activities: Object.entries(answers).map(([questionId, value]) => ({
          question_id: questionId,
          result: value,
        })),
      },
    })
      .then(() => {
        setResponse(result);
        setIsOpen(true);
      })
      .catch((error: any) => {
        setSaveError(error?.message || error?.stack?.detail);
      });
  };

  const handleClose = () => {
    setIsOpen(false);
    setResponse(null);
    router.replace("/dashboard");
  };

  if (moduleLoading || !module || questionsLoading || !questions) {
    return <Loading />;
  }

  if (Platform.OS === "web") {
    document.title = module[0]?.title || "Questionnaire";
  }

  return (
    <Wrapper>
      <Card variant="ghost" className="flex-1 my-12">
        <Box className="flex items-center">
          <Heading className="text-2xl font-bold">{module[0]?.title}</Heading>
          <Heading className="mt-4 text-lg font-medium text-gray-500">
            {module[0]?.instructions}
          </Heading>
        </Box>
        {questions.map((question) => (
          <FormControl
            key={question.id}
            isInvalid={Boolean(errors.answers?.[question.id])}
          >
            <Card className="mt-4">
              <Heading className="text-lg font-medium">
                {question.title}
              </Heading>
              <Controller
                name={`answers.${question.id}`}
                control={control}
                rules={{ required: "This question is required" }}
                render={({ field: { onChange, value } }) => (
                  <RadioGroup
                    className="mt-4 ml-4"
                    value={value || ""}
                    onChange={(selectedValue) => {
                      // Ensure the selected value is a key of the scale (0, 1, 2, ...)
                      setValue(`answers.${question.id}`, selectedValue);
                      onChange(selectedValue);
                    }}
                  >
                    {Object.entries(module[0]?.scale || {}).map(
                      ([key, label]: [string, string]) => (
                        <Radio value={key} key={key}>
                          <RadioIndicator>
                            <RadioIcon as={CircleIcon} size={24} />
                          </RadioIndicator>
                          <RadioLabel>{label}</RadioLabel>
                        </Radio>
                      ),
                    )}
                  </RadioGroup>
                )}
              />
            </Card>
            {errors.answers?.[question.id] && (
              <FormControlError>
                <FormControlErrorIcon size="sm" as={AlertIcon} />
                <FormControlErrorText>
                  {errors.answers[question.id]?.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        ))}
        <Box className="flex items-center mb-12">
          <Button
            className="mt-8 w-full md:w-1/2"
            onPress={handleSubmit(submitData)}
            disabled={savePending}
          >
            {savePending && (
              <ButtonSpinner className="mr-2" color={gray[500]} />
            )}
            <ButtonText>Submit</ButtonText>
          </Button>
        </Box>
      </Card>
      <InfoAlert
        title="Result"
        info={response}
        isOpen={isOpen}
        onClose={handleClose}
      />
      <ErrorAlert error={saveError} setError={setSaveError} />
    </Wrapper>
  );
}
