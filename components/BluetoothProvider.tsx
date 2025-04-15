import React, { createContext, useEffect, useState } from "react";
import { View, Text } from "react-native";

export const BluetoothContext = createContext<any>(null);

export const BluetoothProvider = ({ children }: { children: React.ReactNode }) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://10.0.2.2:8000/status")  
        .then((res) => res.json())
        .then((data) => {
          setConnected(data.connected);
          console.log("EEG Status:", data.connected);
        })
        .catch((err) => {
          console.log("Status server unreachable");
          setConnected(false);
        });
    }, 3000); // poll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <BluetoothContext.Provider value={{ connected }}>
      {children}

      {/* Optional: Display connection status on screen */}
      <View style={{ padding: 10, alignItems: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          {connected ? "✅ EEG Device Connected" : "❌ EEG Device Not Connected"}
        </Text>
      </View>
    </BluetoothContext.Provider>
  );
};
