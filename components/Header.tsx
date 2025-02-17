import React from "react";
import { Box } from "./ui/box";
import { Text } from "./ui/text";
import { Link } from "expo-router";
import { HStack } from "./ui/hstack";
import { BrainCircuit } from "lucide-react-native";
import { Icon } from "./ui/icon";
import { useAuthUserRetrieve } from "@/utils/api/apiComponents";

export default function Header() {
  const { data: user, isLoading: userLoading } = useAuthUserRetrieve({});
  // TODO: tell BE to fix user Model instead of hardcoding emails 💀
  const isAdmin =
    user?.email === "user1@cane.cz" ||
    user?.email === "aamirmalik@hotmail.com" ||
    user?.email === "dmitrii@cane.cz" ||
    false;

  const BrainCircuitSized = () => <BrainCircuit size={32} color="black" />;

  return (
    <Box className="flex-row items-center content-center justify-center h-14 px-4 lg:px-6 py-8 border-b">
      <Link href="/">
        <HStack className="flex items-center space-x-2">
          <Icon as={BrainCircuitSized} />
          <Text className="text-2xl font-bold text-black-500">CANE</Text>
        </HStack>
      </Link>
      <HStack className="ml-auto space-x-4 sm:space-x-6 items-center">
        {user ? (
          <>
            <Link href="/dashboard">
              <Text className="text-sm font-medium underline-offset-4">
                Dashboard
              </Text>
            </Link>
            {isAdmin && !userLoading && (
              <Link href="/admin">
                <Text className="text-sm font-medium underline-offset-4">
                  Admin Panel
                </Text>
              </Link>
            )}
            <Link href="/profile">
              <Text className="text-sm font-medium underline-offset-4">
                Profile
              </Text>
            </Link>
          </>
        ) : (
          <Link href="/signin">
            <Text className="text-sm font-medium underline-offset-4">
              Sign In
            </Text>
          </Link>
        )}
      </HStack>
    </Box>
  );
}
