import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import React from "react";
import Wrapper from "@/components/Wrapper";

export default function CanvasModule() {
  document.title = "Canvas";

  return (
    <Wrapper>
      <Center className="flex-1">
        <Text>Web is not supported</Text>
      </Center>
    </Wrapper>
  );
}
