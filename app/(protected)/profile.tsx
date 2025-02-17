import AlertIcon from "@/components/AlertIcon";
import Email from "@/components/Email";
import ErrorAlert from "@/components/ErrorAlert";
import Loading from "@/components/Loading";
import NameInput from "@/components/NameInput";
import Wrapper from "@/components/Wrapper";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { useSession } from "@/utils/AuthContext";
import {
  useAuthLogoutCreate,
  useAuthUserPartialUpdate,
  useAuthUserRetrieve,
} from "@/utils/api/apiComponents";
import { ProfileSchemaType, profileSchema } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform } from "react-native";
import { gray } from "tailwindcss/colors";

export default function Profile() {
  if (Platform.OS === "web") {
    document.title = "Profile";
  }

  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);
  const [isEmailFocused, setIsEmailFocused] = useState<boolean>(false);
  const [isFirstNameFocused, setIsFirstNameFocused] = useState<boolean>(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState<boolean>(false);

  const [editing, setEditing] = useState<boolean>(false);

  const { setSession } = useSession();
  const { mutateAsync: signOut } = useAuthLogoutCreate({});
  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useAuthUserRetrieve({});
  const { mutateAsync: updateUser, isPending: updatePending } =
    useAuthUserPartialUpdate({});

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = useCallback(
    async (_data: ProfileSchemaType) => {
      await updateUser({
        body: {
          email: _data.email,
          first_name: _data.first_name,
          last_name: _data.last_name,
        },
      })
        .then(() => {
          refetchUser();
        })
        .catch((error: any) => {
          if (
            error?.stack?.non_field_errors &&
            Array.isArray(error?.stack?.non_field_errors)
          ) {
            setFormSubmitError(error?.stack?.non_field_errors[0]);
          } else {
            setFormSubmitError(error?.message || error?.stack?.detail);
          }
        });
      setEditing(!editing);
    },
    [editing, refetchUser, updateUser],
  );

  const toggleEdit = useCallback(() => {
    if (editing) {
      handleSubmit(onSubmit)();
    } else {
      setEditing(!editing);
    }
  }, [editing, handleSubmit, onSubmit]);

  if (userLoading) {
    return <Loading />;
  }

  console.log("user", user);

  return (
    <Wrapper>
      <Card variant="ghost" className="flex-1 mx-0 lg:mx-32">
        <HStack className="justify-between mb-12 items-center">
          <Heading size="xl" className="text-heading">
            Your data
          </Heading>
          <Button
            variant={editing ? "solid" : "outline"}
            onPress={toggleEdit}
            className="w-36"
          >
            {updatePending && (
              <ButtonSpinner color={gray[500]} className="mr-2" />
            )}
            <ButtonText>{editing ? "Save" : "Edit"}</ButtonText>
          </Button>
        </HStack>

        <FormControl
          isDisabled={!editing}
          isInvalid={
            (Boolean(errors.first_name) || isFirstNameFocused) &&
            Boolean(errors.first_name)
          }
          isRequired
        >
          <Controller
            name="first_name"
            defaultValue={user?.first_name}
            control={control}
            rules={{
              validate: async (value) => {
                try {
                  await profileSchema.parseAsync({ first_name: value });
                  return true;
                } catch (error: any) {
                  return error.message;
                }
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <NameInput
                name="First name"
                isDisabled={!editing}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                setIsNameFocused={setIsFirstNameFocused}
              />
            )}
          />
          <FormControlError>
            <FormControlErrorIcon size="sm" as={AlertIcon} />
            <FormControlErrorText>
              {errors?.first_name?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl
          isDisabled={!editing}
          isInvalid={
            (Boolean(errors.last_name) || isLastNameFocused) &&
            Boolean(errors.last_name)
          }
          isRequired
        >
          <Controller
            name="last_name"
            defaultValue={user?.last_name}
            control={control}
            rules={{
              validate: async (value) => {
                try {
                  await profileSchema.parseAsync({ last_name: value });
                  return true;
                } catch (error: any) {
                  return error.message;
                }
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <NameInput
                name="Last name"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                setIsNameFocused={setIsLastNameFocused}
                isDisabled={!editing}
              />
            )}
          />
          <FormControlError>
            <FormControlErrorIcon size="sm" as={AlertIcon} />
            <FormControlErrorText>
              {errors?.last_name?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl
          isDisabled={!editing}
          isInvalid={
            (Boolean(errors.email) || isEmailFocused) && Boolean(errors.email)
          }
          isRequired
        >
          <Controller
            name="email"
            defaultValue={user?.email}
            control={control}
            rules={{
              validate: async (value) => {
                try {
                  await profileSchema.parseAsync({ email: value });
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
                isDisabled={!editing}
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

        <Button
          variant="outline"
          className="mt-8 w-full lg:w-96"
          onPress={() =>
            signOut({})
              .then(() => setSession(null))
              .catch(() => setSession(null))
          }
        >
          <ButtonText className="text-sm font-medium underline-offset-4">
            Sign Out
          </ButtonText>
        </Button>
      </Card>
      <ErrorAlert error={formSubmitError} setError={setFormSubmitError} />
    </Wrapper>
  );
}
