import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
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

export default function ErrorAlert({
  error,
  setError,
}: {
  error: string | null;
  setError: (error: string | null) => void;
}) {
  const closeAlert = useCallback(() => {
    setError(null);
  }, [setError]);

  return (
    <AlertDialog isOpen={error !== null} onClose={closeAlert}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading size="lg">Error</Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text size="sm" className="my-4">
            {error}
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button action="negative" onPress={closeAlert}>
            <ButtonText>OK</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
