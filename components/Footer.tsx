import React from "react";
import { Box } from "./ui/box";
import { Text } from "./ui/text";
import { HStack } from "./ui/hstack";
import { Link } from "expo-router";

export default function Footer() {
  return (
    <Box className="flex flex-col sm:flex-row py-6 px-4 md:px-6 items-center border-t">
      <Text className="text-sm text-gray-500 dark:text-gray-400">
        © 2025 CANE. All rights reserved.
      </Text>
      <HStack className="sm:ml-auto space-x-4 sm:space-x-6">
        <Link href="/tos">
          <Text className="text-sm">Terms of Service</Text>
        </Link>
        <Link href="/privacy">
          <Text className="text-sm">Privacy</Text>
        </Link>
      </HStack>
    </Box>
  );
}
