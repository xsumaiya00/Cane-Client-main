import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NativeEventEmitter, NativeModules } from "react-native";
import ErrorAlert from "@/components/ErrorAlert";
import { Audio } from "expo-av";

import TextInput from "@/components/TextInput";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { router } from "expo-router";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { gray } from "tailwindcss/colors";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";
import { Brain, EyeIcon, EyeOffIcon } from "lucide-react-native";
import useEEGStore from "@/utils/eegStore";

const { EEGBuffer } = NativeModules;
const eegEventEmitter = new NativeEventEmitter(EEGBuffer);

interface ScanType {
  eyesOpen: boolean;
  eyesClosed: boolean;
  [key: string]: boolean;
}

interface SubmitScanPayload {
  eyesOpen: number[][];
  eyesClosed: number[][];
}

const StringMap: Record<string, string> = {
  eyesOpen: "Eyes Open",
  eyesClosed: "Eyes Closed",
};

const CONVERT_MINUTES_TO_MILLISECONDS = 60000;
const CONVERT_SECONDS_TO_MILLISECONDS = 1000;
const SCAN_COUNTDOWN_SECONDS = 5;

export default function EEGScan() {
  const { setEEGPayload } = useEEGStore();
  const [scanTime, setScanTime] = useState<string>("");
  const [isSecondsInput, setIsSecondsInput] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<ScanType>({
    eyesOpen: false,
    eyesClosed: false,
  });
  const [scanStatus, setScanStatus] = useState<ScanType>({
    eyesOpen: false,
    eyesClosed: false,
  });
  const scanData = useRef({
    eyesOpen: [],
    eyesClosed: [],
  });
  const [dataSetter, setDataSetter] = useState<(data: any) => void>(() => {});
  const [error, setError] = useState<string | null>(null);
  const [scanCountdown, setScanCountdown] = useState(SCAN_COUNTDOWN_SECONDS);
  const [showCountdownText, setShowCountdownText] = useState<boolean>(false);
  const [countdownText, setCountdownText] = useState<string>("");
  const [payload, setPayload] = useState<SubmitScanPayload | null>(null);

  const intervalRef = useRef<NodeJS.Timeout>();

  const sound = useRef(new Audio.Sound());

  const loadScanCompleteSound = useCallback(async () => {
    try {
      await sound.current.loadAsync(
        require("../../assets/sounds/complete.mp3"),
      );
    } catch (error) {
      console.error("Error loading sound", error);
    }
  }, []);

  const playSoundOnScanComplete = useCallback(async () => {
    try {
      await sound.current.stopAsync();
      await sound.current.replayAsync();
    } catch (error) {
      console.error("Error playing sound", error);
    }
  }, []);

  const timeSelectorText = useMemo(
    () => (isSecondsInput ? "seconds" : "minutes"),
    [isSecondsInput],
  );
  const timeSelectorButtonText = useMemo(
    () => (isSecondsInput ? "Change to minutes" : "Change to seconds"),
    [isSecondsInput],
  );

  const handleTimeSelectorChange = useCallback(() => {
    setIsSecondsInput((prev) => !prev);
  }, []);

  const setEyesOpenData = useCallback(
    (data: any) => {
      EEGBuffer?.abortScan();
      scanData.current.eyesOpen = data;
      setScanStatus((prev) => ({ ...prev, eyesOpen: true }));
      setIsScanning({ eyesOpen: false, eyesClosed: false });
      setScanCountdown(SCAN_COUNTDOWN_SECONDS);
      playSoundOnScanComplete();
    },
    [playSoundOnScanComplete],
  );

  const setEyesClosedData = useCallback(
    (data: any) => {
      EEGBuffer?.abortScan();
      scanData.current.eyesClosed = data;
      setScanStatus((prev) => ({ ...prev, eyesClosed: true }));
      setIsScanning({ eyesOpen: false, eyesClosed: false });
      setScanCountdown(SCAN_COUNTDOWN_SECONDS);
      playSoundOnScanComplete();
    },
    [playSoundOnScanComplete],
  );

  const onChange = useCallback((text: string) => {
    setScanTime(text);
  }, []);

  const isDeviceAlreadyScanning = useCallback(() => {
    return isScanning.eyesOpen || isScanning.eyesClosed;
  }, [isScanning]);

  const verifyScanTime = useCallback(() => {
    if (!scanTime) {
      setError("Please enter number of minutes/seconds");
      return false;
    }
    return true;
  }, [scanTime]);

  const getScanTimeInMilliseconds = useCallback(() => {
    if (isSecondsInput) {
      return Number(scanTime) * CONVERT_SECONDS_TO_MILLISECONDS;
    }
    return Number(scanTime) * CONVERT_MINUTES_TO_MILLISECONDS;
  }, [isSecondsInput, scanTime]);

  const handleEyesOpenScan = useCallback(() => {
    if (isDeviceAlreadyScanning() || scanStatus.eyesOpen) {
      return;
    }
    if (!verifyScanTime()) {
      return;
    }
    setDataSetter(() => {
      return setEyesOpenData;
    });
    setCountdownText(
      "Look at the center of the screen, Eyes Open scan will start in",
    );
    setShowCountdownText(true);
    intervalRef.current = setInterval(() => {
      setScanCountdown((prev) => prev - 1);
    }, 1000);

    setIsScanning({ eyesOpen: true, eyesClosed: false });
    try {
      setTimeout(() => {
        setShowCountdownText(false);
        EEGBuffer?.startScan(getScanTimeInMilliseconds());
      }, SCAN_COUNTDOWN_SECONDS * CONVERT_SECONDS_TO_MILLISECONDS);
    } catch (error) {
      console.log("Error in startScan", error);
    }
  }, [
    getScanTimeInMilliseconds,
    isDeviceAlreadyScanning,
    scanStatus.eyesOpen,
    setEyesOpenData,
    verifyScanTime,
  ]);

  const handleEyesClosedScan = useCallback(() => {
    if (isDeviceAlreadyScanning() || scanStatus.eyesClosed) {
      return;
    }
    if (!verifyScanTime()) {
      return;
    }
    setDataSetter(() => {
      return setEyesClosedData;
    });
    setCountdownText("Close your eyes, Eyes Closed scan will start in");
    setShowCountdownText(true);
    intervalRef.current = setInterval(() => {
      setScanCountdown((prev) => prev - 1);
    }, 1000);
    setIsScanning({ eyesOpen: false, eyesClosed: true });
    try {
      setTimeout(() => {
        setShowCountdownText(false);
        EEGBuffer?.startScan(getScanTimeInMilliseconds());
      }, SCAN_COUNTDOWN_SECONDS * CONVERT_SECONDS_TO_MILLISECONDS);
    } catch (error) {
      console.log("Error in startScan", error);
    }
  }, [
    getScanTimeInMilliseconds,
    isDeviceAlreadyScanning,
    scanStatus.eyesClosed,
    setEyesClosedData,
    verifyScanTime,
  ]);

  const getButtonText = useCallback(
    (scanType: string) => {
      if (isScanning[scanType]) {
        return "Scanning...";
      }
      if (scanStatus[scanType]) {
        return "Scan Complete";
      }
      return `Start ${StringMap[scanType]} Scan`;
    },
    [isScanning, scanStatus],
  );

  const sendPayload = useCallback(
    async (payload: SubmitScanPayload) => {
      console.log("Sending payload", payload);
      setPayload(payload);
      setEEGPayload(payload);
      router.push("/eeg-save");
    },
    [setEEGPayload],
  );

  const handleSubmit = useCallback(() => {
    console.log("Submitting scan data", scanData.current);
    const payload: SubmitScanPayload = {
      eyesOpen: scanData.current.eyesOpen,
      eyesClosed: scanData.current.eyesClosed,
    };
    sendPayload(payload);
    //EEGBuffer?.stopServer();
  }, [sendPayload]);

  // const renderSubmitButton = useCallback(() => {
  //   const bothScansComplete = scanStatus.eyesOpen && scanStatus.eyesClosed;
  //   if (!bothScansComplete) {
  //     return null;
  //   }
  //   return (
  //     <Button
  //       onPress={handleSubmit}
  //       disabled={isScanning.submit || !(scanStatus.eyesOpen && scanStatus.eyesClosed)}
  //       className="mt-8"
  //     >
  //       {isScanning.submit && <ButtonSpinner color={gray[500]} className="mr-2" />}
  //       <ButtonText>Submit Data</ButtonText>
  //     </Button>
  //   );
  //   {/* <Pressable */ }
  //   {/*   onPress={handleSubmit} */ }
  //   {/*   className={`flex items-center  mt-8 flex-row gap-2 justify-center p-4 rounded-md ${!scanStatus.eyesClosed ? "bg-primary-950" : "bg-primary-950"}`} */ }
  //   {/* > */ }
  //   {/*   {isScanning.submit && <ActivityIndicator />} */ }
  //   {/*   <Text className="text-white">Submit Data</Text> */ }
  //   {/* </Pressable> */ }
  // }, [
  //   handleSubmit,
  //   isScanning.submit,
  //   scanStatus.eyesClosed,
  //   scanStatus.eyesOpen,
  // ]);

  const shouldRenderEyesOpenScanCross = useMemo(() => {
    return scanCountdown === 0 && isScanning.eyesOpen;
  }, [scanCountdown, isScanning.eyesOpen]);

  const renderEyesOpenScanCross = useCallback(() => {
    return (
      <Box className="w-[100px] h-[100px] items-center justify-center  relative">
        <Box className="absolute w-full h-[2] bg-black" />
        <Box className="absolute w-[2] h-full bg-black" />
      </Box>
    );
  }, []);

  useEffect(() => {
    loadScanCompleteSound();
    return sound.current
      ? () => {
          sound.current.unloadAsync();
        }
      : undefined;
  }, [loadScanCompleteSound]);

  useEffect(() => {
    const dataListener = eegEventEmitter.addListener("onEEGData", (data) => {
      if (!data || !data.length) {
        setError("Scan device not connected");
        setIsScanning({ eyesOpen: false, eyesClosed: false });

        return;
      }
      dataSetter(data);
    });

    const errorListener = eegEventEmitter.addListener("onEEGError", (error) => {
      setError(error);
      setIsScanning({ eyesOpen: false, eyesClosed: false });
      setScanCountdown(SCAN_COUNTDOWN_SECONDS);
    });

    return () => {
      dataListener.remove();
      errorListener.remove();
    };
  }, [dataSetter, playSoundOnScanComplete]);

  useEffect(() => {
    if (scanCountdown === 0) {
      clearInterval(intervalRef.current);
    }
  }, [scanCountdown]);

  useEffect(() => {
    return () => {
      // EEGBuffer?.stopServer();
    };
  }, []);

  const handleRestart = useCallback(() => {
    // Reset all scan-related states
    setScanTime("");
    setIsScanning({ eyesOpen: false, eyesClosed: false });
    setScanStatus({ eyesOpen: false, eyesClosed: false });
    scanData.current = { eyesOpen: [], eyesClosed: [] };
    setPayload(null);
    setError(null);
    setScanCountdown(SCAN_COUNTDOWN_SECONDS);
  }, []);

  const BrainSized = () => <Brain size={24} color="black" />;

  return (
    <Center className="flex-1">
      {showCountdownText ? (
        <Box className="items-center justify-center">
          <Text className="text-2xl">{countdownText}</Text>
          <Text className="text-4xl mt-4">{scanCountdown}</Text>
        </Box>
      ) : shouldRenderEyesOpenScanCross ? (
        renderEyesOpenScanCross()
      ) : (
        <Card variant="outline" className="w-96 py-6">
          <HStack className="text-xl flex items-center space-x-2 pb-2">
            <Icon as={BrainSized} />
            <Heading className="pl-4">EEG Signals</Heading>
          </HStack>

          {payload ? (
            <>
              <Box className="mt-2">
                <Heading size="md" className="mb-2">
                  Eyes Open Data
                </Heading>
                <Text>
                  {JSON.stringify(payload.eyesOpen.slice(0, 100)) + "..."}
                </Text>
                <Heading size="md" className="mt-4 mb-2">
                  Eyes Closed Data
                </Heading>
                <Text>
                  {JSON.stringify(payload.eyesClosed.slice(0, 100)) + "..."}
                </Text>
              </Box>
              <ButtonGroup
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginTop: 20,
                }}
              >
                <Button
                  onPress={handleRestart}
                  variant="outline"
                  style={{ width: "48%" }}
                >
                  <ButtonText>Restart</ButtonText>
                </Button>
                <Button
                  onPress={() => {
                    handleRestart();
                    router.replace("/dashboard");
                  }}
                  style={{ width: "48%" }}
                >
                  <ButtonText>Finish</ButtonText>
                </Button>
              </ButtonGroup>
            </>
          ) : (
            <>
              <Text className="text-sm text-typography-500">
                Scan your brain waves with EEG device
              </Text>
              <HStack className="mt-8 mb-1">
                <Heading>Type in the time for scan in </Heading>
                <Heading className="underline">{timeSelectorText}</Heading>
              </HStack>
              <Box className="w-full mb-12">
                <TextInput
                  value={scanTime}
                  onChange={onChange}
                  onBlur={() => {}}
                  setIsTextFocused={() => {}}
                  placeholder="Enter time"
                />
                <Button variant="outline" onPress={handleTimeSelectorChange}>
                  <ButtonText>{timeSelectorButtonText}</ButtonText>
                </Button>
              </Box>
              <Button
                onPress={handleEyesOpenScan}
                isDisabled={isDeviceAlreadyScanning() || scanStatus.eyesOpen}
                className="mb-4"
              >
                {isScanning.eyesOpen ? (
                  <ButtonSpinner color={gray[500]} className="mr-2" />
                ) : (
                  <ButtonIcon as={EyeIcon} />
                )}
                <ButtonText>{getButtonText("eyesOpen")}</ButtonText>
              </Button>
              <Button
                onPress={handleEyesClosedScan}
                isDisabled={isDeviceAlreadyScanning() || scanStatus.eyesClosed}
              >
                {isScanning.eyesClosed ? (
                  <ButtonSpinner color={gray[500]} className="mr-2" />
                ) : (
                  <ButtonIcon as={EyeOffIcon} />
                )}
                <ButtonText>{getButtonText("eyesClosed")}</ButtonText>
              </Button>
              <Button
                onPress={handleSubmit}
                isDisabled={
                  isScanning.submit ||
                  !(scanStatus.eyesOpen && scanStatus.eyesClosed)
                }
                className="mt-8"
              >
                {isScanning.submit && (
                  <ButtonSpinner color={gray[500]} className="mr-2" />
                )}
                <ButtonText>Submit Data</ButtonText>
              </Button>
            </>
          )}
        </Card>
      )}
      <ErrorAlert error={error} setError={setError} />
    </Center>
  );
}
