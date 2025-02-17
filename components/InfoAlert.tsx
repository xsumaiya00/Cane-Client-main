import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

import { useCallback } from "react";
import { InfoIcon } from "lucide-react-native";
import { Icon } from "./ui/icon";

export default function InfoAlert({
  title,
  info,
  isOpen,
  onClose,
}: {
  title?: string;
  info: string | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const closeAlert = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <AlertDialog isOpen={isOpen} onClose={closeAlert} size="md">
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <HStack space="sm" className="items-center">
            <Icon as={InfoIcon} />
            <Heading size="lg">{title || "Info"}</Heading>
          </HStack>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text size="md" className="my-4">
            {info}
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            action="primary"
            className="text-info-500"
            onPress={closeAlert}
          >
            <ButtonText>OK</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
