import { Input, InputField } from "@/components/ui/input";
import { Text } from "./ui/text";
import React from "react";
import { Box } from "./ui/box";

export default function Email({
  onChange,
  onBlur,
  value,
  setIsEmailFocused,
  isDisabled,
}: {
  onChange: (value: string) => void;
  onBlur: () => void;
  value: string;
  setIsEmailFocused: (value: boolean) => void;
  isDisabled?: boolean;
}) {
  return (
    <Box className="my-2">
      <Text className="leading-1 mb-1">Email</Text>
      <Input>
        <InputField
          autoComplete="email"
          placeholder="example@mail.com"
          type="text"
          value={value}
          onChangeText={onChange}
          onBlur={() => {
            onBlur();
            setIsEmailFocused(false);
          }}
          onFocus={() => setIsEmailFocused(true)}
          returnKeyType="done"
          className={`${isDisabled ? "text-secondary-300 text-sm" : "text-sm"}`}
        />
      </Input>
    </Box>
  );
}
