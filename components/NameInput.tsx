import { Input, InputField } from "@/components/ui/input";
import { Text } from "./ui/text";
import React from "react";
import { Box } from "./ui/box";

export default function NameInput({
  name,
  onChange,
  onBlur,
  value,
  setIsNameFocused,
  isDisabled,
}: {
  name: "First name" | "Last name";
  onChange: (value: string) => void;
  onBlur: () => void;
  value: string;
  setIsNameFocused: (value: boolean) => void;
  isDisabled?: boolean;
}) {
  return (
    <Box className="my-2">
      <Text className="leading-1 mb-1">{name}</Text>
      <Input>
        <InputField
          type="text"
          value={value}
          onChangeText={onChange}
          onBlur={() => {
            onBlur();
            setIsNameFocused(false);
          }}
          onFocus={() => setIsNameFocused(true)}
          returnKeyType="done"
          className={`${isDisabled ? "text-secondary-300 text-sm" : "text-sm"}`}
        />
      </Input>
    </Box>
  );
}
