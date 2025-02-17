import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import Wrapper from "@/components/Wrapper";
import {
  useQuestionsBySlugRetrieve,
  useSaveActivityCreate,
} from "@/utils/api/apiComponents";
import useEEGStore from "@/utils/eegStore";
import { router } from "expo-router";
import { WifiIcon } from "lucide-react-native";
import React, { useState } from "react";
import ErrorAlert from "@/components/ErrorAlert";
import InfoAlert from "@/components/InfoAlert";

export default function Eegsave() {
  const { eegPayload, resetEEGPayload } = useEEGStore();
  const { mutateAsync: saveData } = useSaveActivityCreate({});
  const { data: rawQuestions } = useQuestionsBySlugRetrieve({
    queryParams: { slug: "EEG" },
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const save = async () => {
    if (rawQuestions && rawQuestions.length > 0) {
      await saveData({
        body: {
          activities: [
            {
              question_id: rawQuestions[0].id,
              result: JSON.stringify(eegPayload),
            },
          ],
        },
      }).then(() => {
        console.log("Data saved successfully");
        resetEEGPayload();
        router.push("/dashboard");
      });
    } else {
      setError("Please turn on your Wi-Fi");
    }
  };

  const WiFiSized = () => <WifiIcon color="black" size={100} />;

  return (
    <Wrapper noPadding>
      <Center className="flex-1">
        <Icon as={WiFiSized} />
        <Heading className="mt-16 mb-4">Proceed with following steps:</Heading>
        <VStack>
          <Text>1. Turn off the device</Text>
          <Text>2. Connect to the internet</Text>
          <Text>3. Click on save</Text>
        </VStack>
        <Button className="mt-16 w-64" onPress={save}>
          <ButtonText>Save data</ButtonText>
        </Button>
      </Center>
      <ErrorAlert error={error} setError={setError} />
      <InfoAlert
        info={message}
        isOpen={message !== null}
        onClose={() => setMessage(null)}
      />
    </Wrapper>
  );
}
