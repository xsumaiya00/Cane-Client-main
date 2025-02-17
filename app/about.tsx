import Wrapper from "@/components/Wrapper";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import React from "react";
import { Platform } from "react-native";

export default function About() {
  if (Platform.OS === "web") {
    document.title = "About";
  }

  return (
    <Wrapper noPadding>
      <Center className="flex-1">
        <Text>About</Text>
      </Center>
    </Wrapper>
  );
}
