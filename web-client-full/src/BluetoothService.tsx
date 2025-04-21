import React, { useState } from "react";

const BluetoothService = () => {
  const [connected, setConnected] = useState(false);

  const connectBluetooth = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "IGEB" }],
        optionalServices: ["battery_service"]
      });
      const server = await device.gatt?.connect();
      if (server) {
        setConnected(true);
      }
    } catch (error) {
      console.error("Connection failed", error);
    }
  };

  return (
    <div>
      <button onClick={connectBluetooth}>
        {connected ? "Connected ✅" : "Connect Bluetooth"}
      </button>
    </div>
  );
};

export default BluetoothService;