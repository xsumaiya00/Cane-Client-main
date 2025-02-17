import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Text } from "./ui/text";
import React from "react";
import { Box } from "./ui/box";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";

export default function Password({
  value,
  onChange,
  onBlur,
  label,
  showPassword,
  toggleShowPassword,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  label: string;
  showPassword: boolean;
  toggleShowPassword: () => void;
}) {
  return (
    <Box className="my-2">
      <Text className="leading-1 mb-1">{label}</Text>
      <Input>
        <InputField
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          returnKeyType="done"
          type={showPassword ? "text" : "password"}
          className="text-sm"
        />
        <InputSlot onPress={toggleShowPassword} className="pr-3">
          <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
        </InputSlot>
      </Input>
    </Box>
  );
}
