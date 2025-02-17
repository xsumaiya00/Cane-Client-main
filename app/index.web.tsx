import Wrapper from "@/components/Wrapper";
import { Card } from "@/components/ui/card";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSession } from "@/utils/AuthContext";
import { modules } from "@/utils/modules";
import { Link, Redirect } from "expo-router";

export default function LandingPage() {
  const { session } = useSession();

  document.title = "CANE";

  if (session) {
    return <Redirect href="/dashboard" />;
  }

  return (
    <Wrapper noPadding>
      <VStack className="space-y-4 text-center my-24 py-24 px-4 xs:px-2 sm:px-2 md:px-24 lg:px-36 xl:px-48">
        <Heading className="text-3xl font-heading tracking-tighter text-center sm:text-4xl md:text-5xl lg:text-6xl/none">
          Revolutionizing Mental Health Care with AI
        </Heading>
        {/* <Heading className="text-6xl font-bold">Welcome to CANE</Heading> */}
        <Text className="text-xl mb-6 text-center">
          Your daily companion for mental wellness and self-discovery
        </Text>
        <HStack className="space-x-4 content-center justify-center">
          <Link
            className="w-36 h-12 bg-primary-500 flex justify-center items-center rounded"
            href="/signup"
          >
            <Text className="font-bold text-typography-100">Sign Up</Text>
          </Link>
          <Link
            className="w-36 h-12 flex justify-center items-center border border-outline-400 rounded"
            href="/about"
          >
            <Text className="font-medium text-outline-600">Learn More</Text>
          </Link>
        </HStack>
      </VStack>

      <VStack className="space-y-4 text-center py-24 px-4 xs:px-2 sm:px-2 md:px-24 lg:px-36 xl:px-48 bg-typography-50">
        <Heading className="text-3xl font-heading tracking-tighter sm:text-5xl text-center mb-12">
          Our Features
        </Heading>
        <Grid
          className="gap-5 mt-24"
          _extra={{
            className:
              "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3",
          }}
        >
          {modules.map((module, index) => (
            <GridItem
              _extra={{
                className: "col-span-2 md:col-span-1",
              }}
              key={index}
            >
              <Card variant="outline" className="bg-white h-36">
                <HStack className="items-center space-x-4 mb-4">
                  {module.icon}
                  <Heading className="text-medium md:text-xl font-bold">
                    {module.title}
                  </Heading>
                </HStack>
                <Text className="text-gray-500">{module.description}</Text>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </VStack>

      <VStack className="space-y-4 text-center py-24 xs:px-2 sm:px-2 md:px-24 lg:px-36 xl:px-48">
        <Heading className="text-3xl font-heading tracking-tighter sm:text-5xl text-center mb-16">
          How It Works
        </Heading>
        <Grid
          className="gap-5 mt-24"
          _extra={{
            className:
              "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3",
          }}
        >
          <GridItem
            _extra={{
              className: "col-span-2 md:col-span-1",
            }}
          >
            <Card variant="ghost" className="h-36">
              <HStack className="items-center space-x-4 mb-4">
                <Heading className="text-2xl font-bold">
                  Emotion Prediction
                </Heading>
              </HStack>
              <Text className="text-gray-500">
                Our AI analyzes various inputs to accurately predict your
                emotional state.
              </Text>
            </Card>
          </GridItem>
          <GridItem
            _extra={{
              className: "col-span-2 md:col-span-1",
            }}
          >
            <Card variant="ghost" className="h-36">
              <HStack className="items-center space-x-4 mb-4">
                <Heading className="text-2xl font-bold">
                  Personalized Recommendations
                </Heading>
              </HStack>
              <Text className="text-gray-500">
                Based on your emotional state, we suggest tailored activities to
                improve your well-being.
              </Text>
            </Card>
          </GridItem>
          <GridItem
            _extra={{
              className: "col-span-2 md:col-span-1",
            }}
          >
            <Card variant="ghost" className="h-36">
              <HStack className="items-center space-x-4 mb-4">
                <Heading className="text-2xl font-bold">
                  Progress Tracking
                </Heading>
              </HStack>
              <Text className="text-gray-500">
                Monitor your emotional well-being over time with detailed
                progress reports and insights.
              </Text>
            </Card>
          </GridItem>
        </Grid>
      </VStack>
    </Wrapper>
  );
}
