import DailyProgress from "@/components/DailyProgress";
import Loading from "@/components/Loading";
import Wrapper from "@/components/Wrapper";
import { Card } from "@/components/ui/card";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link } from "expo-router";
import {
  ArrowRightIcon,
  Brain,
  Camera,
  Brush,
  FileText,
  Gamepad,
  Mic,
  TabletSmartphone,
  SparkleIcon,
  MessageCircleQuestion,
  Ear,
} from "lucide-react-native";
import {
  Popover,
  PopoverBackdrop,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@/components/ui/popover";

import React, { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { Pressable } from "@/components/ui/pressable";
import {
  useActivitiesWeeklyStatsRetrieve,
  useAuthUserRetrieve,
} from "@/utils/api/apiComponents";

type ModulesT = {
  title: string;
  module: string;
  link:
    | "/audio"
    | "/text"
    | "/canvas"
    | "/camera"
    | "/eeg"
    | "/ear"
    | "/game-1"
    | "/game-2"
    | "/questionnaires/[id]";
  id?: string;
  icon: React.FC;
  androidOnly?: boolean;
  category: "emotion" | "brain" | "cognitive" | "questionnaires" | "ear";
  isAvailable?: boolean;
};

export default function Dashboard() {
  if (Platform.OS === "web") {
    document.title = "Dashboard";
  }

  const availableLinks: ModulesT[] = useMemo(
    () => [
      {
        title: "Speech Emotion",
        module: "SER",
        link: "/audio",
        icon: () => <Mic size={24} color="black" />,
        category: "emotion",
        isAvailable: true,
      },
      {
        title: "Text Emotion",
        module: "TER",
        link: "/text",
        icon: () => <FileText size={24} color="black" />,
        category: "emotion",
        isAvailable: true,
      },
      {
        title: "Emotion with Handwriting",
        module: "HRT",
        link: "/canvas",
        icon: () => (
          <Brush
            size={24}
            color={Platform.OS === "android" ? "black" : "gray"}
          />
        ),
        androidOnly: true,
        category: "emotion",
        isAvailable: Platform.OS === "android",
      },
      {
        title: "Face Emotions",
        module: "CER",
        link: "/camera",
        icon: () => <Camera size={24} color="black" />,
        category: "emotion",
        isAvailable: true,
      },
      {
        title: "EEG Signals",
        module: "EEG",
        link: "/eeg",
        icon: () => (
          <Brain
            size={24}
            color={Platform.OS === "android" ? "black" : "gray"}
          />
        ),
        androidOnly: true,
        category: "brain",
        isAvailable: Platform.OS === "android",
      },
      {
        title: "Ear Signals",
        module: "EAR",
        link: "/ear",
        icon: () => (
          <Ear
            size={24}
            color={Platform.OS === "android" ? "black" : "gray"}
          />
        ),
        androidOnly: true,
        category: "ear",
        isAvailable: Platform.OS === "android",
      },
      {
        title: "Color sequence game",
        module: "GM1",
        link: "/game-1",
        icon: () => <Gamepad size={24} color="black" />,
        category: "cognitive",
        isAvailable: true,
      },
      {
        title: "Reasoning and AV Games",
        module: "GM2",
        link: "/game-2",
        icon: () => <Gamepad size={24} color="black" />,
        category: "cognitive",
        isAvailable: true,
      },
      {
        title: "WHO Adult ADHD Self-Report Scale",
        module: "WHO",
        link: "/questionnaires/[id]",
        id: "who",
        icon: () => <MessageCircleQuestion size={24} color="black" />,
        category: "questionnaires",
        isAvailable: true,
      },
      {
        title: "Workplace Stress Scale",
        module: "WSS",
        link: "/questionnaires/[id]",
        id: "wss",
        icon: () => <MessageCircleQuestion size={24} color="black" />,
        category: "questionnaires",
        isAvailable: true,
      },
      {
        title: "Social Anxiety Disorder",
        module: "SAD",
        link: "/questionnaires/[id]",
        id: "sad",
        icon: () => <MessageCircleQuestion size={24} color="black" />,
        category: "questionnaires",
        isAvailable: true,
      },
      {
        title: "General Anxiety Disorder",
        module: "GAD",
        link: "/questionnaires/[id]",
        id: "gad",
        icon: () => <MessageCircleQuestion size={24} color="black" />,
        category: "questionnaires",
        isAvailable: true,
      },
      // {
      //   title: "Depression, Anxiety Stress Scale",
      //   module: "DAS",
      //   link: "/questionnaires/[id]",
      //   id: "das",
      //   icon: () => <MessageCircleQuestion size={24} color="black" />,
      //   category: "questionnaires",
      //   isAvailable: true,
      // },
    ],
    [],
  );

  const [randomActivity, setRandomActivity] = useState<ModulesT>();
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const { data: user, isLoading: userLoading } = useAuthUserRetrieve({});

  const { data: stats, isLoading: statsLoading } =
    useActivitiesWeeklyStatsRetrieve({});

  const currentDayStats = useMemo(() => {
    if (!stats || stats.length === 0) return null;
    return stats[stats.length - 1];
  }, [stats]);

  useEffect(() => {
    if (!currentDayStats || !currentDayStats.modules) return;

    let highestIncompleteModule: string | null = null;
    let highestPercentage = 0;

    Object.entries(currentDayStats.modules).forEach(([moduleCode, data]) => {
      if (data.percentage < 100 && data.percentage > highestPercentage) {
        highestPercentage = data.percentage;
        highestIncompleteModule = moduleCode;
      }
    });

    if (highestIncompleteModule) {
      setRandomActivity(
        availableLinks.find((link) => link.module === highestIncompleteModule),
      );
    }
  }, [availableLinks, currentDayStats]);

  if (userLoading || statsLoading || !user || !stats) {
    return <Loading />;
  }

  const renderCard = (module: ModulesT) => {
    const isRandom = randomActivity?.module === module.module;
    const isPopoverOpen = openPopoverId === module.link;

    return (
      <GridItem
        key={module.module}
        _extra={{
          className: "col-span-1",
        }}
      >
        <Card
          variant="outline"
          className={`relative ${!module.isAvailable ? "bg-background-100" : ""}`}
        >
          <VStack className="space-y-4">
            <HStack className="text-xl font-bold flex items-center space-x-2 mb-4">
              <Icon as={module.icon} />
              <Heading
                className={`px-4 ${!module.isAvailable ? "text-typography-500" : ""}`}
              >
                {module.title}
              </Heading>
              {isRandom && (
                <Popover
                  isOpen={isPopoverOpen}
                  onClose={() => setOpenPopoverId(null)}
                  onOpen={() => setOpenPopoverId(module.module)}
                  placement="top"
                  size="md"
                  trigger={(triggerProps) => (
                    <Pressable {...triggerProps}>
                      <Icon
                        as={SparkleIcon}
                        size="xl"
                        className="text-yellow-500"
                      />
                    </Pressable>
                  )}
                >
                  <PopoverBackdrop />
                  <PopoverContent className="max-w-xs">
                    <PopoverArrow />
                    <PopoverBody>
                      <Text className="text-typography-900">
                        Recommended for you
                      </Text>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              )}
            </HStack>
            {module.isAvailable ? (
              <Link
                href={
                  module.link === "/questionnaires/[id]" && module.id
                    ? {
                        pathname: module.link,
                        params: { id: module.id },
                      }
                    : module.link
                }
              >
                <HStack className="items-center">
                  <Text
                    size="sm"
                    className="font-semibold text-info-600 no-underline"
                  >
                    Start activity
                  </Text>
                  <Icon
                    as={ArrowRightIcon}
                    size="sm"
                    className="text-info-600 mt-0.5 ml-0.5"
                  />
                </HStack>
              </Link>
            ) : module.androidOnly ? (
              <HStack className="items-center">
                <Text
                  size="sm"
                  className="font-semibold text-typography-500 no-underline mr-2"
                >
                  Available only on Android
                </Text>
                <Icon
                  as={() => (
                    <TabletSmartphone size={16} color="gray" strokeWidth={3} />
                  )}
                />
              </HStack>
            ) : (
              <Text
                size="sm"
                className="font-semibold text-typography-500 no-underline"
              >
                In development...
              </Text>
            )}
          </VStack>
        </Card>
      </GridItem>
    );
  };

  const renderSection = (category: ModulesT["category"], title: string) => {
    const categoryModules = availableLinks.filter(
      (link) => link.category === category,
    );

    return (
      <>
        <Heading
          className={`${category !== "emotion" ? "mt-8" : ""} mb-4 text-heading text-2xl`}
        >
          {title}
        </Heading>
        <Grid
          className="gap-5"
          _extra={{
            className:
              "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2",
          }}
        >
          {categoryModules.map(renderCard)}
        </Grid>
      </>
    );
  };

  return (
    <Wrapper>
      <Card variant="ghost" className="flex-1">
        <DailyProgress stats={stats} />
        {renderSection("emotion", "Emotion Detection")}
        {renderSection("cognitive", "Cognitive skills")}
        {renderSection("questionnaires", "Questionnaires")}
        {renderSection("brain", "Brain Signals")}
        {renderSection("ear", "Ear Signals")} 
        {/* important */}
      </Card>
    </Wrapper>
  );
}
