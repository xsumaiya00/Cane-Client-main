import { Dimensions } from "react-native";

export type TEventObject = {
  x: number;
  y: number;
  timestamp: number;
  status: 1;
  azimuth: number;
  altitude: number;
  pressure: number;
  isStylus: boolean;
};

const WACOM_LPI = 2540;
const WACOM_WIDTH_IN = 8.8;
const WACOM_HEIGHT_IN = 5.5;
const WACOM_MAX_PRESSURE = 2048;

export const normalizeEventData = (eventObject: TEventObject) => {
  const tabletMaxX = WACOM_WIDTH_IN * WACOM_LPI;
  const tabletMaxY = WACOM_HEIGHT_IN * WACOM_LPI;

  const normalizedX = Math.floor(
    (eventObject.x / Dimensions.get("window").width) * tabletMaxX,
  );
  const normalizedY = Math.floor(
    (eventObject.y / Dimensions.get("window").height) * tabletMaxY,
  );

  const normalizedAzimuth = Math.floor(
    (eventObject.azimuth * Dimensions.get("window").width) / 360,
  );
  const normalizedAltitude = Math.floor(
    (eventObject.altitude * Dimensions.get("window").height) / 90,
  );

  const normalizedPressure = Math.floor(
    eventObject.pressure * WACOM_MAX_PRESSURE,
  );

  const normalizedStatus =
    normalizedPressure === 0 && eventObject.isStylus ? 0 : eventObject.status;

  return `${normalizedX} ${normalizedY} ${eventObject.timestamp} ${normalizedStatus} ${normalizedAzimuth} ${normalizedAltitude} ${normalizedPressure}`;
};
