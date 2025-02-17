import Wrapper from "@/components/Wrapper";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import React, { useCallback, useState } from "react";
import { Platform } from "react-native";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import TextInput from "@/components/TextInput";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Controller, useForm } from "react-hook-form";
import { TextSchemaType, textSchema } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { gray } from "tailwindcss/colors";
import ErrorAlert from "@/components/ErrorAlert";
import {
  RadioGroup,
  Radio,
  RadioLabel,
  RadioIndicator,
  RadioIcon,
} from "@/components/ui/radio";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { CircleIcon, EditIcon } from "lucide-react-native";
import Loading from "@/components/Loading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import AlertIcon from "@/components/AlertIcon";
import { VStack } from "@/components/ui/vstack";
import { View } from "@/components/ui/view";
import {
  QuestionsDestroyPathParams,
  useAuthUserRetrieve,
  useModulesBySlugRetrieve,
  useModulesList,
  useQuestionsBySlugRetrieve,
  useQuestionsCreate,
  useQuestionsDestroy,
  useQuestionsPartialUpdate,
} from "@/utils/api/apiComponents";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Box } from "@/components/ui/box";
import { Module, Question } from "@/utils/api/apiSchemas";
import { Center } from "@/components/ui/center";

export default function AdminPanel() {
  if (Platform.OS === "web") {
    document.title = "Admin Panel";
  }

  const [isTextFocused, setIsTextFocused] = useState<boolean>(false);
  const [selectedModule, setSelectedModule] = useState<
    "SER" | "TER" | "HRT" | "WHO" | "WSS" | "SAD" | "GAD" | "DAS"
  >("SER");
  const [createError, setCreateError] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null,
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<TextSchemaType>({
    resolver: zodResolver(textSchema),
  });

  const { data: allModules, isLoading: allModulesLoading } = useModulesList({});

  const {
    data: serQuestions,
    refetch: refetchSER,
    isLoading: serLoading,
  } = useQuestionsBySlugRetrieve({
    queryParams: { slug: "SER" },
  });
  const {
    data: terQuestions,
    refetch: refetchTER,
    isLoading: terLoading,
  } = useQuestionsBySlugRetrieve({
    queryParams: { slug: "TER" },
  });
  const {
    data: hrtQuestions,
    refetch: refetchHRT,
    isLoading: hrtLoading,
  } = useQuestionsBySlugRetrieve({
    queryParams: { slug: "HRT" },
  });
  const {
    data: whoQuestions,
    refetch: refetchWHO,
    isLoading: whoLoading,
  } = useQuestionsBySlugRetrieve({
    queryParams: { slug: "WHO" },
  });
  const {
    data: wssQuestions,
    refetch: refetchWSS,
    isLoading: wssLoading,
  } = useQuestionsBySlugRetrieve({
    queryParams: { slug: "WSS" },
  });
  const {
    data: sadQuestions,
    refetch: refetchSAD,
    isLoading: sadLoading,
  } = useQuestionsBySlugRetrieve({
    queryParams: { slug: "SAD" },
  });
  const {
    data: gadQuestions,
    refetch: refetchGAD,
    isLoading: gadLoading,
  } = useQuestionsBySlugRetrieve({
    queryParams: { slug: "GAD" },
  });
  const {
    data: dasQuestions,
    refetch: refetchDAS,
    isLoading: dasLoading,
  } = useQuestionsBySlugRetrieve({
    queryParams: { slug: "DAS" },
  });
  const { mutateAsync: createQuestion, isPending: createPending } =
    useQuestionsCreate({});
  const { mutateAsync: updateQuestion, isPending: updatePending } =
    useQuestionsPartialUpdate({});
  const { mutateAsync: destroyQuestion } = useQuestionsDestroy({});

  const { data: serModule, isLoading: serModuleLoading } =
    useModulesBySlugRetrieve({
      queryParams: { slug: "SER" },
    });
  const { data: terModule, isLoading: terModuleLoading } =
    useModulesBySlugRetrieve({
      queryParams: { slug: "TER" },
    });
  const { data: hrtModule, isLoading: hrtModuleLoading } =
    useModulesBySlugRetrieve({
      queryParams: { slug: "HRT" },
    });
  const { data: whoModule, isLoading: whoModuleLoading } =
    useModulesBySlugRetrieve({
      queryParams: { slug: "WHO" },
    });
  const { data: wssModule, isLoading: wssModuleLoading } =
    useModulesBySlugRetrieve({
      queryParams: { slug: "WSS" },
    });
  const { data: sadModule, isLoading: sadModuleLoading } =
    useModulesBySlugRetrieve({
      queryParams: { slug: "SAD" },
    });
  const { data: gadModule, isLoading: gadModuleLoading } =
    useModulesBySlugRetrieve({
      queryParams: { slug: "GAD" },
    });
  const { data: dasModule, isLoading: dasModuleLoading } =
    useModulesBySlugRetrieve({
      queryParams: { slug: "DAS" },
    });

  const refetchQuestion = useCallback(
    (
      selectedModule:
        | "SER"
        | "TER"
        | "HRT"
        | "WHO"
        | "WSS"
        | "SAD"
        | "GAD"
        | "DAS",
    ) => {
      switch (selectedModule) {
        case "SER":
          refetchSER();
          break;
        case "TER":
          refetchTER();
          break;
        case "HRT":
          refetchHRT();
          break;
        case "WHO":
          refetchWHO();
          break;
        case "WSS":
          refetchWSS();
          break;
        case "SAD":
          refetchSAD();
          break;
        case "GAD":
          refetchGAD();
          break;
        case "DAS":
          refetchDAS();
          break;
        default:
          break;
      }
    },
    [
      refetchDAS,
      refetchGAD,
      refetchHRT,
      refetchSAD,
      refetchSER,
      refetchTER,
      refetchWHO,
      refetchWSS,
    ],
  );

  const onSubmit = useCallback(
    async (data: TextSchemaType) => {
      const { text } = data;

      const module = allModules?.find((m) => {
        console.log(m.slug, selectedModule);
        return m.slug === selectedModule;
      });
      console.log(module);

      if (module === undefined) {
        return;
      }

      if (editingQuestionId !== null) {
        try {
          await updateQuestion({
            pathParams: { id: editingQuestionId },
            body: {
              title: text,
              module: module.id,
            },
          });
          reset();
          setEditingQuestionId(null);
          refetchQuestion(selectedModule);
        } catch (error: any) {
          setCreateError(error?.message || error?.stack?.detail);
        }
      } else {
        try {
          await createQuestion({
            body: {
              title: text,
              module: module.id,
            },
          });
          reset();
          refetchQuestion(selectedModule);
        } catch (error: any) {
          if (
            error?.stack?.non_field_errors &&
            Array.isArray(error?.stack?.non_field_errors)
          ) {
            setCreateError(error?.stack?.non_field_errors[0]);
          } else {
            setCreateError(error?.message || error?.stack?.detail);
          }
        }
      }
      reset();
      setCreateError(null);
    },
    [
      allModules,
      editingQuestionId,
      reset,
      selectedModule,
      updateQuestion,
      createQuestion,
      refetchQuestion,
    ],
  );

  const { data: user, isLoading: userLoading } = useAuthUserRetrieve({});
  // TODO: tell BE to fix user Model instead of hardcoding emails 💀
  const isAdmin =
    user?.email === "user1@cane.cz" ||
    user?.email === "aamirmalik@hotmail.com" ||
    user?.email === "dmitrii@cane.cz" ||
    false;
  if (!isAdmin && !userLoading) {
    return (
      <Wrapper>
        <Center className="flex-1">
          <Text>Forbidden access</Text>
        </Center>
      </Wrapper>
    );
  }

  const startEditing = (
    id: number,
    title: string,
    module: "SER" | "TER" | "HRT",
  ) => {
    setEditingQuestionId(id);
    setValue("text", title);
    setSelectedModule(module);
  };

  if (
    allModulesLoading ||
    serLoading ||
    serModuleLoading ||
    !serModule ||
    !serQuestions ||
    terLoading ||
    terModuleLoading ||
    !terModule ||
    !terQuestions ||
    hrtLoading ||
    hrtModuleLoading ||
    !hrtModule ||
    !hrtQuestions ||
    whoLoading ||
    whoModuleLoading ||
    !whoModule ||
    !whoQuestions ||
    wssLoading ||
    wssModuleLoading ||
    !wssModule ||
    !wssQuestions ||
    sadLoading ||
    sadModuleLoading ||
    !sadModule ||
    !sadQuestions ||
    gadLoading ||
    gadModuleLoading ||
    !gadModule ||
    !gadQuestions ||
    dasLoading ||
    dasModuleLoading ||
    !dasModule ||
    !dasQuestions ||
    !user ||
    userLoading
  ) {
    return <Loading />;
  }

  const renderQuestionnaires = (questions: Question[]) => {
    return questions?.length ? (
      questions.map((q: any) => (
        <VStack key={q.id}>
          <HStack
            key={q.id}
            className="p-4 align-center justify-between items-center w-full space-x-4 border-b border-secondary-300"
          >
            <Text className="truncate">{q.title}</Text>
          </HStack>
        </VStack>
      ))
    ) : (
      <Text className="mb-4">No questions available.</Text>
    );
  };

  const renderQuestionsList = (
    questions: Question[],
    module: "SER" | "TER" | "HRT",
    refetchQuestions: () => void,
    destroyQuestion: (params: {
      pathParams: QuestionsDestroyPathParams;
    }) => Promise<any>,
  ) => {
    return questions?.length ? (
      questions.map((q: any) => (
        <HStack
          key={q.id}
          className="p-4 align-center justify-between items-center w-full space-x-4 border-b border-secondary-300"
        >
          <Text className="truncate w-[70%]">{q.title}</Text>
          <HStack>
            <Pressable
              style={{ marginRight: 16 }}
              onPress={() => startEditing(q.id, q.title, module)}
            >
              <Icon as={EditIcon} className="cursor-pointer" />
            </Pressable>
            <Pressable
              onPress={() => {
                destroyQuestion({
                  pathParams: { id: q.id.toString() },
                }).then(() => refetchQuestions());
              }}
            >
              <Icon as={CloseIcon} className="cursor-pointer" />
            </Pressable>
          </HStack>
        </HStack>
      ))
    ) : (
      <Text className="mb-4">No {module} questions available.</Text>
    );
  };

  const renderContext = (module: Module) => {
    return (
      <HStack className="my-4">
        <View className="w-1 bg-gray-500 mr-2" />
        <Text className="py-4">{module.instructions}</Text>
      </HStack>
    );
  };

  const renderScale = (module: Module) => {
    return (
      <Box className="rounded-lg overflow-hidden w-full md:w-1/2 border border-secondary-200 my-2">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Key</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {module.scale ? (
              Object.entries(module.scale).map(([key, value]) => (
                <TableRow key={`${key}-${value}`}>
                  <TableData className="text-sm text-secondary-500">
                    {key}
                  </TableData>
                  {typeof value === "string" && (
                    <TableData className="text-sm text-secondary-500">
                      {value}
                    </TableData>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableData>No scale available</TableData>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    );
  };

  return (
    <Wrapper>
      <Card variant="ghost" className="flex-1">
        <Heading className="mb-4">
          {editingQuestionId !== null ? "Edit Question" : "Add a New Question"}
        </Heading>
        <FormControl
          isInvalid={
            (Boolean(errors.text) || isTextFocused) && Boolean(errors.text)
          }
          isRequired
          className="mb-4"
        >
          <Controller
            name="text"
            defaultValue=""
            control={control}
            rules={{
              validate: async (value) => {
                try {
                  await textSchema.parseAsync({ text: value });
                  return true;
                } catch (error: any) {
                  return error.message;
                }
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                setIsTextFocused={setIsTextFocused}
                multiline
              />
            )}
          />
          <FormControlError>
            <FormControlErrorIcon size="sm" as={AlertIcon} />
            <FormControlErrorText>{errors?.text?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>

        <Heading className="mb-2">Select Module</Heading>
        <RadioGroup
          className="mb-6"
          isDisabled={editingQuestionId !== null}
          value={selectedModule}
          onChange={(value) =>
            setSelectedModule(value as "SER" | "TER" | "HRT")
          }
        >
          <Radio value="SER">
            <RadioIndicator>
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>Sound Emotions Recognition (SER)</RadioLabel>
          </Radio>
          <Radio value="TER">
            <RadioIndicator>
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>Text Emotions Recognition (TER)</RadioLabel>
          </Radio>
          <Radio value="HRT">
            <RadioIndicator>
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>Handwriting Emotions Recognition (HRT)</RadioLabel>
          </Radio>
        </RadioGroup>

        <Button onPress={handleSubmit(onSubmit)} className="mb-6 w-64">
          {(createPending || updatePending) && (
            <ButtonSpinner className="mr-2" color={gray[500]} />
          )}
          <ButtonText>
            {editingQuestionId !== null ? "Update Question" : "Submit Question"}
          </ButtonText>
        </Button>

        <Heading className="mt-6 mb-2">{serModule[0].title}</Heading>
        {renderContext(serModule[0])}
        {renderQuestionsList(
          serQuestions || [],
          "SER",
          refetchSER,
          destroyQuestion,
        )}

        <Heading className="mt-6 mb-2">{terModule[0].title}</Heading>
        {renderContext(terModule[0])}
        {renderQuestionsList(
          terQuestions || [],
          "TER",
          refetchTER,
          destroyQuestion,
        )}

        <Heading className="mt-6 mb-2">{hrtModule[0].title}</Heading>
        {renderContext(hrtModule[0])}
        {renderQuestionsList(
          hrtQuestions || [],
          "HRT",
          refetchHRT,
          destroyQuestion,
        )}

        <Heading className="mt-12 mb-2">{whoModule[0].title}</Heading>
        {renderScale(whoModule[0])}
        {renderContext(whoModule[0])}
        {renderQuestionnaires(whoQuestions || [])}

        <Heading className="mt-12 mb-2">{wssModule[0].title}</Heading>
        {renderScale(wssModule[0])}
        {renderContext(wssModule[0])}
        {renderQuestionnaires(wssQuestions || [])}

        <Heading className="mt-12 mb-2">{sadModule[0].title}</Heading>
        {renderScale(sadModule[0])}
        {renderContext(sadModule[0])}
        {renderQuestionnaires(sadQuestions || [])}

        <Heading className="mt-12 mb-2">{gadModule[0].title}</Heading>
        {renderScale(gadModule[0])}
        {renderContext(gadModule[0])}
        {renderQuestionnaires(gadQuestions || [])}

        <Heading className="mt-12 mb-2">{dasModule[0].title}</Heading>
        {renderScale(dasModule[0])}
        {renderContext(dasModule[0])}
        {renderQuestionnaires(dasQuestions || [])}
      </Card>
      <ErrorAlert error={createError} setError={setCreateError} />
    </Wrapper>
  );
}
