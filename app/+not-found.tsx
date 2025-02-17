import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { Link, Stack } from "expo-router";
import { Platform } from "react-native";
import React from "react";

export default function NotFoundScreen() {
  if (Platform.OS === "web") {
    document.title = "Not Found";
  }

  return (
    <>
      <Stack.Screen options={{ title: "Not found" }} />
      <Center className="flex-1">
        <Text>This screen doesn't exist.</Text>
        <Link href="/dashboard">
          <Text className="underline font-bold">Go to home screen</Text>
        </Link>
      </Center>
    </>
  );
}
