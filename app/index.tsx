import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { BrainCircuit } from "lucide-react-native";

export default function LandingPage() {
  const BrushSized = () => <BrainCircuit size={96} color="black" />;

  return (
    <Center style={{ flex: 1 }}>
      <HStack className="flex items-center space-x-2 mb-48">
        <Icon as={BrushSized} />
        <Text className="text-6xl font-bold text-black-500">CANE</Text>
      </HStack>
      <VStack className="flex items-center space-y-4 text-center content-center justify-center">
        <Button
          variant="solid"
          className="w-96 mb-6"
          onPress={() => router.push("/signup")}
        >
          <ButtonText>Sign Up</ButtonText>
        </Button>
        <Button
          variant="outline"
          className="w-96"
          onPress={() => router.push("/signin")}
        >
          <ButtonText>Sign In</ButtonText>
        </Button>
      </VStack>
    </Center>
  );
}
