import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useBluetooth } from "@/components/BluetoothProvider";
import { router } from "expo-router";

const EarScan = () => {
  const { connected: isConnected } = useBluetooth();

  const statusStyle = {
    fontSize: 20,
    fontWeight: "600",
    color: isConnected ? "green" : "red",
    marginBottom: 12,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EEG Device Status</Text>
      <View
  style={{
    padding: 10,
    backgroundColor: isConnected ? "#d1fae5" : "#fee2e2",
    borderRadius: 10,
    marginBottom: 16,
  }}
>
  <Text style={{ color: isConnected ? "#065f46" : "#991b1b", fontSize: 18 }}>
    {isConnected ? "✅ EEG Device Connected" : "❌ EEG Device Not Connected"}
  </Text>
      </View>


      <Image
  source={require("../../assets/images/ear.png")}
  style={styles.image}
      />



      <Pressable
        style={styles.startButton}
        onPress={() => router.push("/scan")}
      >
        <Text style={styles.startButtonText}>Start</Text>
      </Pressable>
    </View>
  );
};

export default EarScan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 250,
    height: 250,
    marginVertical: 20,
    resizeMode: "contain",
  },
  startButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
