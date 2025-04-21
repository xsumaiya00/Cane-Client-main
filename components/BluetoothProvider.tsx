// Updated BluetoothProvider.tsx
import React, { createContext, useEffect, useState, useContext } from "react";
import { View, Text } from "react-native";

interface BluetoothContextProps {
  connected: boolean;
  setConnected: (status: boolean) => void;
}

export const BluetoothContext = createContext<BluetoothContextProps | null>(null);

export const BluetoothProvider = ({ children }: { children: React.ReactNode }) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://100.64.218.145:8000/status")
        .then((res) => res.json())
        .then((data) => {
          setConnected(data.connected);
          console.log("EEG Status:", data.connected);
        })
        .catch((err) => {
          console.log("Status server unreachable");
          setConnected(false);
        });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BluetoothContext.Provider value={{ connected, setConnected }}>
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = () => useContext(BluetoothContext);
