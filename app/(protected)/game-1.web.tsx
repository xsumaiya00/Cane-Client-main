import { View } from "@/components/ui/view";
import React, { useState, useCallback, useEffect } from "react";
import {
  useQuestionsBySlugRetrieve,
  useSaveActivityCreate,
} from "@/utils/api/apiComponents";
import Loading from "@/components/Loading";
import { router, useFocusEffect } from "expo-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

export default function GameOneModule() {
  const [iframeSrc, setIframeSrc] = useState(
    "https://lasjdhu.github.io/cane-client/flutter",
  );
  const { data: gm1Questions, isLoading: gm1Loading } =
    useQuestionsBySlugRetrieve({
      queryParams: { slug: "GM1" },
    });
  const { mutateAsync: saveData } = useSaveActivityCreate({});

  useFocusEffect(
    useCallback(() => {
      document.title = "Color Sequence Game";
      return () => {
        setIframeSrc("about:blank");
        setTimeout(() => {
          setIframeSrc("https://lasjdhu.github.io/cane-client/flutter");
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
          gm1Questions &&
          Array.isArray(gm1Questions) &&
          gm1Questions.length > 0 &&
          typeof gm1Questions[0].id === "number"
        ) {
          await saveData({
            body: {
              activities: [
                {
                  question_id: gm1Questions[0].id,
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
  }, [gm1Questions, saveData]);

  const handleBackPress = () => {
    router.push("/dashboard");
    setIframeSrc("about:blank");
  };

  if (gm1Loading) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <TouchableOpacity style={styles.backArrow} onPress={handleBackPress}>
        <Text style={styles.arrowText}>← Return to dashboard</Text>
      </TouchableOpacity>
      <iframe
        src={iframeSrc}
        style={{ width: "100%", height: "100%", border: "none" }}
      />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  backArrow: {
    position: "absolute",
    top: 68,
    width: "100%",
    zIndex: 1000,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "rgb(0, 0, 0)",
    borderRadius: 5,
  },
  arrowText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
