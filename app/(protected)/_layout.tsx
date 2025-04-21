import { Slot } from "expo-router";
import { Platform } from "react-native";
import { BluetoothProvider } from "@/components/BluetoothProvider";

export default function RootLayout() {
  return (
    <BluetoothProvider>
      <Slot />
    </BluetoothProvider>
  );
}
