const BluetoothService = {
  async connect() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "IGEB" }],
        optionalServices: ["battery_service", "device_information"],
      });
      const server = await device.gatt?.connect();
      return server;
    } catch (error) {
      console.error("Connection failed:", error);
      return null;
    }
  },

  async getBatteryLevel(server: BluetoothRemoteGATTServer) {
    try {
      const service = await server.getPrimaryService("battery_service");
      const characteristic = await service.getCharacteristic("battery_level");
      const value = await characteristic.readValue();
      return value.getUint8(0);
    } catch {
      return null;
    }
  },

  async streamImpedance(
    server: BluetoothRemoteGATTServer,
    onData: (value: number) => void
  ) {
    // This function is mocked — replace with real characteristic UUIDs
    console.log("Streaming impedance...");
    const fakeInterval = setInterval(() => {
      const fakeImpedance = Math.floor(Math.random() * 10000);
      onData(fakeImpedance);
    }, 1000);
    return () => clearInterval(fakeInterval);
  },
};

export default BluetoothService;
