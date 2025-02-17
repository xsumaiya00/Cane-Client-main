import React from "react";
import { TouchableOpacity } from "react-native";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";
import { router } from "expo-router";
import { HistoryIcon } from "lucide-react-native";
import { gray } from "tailwindcss/colors";
import { HStack } from "./ui/hstack";

export default function HistoryLink({ module }: { module: string }) {
  const HistorySized = () => <HistoryIcon color={gray[500]} size={36} />;
  return (
    <TouchableOpacity
      style={{
        padding: 5,
        marginVertical: 5,
        borderWidth: 2,
        borderColor: gray[500],
        borderStyle: "dotted",
      }}
      onPress={() => router.push(`/history/${module}`)}
    >
      <HStack className="items-center align-center justify-center gap-2">
        <Icon as={HistorySized} />
        <Text>History</Text>
      </HStack>
    </TouchableOpacity>
  );
}
