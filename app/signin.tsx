import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Link, router } from "expo-router";

import { SignInSchemaType, signInSchema } from "@/utils/validations";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import ErrorAlert from "@/components/ErrorAlert";
import Email from "@/components/Email";
import Password from "@/components/Password";
import { useSession } from "@/utils/AuthContext";
import { Card } from "@/components/ui/card";
import { gray } from "tailwindcss/colors";
import Wrapper from "@/components/Wrapper";
import { Platform } from "react-native";
import AlertIcon from "@/components/AlertIcon";
import { useAuthLoginCreate } from "@/utils/api/apiComponents";

export default function SignIn() {
  if (Platform.OS === "web") {
    document.title = "Sign In";
  }

  const { setSession } = useSession();

  const [signInError, setSignInError] = useState<string | null>(null);
  const [isEmailFocused, setIsEmailFocused] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
  });

  const { mutateAsync: signIn, isPending: signInPending } = useAuthLoginCreate(
    {},
  );

  const toggleShowPassword = useCallback(() => {
    setShowPassword((showState) => {
      return !showState;
    });
  }, []);

  const onSubmit = useCallback(
    async (_data: SignInSchemaType) => {
      await signIn({
        body: {
          email: _data.email,
          password: _data.password,
        },
        headers: {
          Authorization: undefined,
        },
      })
        .then((response) => {
          setSession(response.key);
          reset();
          router.replace("/dashboard");
        })
        .catch((error) => {
          if (
            error?.stack?.non_field_errors &&
            Array.isArray(error?.stack?.non_field_errors)
          ) {
            setSignInError(error?.stack?.non_field_errors[0]);
          } else {
            setSignInError(error?.message || error?.stack?.detail);
          }
        });
    },
    [reset, setSession, signIn],
  );

  return (
    <Wrapper noPadding>
      <Center className="flex-1">
        <Card variant="ghost" className="w-full max-w-md">
          <VStack className="p-4">
            <Heading size="xl" className="font-semibold mb-1">
              Sign in to your account
            </Heading>
            <Text className="mb-12">
              Enter your details to access your account
            </Text>

            <FormControl
              isInvalid={
                (Boolean(errors.email) || isEmailFocused) &&
                Boolean(errors.email)
              }
              isRequired
            >
              <Controller
                name="email"
                defaultValue=""
                control={control}
                rules={{
                  validate: async (value) => {
                    try {
                      await signInSchema.parseAsync({ email: value });
                      return true;
                    } catch (error: any) {
                      return error.message;
                    }
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Email
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    setIsEmailFocused={setIsEmailFocused}
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="sm" as={AlertIcon} />
                <FormControlErrorText>
                  {errors?.email?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={Boolean(errors.password)} isRequired>
              <Controller
                name="password"
                defaultValue=""
                control={control}
                rules={{
                  validate: async (value) => {
                    try {
                      await signInSchema.parseAsync({
                        password: value,
                      });
                      return true;
                    } catch (error: any) {
                      return error.message;
                    }
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Password
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    label="Password"
                    showPassword={showPassword}
                    toggleShowPassword={toggleShowPassword}
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="sm" as={AlertIcon} />
                <FormControlErrorText>
                  {errors?.password?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <Button
              onPress={handleSubmit(onSubmit)}
              variant="solid"
              action="primary"
              className="mt-8"
              size="md"
            >
              {signInPending && (
                <ButtonSpinner className="mr-2" color={gray[500]} />
              )}
              <ButtonText>Sign In</ButtonText>
            </Button>
          </VStack>

          <HStack className="flex justify-center items-center mt-8">
            <Text size="sm">Don't have an account? </Text>
            <Link href="/signup" className="self-end h-6">
              Sign Up
            </Link>
          </HStack>

          <ErrorAlert error={signInError} setError={setSignInError} />
        </Card>
      </Center>
    </Wrapper>
  );
}
