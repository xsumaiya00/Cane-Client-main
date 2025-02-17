import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import Wrapper from "@/components/Wrapper";
import { WifiIcon } from "lucide-react-native";
import React from "react";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";
import { BluetoothIcon } from 'lucide-react-native';

export default function Ear() {
  // const WiFiSized = () => <WifiIcon color="black" size={100} />;
  const BluetoothSized = () => <BluetoothIcon color="black" size={100} />;

  return (
    <Wrapper noPadding>
      <Center className="flex-1">
        <Icon as={BluetoothSized} />
        <Heading className="mt-16 mb-4">Proceed with following steps:</Heading>
        <VStack>
          <Text>1. Turn on the device</Text>
          <Text>2. Connect to the "Mindrove" Bluetooth</Text>
          <Text>3. Click on start</Text>
        </VStack>
        <Button className="mt-16 w-64" onPress={() => router.push("/EarScan")}>
          <ButtonText>Start</ButtonText>
        </Button>
      </Center>
    </Wrapper>
  );
}
