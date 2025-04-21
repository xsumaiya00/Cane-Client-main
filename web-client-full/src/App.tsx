import React, { useState } from "react";
import BluetoothService from "./BluetoothService";

const App = () => {
  return (
    <div>
      <h1>IDUN EEG Web Client</h1>
      <BluetoothService />
    </div>
  );
};

export default App;