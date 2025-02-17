import React from "react";
import { Card } from "@/components/ui/card";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link } from "expo-router";
import { ArrowRightIcon, FileQuestionIcon } from "lucide-react-native";

const QuestionnaireSection = ({ questionnaires }: { questionnaires: any }) => {
  const renderQuestionnaireCard = (questionnaire: any) => (
    <GridItem
      key={questionnaire.id}
      _extra={{
        className: "col-span-1",
      }}
    >
      <Card variant="outline" className="relative">
        <VStack className="space-y-4">
          <HStack className="text-xl font-bold flex items-center space-x-2 mb-4">
            <Icon as={() => <FileQuestionIcon size={24} color="black" />} />
            <Heading className="pl-4">
              {questionnaire.questionnaire_name}
            </Heading>
          </HStack>
          <Link href={`/questionnaires/${questionnaire.id}`}>
            <HStack className="items-center">
              <Text
                size="sm"
                className="font-semibold text-info-600 no-underline"
              >
                Start questionnaire
              </Text>
              <Icon
                as={ArrowRightIcon}
                size="sm"
                className="text-info-600 mt-0.5 ml-0.5"
              />
            </HStack>
          </Link>
        </VStack>
      </Card>
    </GridItem>
  );

  return (
    <>
      <Heading className="mt-8 mb-4 text-heading text-2xl">
        Questionnaires
      </Heading>
      <Grid
        className="gap-5"
        _extra={{
          className:
            "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2",
        }}
      >
        {questionnaires?.map(renderQuestionnaireCard)}
      </Grid>
    </>
  );
};

export default QuestionnaireSection;
