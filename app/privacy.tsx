import Wrapper from "@/components/Wrapper";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import React from "react";
import { Platform } from "react-native";

export default function Privacy() {
  if (Platform.OS === "web") {
    document.title = "Privacy";
  }

  return (
    <Wrapper noPadding>
      <Center className="flex-1">
        <Text>Privacy</Text>
      </Center>
    </Wrapper>
  );
}
