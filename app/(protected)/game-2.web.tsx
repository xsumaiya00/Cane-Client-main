import Wrapper from "@/components/Wrapper";
import React, { useCallback, useEffect, useState } from "react";
import {
  useQuestionsBySlugRetrieve,
  useSaveActivityCreate,
} from "@/utils/api/apiComponents";
import Loading from "@/components/Loading";
import { router, useFocusEffect } from "expo-router";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

export default function GameTwoModule() {
  const [iframeSrc, setIframeSrc] = useState(
    "https://lasjdhu.github.io/cane-client/unity",
  );
  const { data: gm2Questions, isLoading: gm2Loading } =
    useQuestionsBySlugRetrieve({
      queryParams: { slug: "GM2" },
    });
  const { mutateAsync: saveData } = useSaveActivityCreate({});

  useFocusEffect(
    useCallback(() => {
      document.title = "Reasoning and AV Games";
      return () => {
        setIframeSrc("about:blank");
        setTimeout(() => {
          setIframeSrc("https://lasjdhu.github.io/cane-client/unity");
          window.location.reload();
        }, 100);
      };
    }, []),
  );

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin === "https://lasjdhu.github.io") {
        console.log(event.data);
        if (
          gm2Questions &&
          Array.isArray(gm2Questions) &&
          gm2Questions.length > 0 &&
          typeof gm2Questions[0].id === "number"
        ) {
          await saveData({
            body: {
              activities: [
                {
                  question_id: gm2Questions[0].id,
                  result: JSON.stringify(event.data),
                },
              ],
            },
          });
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [gm2Questions, saveData]);

  const handleBackPress = () => {
    router.push("/dashboard");
    setIframeSrc("about:blank");
  };

  if (gm2Loading) {
    return <Loading />;
  }

  return (
    <Wrapper noPadding>
      <TouchableOpacity style={styles.backArrow} onPress={handleBackPress}>
        <Text style={styles.arrowText}>← Return to dashboard</Text>
      </TouchableOpacity>
      <div
        style={{
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            transform: "scale(0.4)",
            transformOrigin: "0 0",
            width: "250%",
            height: "250%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <iframe
            src={iframeSrc}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  backArrow: {
    position: "absolute",
    top: 20,
    zIndex: 1000,
    padding: 10,
    margin: 5,
    backgroundColor: "rgb(0, 0, 0)",
    borderRadius: 5,
    alignSelf: "center",
    width: "auto",
  },
  arrowText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
