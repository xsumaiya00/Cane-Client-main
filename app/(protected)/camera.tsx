import React, { useState, useRef } from "react";
import { CameraView, CameraViewRef, useCameraPermissions } from "expo-camera";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonText,
} from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import Wrapper from "@/components/Wrapper";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { Image, ActivityIndicator, Platform } from "react-native";
import { Icon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Bot, InfoIcon } from "lucide-react-native";
import DynamicIcon from "@/components/DynamicIcon";
import { router } from "expo-router";
import ErrorAlert from "@/components/ErrorAlert";
import { gray } from "tailwindcss/colors";
import {
  useModulesBySlugRetrieve,
  usePredictIerCreate,
  useQuestionsBySlugRetrieve,
  useSaveActivityCreate,
} from "@/utils/api/apiComponents";
import Loading from "@/components/Loading";

export default function App() {
  if (Platform.OS === "web") {
    document.title = "Camera";
  }
  const [predictionError, setPredictionError] = useState<string | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [predictionResult, setPredictionResult] = useState<{
    emotion: string;
    confidence: number;
  } | null>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const cameraRef = useRef<CameraViewRef>(null);

  const { mutateAsync: predict, isPending: predictPending } =
    usePredictIerCreate({});
  const { data: cerModule, isLoading: cerModuleLoading } =
    useModulesBySlugRetrieve({
      queryParams: { slug: "CER" },
    });
  const { data: cerQuestions, isLoading: cerLoading } =
    useQuestionsBySlugRetrieve({
      queryParams: { slug: "CER" },
    });
  const { mutateAsync: saveData, isPending: savePending } =
    useSaveActivityCreate({});

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsProcessing(true);
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          imageType: "jpg",
          isImageMirror: true,
          quality: 0.7, // Adjust quality if needed
        });

        // Ensure clean base64 string
        const base64WithoutHeader = photo.base64
          ?.replace(/^data:image\/\w+;base64,/, "")
          .replace(/\s/g, "");

        setTimeout(() => {
          setCapturedPhoto(photo.uri);
          setBase64Image(base64WithoutHeader || null);
          setIsProcessing(false);
        }, 2000);
      } catch (error) {
        console.error("Failed to take picture:", error);
        setIsProcessing(false);
      }
    }
  };

  const submitPhoto = async () => {
    if (!base64Image) {
      console.error("No base64Image available");
      return;
    }

    try {
      setIsProcessing(true);
      let cleanBase64 = base64Image;
      if (cleanBase64.includes(",")) {
        cleanBase64 = cleanBase64.split(",")[1];
      }
      cleanBase64 = cleanBase64.replace(/\s/g, "");

      const payload = { image_base64: cleanBase64 };
      const result: any = await predict({ body: payload });

      setPredictionResult({
        emotion: result.emotion || "Unknown",
        confidence: result.confidence || 0,
      });
      if (
        cerQuestions &&
        Array.isArray(cerQuestions) &&
        cerQuestions.length > 0 &&
        typeof cerQuestions[0].id === "number"
      ) {
        await saveData({
          body: {
            activities: [
              {
                question_id: cerQuestions[0].id,
                result: JSON.stringify(result),
              },
            ],
          },
        });
      }
      setIsProcessing(false);
    } catch (error: any) {
      setIsProcessing(false);
      setPredictionError(
        error?.stack?.detail ||
          error?.message ||
          "An unknown error has occurred",
      );
    }
  };
  const resetToCamera = () => {
    setCapturedPhoto(null);
    setBase64Image(null);
    setPredictionResult(null);
    setIsCameraReady(false);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ textAlign: "center", paddingBottom: 16 }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission}>
          <ButtonText>Grant Permissions</ButtonText>
        </Button>
      </View>
    );
  }

  if (cerLoading || cerModuleLoading || !cerQuestions || !cerModule) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <VStack
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          margin: 16,
        }}
      >
        {predictionResult ? (
          <>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Emotion Prediction Result
            </Text>
            <Image
              source={{ uri: capturedPhoto || "" }}
              style={{
                width: 300,
                height: 300,
                borderRadius: 8,
                marginBottom: 20,
                transform: Platform.OS === "android" ? [{ scaleX: -1 }] : [],
              }}
            />
            <View
              style={{
                backgroundColor: gray[200],
                padding: 20,
                borderRadius: 8,
                borderColor: "#E5E7EB",
                borderWidth: 1,
                width: 300,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Detected Emotion:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {predictionResult.emotion.charAt(0).toUpperCase() +
                    predictionResult.emotion.slice(1)}
                </Text>
              </Text>
              <Text style={{ fontSize: 16 }}>
                Confidence:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {predictionResult.confidence.toFixed(2)}%
                </Text>
              </Text>
            </View>
            <ButtonGroup
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                width: 300,
                marginTop: 20,
              }}
            >
              <Button
                style={{ width: "48%" }}
                onPress={resetToCamera}
                variant="outline"
              >
                <ButtonText>Retake</ButtonText>
              </Button>
              <Button
                style={{ width: "48%" }}
                onPress={() => router.replace("/dashboard")}
              >
                <ButtonText>Finish</ButtonText>
              </Button>
            </ButtonGroup>
          </>
        ) : capturedPhoto ? (
          <>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Predict emotions or retake a photo
            </Text>
            <Image
              source={{ uri: capturedPhoto }}
              style={{
                width: 300,
                height: 300,
                borderRadius: 8,
                transform: Platform.OS === "android" ? [{ scaleX: -1 }] : [],
              }}
            />
            <ButtonGroup
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                width: 300,
                marginTop: 20,
              }}
            >
              <Button
                style={{ width: "48%" }}
                onPress={resetToCamera}
                variant="outline"
              >
                <ButtonText>Retake</ButtonText>
              </Button>
              <Button style={{ width: "48%" }} onPress={() => submitPhoto()}>
                <ButtonIcon
                  as={() => (
                    <DynamicIcon
                      icon={Bot}
                      predictPending={predictPending || savePending}
                    />
                  )}
                />
                <ButtonText>Predict</ButtonText>
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              {cerModule[0].instructions}
            </Text>
            <View
              style={{
                width: 300,
                height: 300,
                position: "relative",
                overflow: "hidden",
                borderRadius: 8,
                borderColor: "#E5E7EB",
                borderWidth: 1,
              }}
            >
              <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing={"front"}
                onCameraReady={() => setIsCameraReady(true)}
              />
              {!isCameraReady && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: gray[200],
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10,
                  }}
                >
                  <ActivityIndicator size="large" color={gray[500]} />
                </View>
              )}
              {isProcessing && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: gray[200],
                    zIndex: 20,
                  }}
                >
                  <ActivityIndicator size="large" color={gray[500]} />
                </View>
              )}
            </View>
            {!isProcessing ? (
              <Button
                style={{
                  marginTop: 20,
                  width: 300,
                }}
                onPress={takePicture}
              >
                <ButtonText>Capture Photo</ButtonText>
              </Button>
            ) : (
              <HStack
                space="md"
                className="bg-info-50 align-center items-center"
                style={{
                  marginTop: 20,
                  padding: 8,
                  borderRadius: 8,
                  borderColor: "#E5E7EB",
                  borderWidth: 1,
                  width: 300,
                }}
              >
                <Icon className="text-info-700" as={InfoIcon} />
                <Text className="text-info-700">
                  Photo is being captured...
                </Text>
              </HStack>
            )}
          </>
        )}
        <ErrorAlert error={predictionError} setError={setPredictionError} />
      </VStack>
    </Wrapper>
  );
}
