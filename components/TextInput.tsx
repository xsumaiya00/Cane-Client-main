import { Input, InputField } from "@/components/ui/input";
import React from "react";

interface ITextInputProps {
  onChange: (value: string) => void;
  onBlur: () => void;
  value: string;
  setIsTextFocused: (value: boolean) => void;
  placeholder?: string;
  multiline?: boolean;
}

const DEFAULT_PLACEHOLDER = "Enter Text here...";

export default function TextInput({
  onChange,
  onBlur,
  value,
  setIsTextFocused,
  placeholder,
  multiline,
}: ITextInputProps) {
  return (
    <Input className="my-2">
      <InputField
        multiline={multiline}
        placeholder={placeholder ?? DEFAULT_PLACEHOLDER}
        type="text"
        value={value}
        onChangeText={onChange}
        onBlur={() => {
          onBlur();
          setIsTextFocused(false);
        }}
        onFocus={() => setIsTextFocused(true)}
        returnKeyType="done"
        className="text-sm"
      />
    </Input>
  );
}
