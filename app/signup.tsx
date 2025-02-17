import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Link, router } from "expo-router";
import uuid from "react-native-uuid";

import { Controller, useForm } from "react-hook-form";
import { SignUpSchemaType, signUpSchema } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import Email from "@/components/Email";
import Password from "@/components/Password";
import ErrorAlert from "@/components/ErrorAlert";
import InfoAlert from "@/components/InfoAlert";
import { Card } from "@/components/ui/card";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { gray } from "tailwindcss/colors";
import Wrapper from "@/components/Wrapper";
import { Platform } from "react-native";
import { CheckIcon } from "lucide-react-native";
import AlertIcon from "@/components/AlertIcon";
import { useAuthRegistrationCreate } from "@/utils/api/apiComponents";

export default function SignUp() {
  if (Platform.OS === "web") {
    document.title = "Sign Up";
  }

  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isEmailFocused, setIsEmailFocused] = useState<boolean>(false);
  const [showPassword_1, setShowPassword_1] = useState<boolean>(false);
  const [showPassword_2, setShowPassword_2] = useState<boolean>(false);

  const closeSuccessDialog = useCallback(() => {
    setShowSuccess(false);
    router.replace("/signin");
  }, []);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutateAsync: signUp, isPending: signUpPending } =
    useAuthRegistrationCreate({});

  const toggleShowPassword_1 = useCallback(() => {
    setShowPassword_1((showState) => {
      return !showState;
    });
  }, []);
  const toggleShowPassword_2 = useCallback(() => {
    setShowPassword_2((showState) => {
      return !showState;
    });
  }, []);

  const onSubmit = useCallback(
    async (_data: SignUpSchemaType) => {
      await signUp({
        body: {
          username: uuid.v4().toString(),
          email: _data.email,
          password1: _data.password1,
          password2: _data.password2,
        },
        headers: {
          Authorization: undefined,
        },
      })
        .then(() => {
          setShowSuccess(true);
        })
        .catch((error) => {
          if (
            error?.stack?.non_field_errors &&
            Array.isArray(error?.stack?.non_field_errors)
          ) {
            setSignUpError(error?.stack?.non_field_errors[0]);
          } else {
            setSignUpError(error?.message || error?.stack?.detail);
          }
        });

      reset();
    },
    [reset, signUp],
  );

  return (
    <Wrapper noPadding>
      <Center className="flex-1">
        <Card variant="ghost" className="w-full max-w-md ">
          <VStack className="p-4">
            <Heading size="xl" className="font-semibold mb-12">
              Create new account
            </Heading>

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
                      await signUpSchema.parseAsync({ email: value });
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

            <FormControl isInvalid={Boolean(errors.password1)} isRequired>
              <Controller
                name="password1"
                defaultValue=""
                control={control}
                rules={{
                  validate: async (value) => {
                    try {
                      await signUpSchema.parseAsync({
                        password1: value,
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
                    showPassword={showPassword_1}
                    toggleShowPassword={toggleShowPassword_1}
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="sm" as={AlertIcon} />
                <FormControlErrorText>
                  {errors?.password1?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={Boolean(errors.password2)} isRequired>
              <Controller
                name="password2"
                defaultValue=""
                control={control}
                rules={{
                  validate: async (value) => {
                    try {
                      await signUpSchema.parseAsync({
                        password2: value,
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
                    label="Confirm password"
                    showPassword={showPassword_2}
                    toggleShowPassword={toggleShowPassword_2}
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="sm" as={AlertIcon} />
                <FormControlErrorText>
                  {errors?.password2?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <Checkbox
              value="checked"
              size="sm"
              isInvalid={false}
              isDisabled={false}
              className="mt-4"
            >
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
              <CheckboxLabel>
                I agree to Terms of Service and Privacy Policy
              </CheckboxLabel>
            </Checkbox>

            <Button onPress={handleSubmit(onSubmit)} className="mt-8">
              {signUpPending && (
                <ButtonSpinner className="mr-2" color={gray[500]} />
              )}
              <ButtonText>Sign Up</ButtonText>
            </Button>
          </VStack>
          <HStack className="flex justify-center items-center mt-8">
            <Text size="sm">Already have an account? </Text>
            <Link href="/signin" className="self-end h-6">
              Sign In
            </Link>
          </HStack>
          <ErrorAlert error={signUpError} setError={setSignUpError} />
          <InfoAlert
            info="Congratulations! You were successfully signed up."
            isOpen={showSuccess}
            onClose={closeSuccessDialog}
          />
        </Card>
      </Center>
    </Wrapper>
  );
}
