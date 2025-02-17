import React, { useCallback, useRef, useState } from "react";
import { WebView } from "react-native-webview";
import { View } from "react-native";
import {
  useQuestionsBySlugRetrieve,
  useSaveActivityCreate,
} from "@/utils/api/apiComponents";
import Loading from "@/components/Loading";
import { useFocusEffect } from "expo-router";

export default function GameTwoModule() {
  const webviewRef = useRef(null);
  const [source, setSource] = useState({
    uri: "https://lasjdhu.github.io/cane-client/unity",
  });
  const { data: gm2Questions, isLoading: gm2Loading } =
    useQuestionsBySlugRetrieve({
      queryParams: { slug: "GM2" },
    });
  const { mutateAsync: saveData } = useSaveActivityCreate({});

  useFocusEffect(
    useCallback(() => {
      // Reset source when screen loses focus
      return () => {
        setSource({ uri: "about:blank" });
        console.log("Resetting source");
        setTimeout(() => {
          setSource({ uri: "https://lasjdhu.github.io/cane-client/unity" });
          webviewRef.current?.reload();
        }, 100);
      };
    }, []),
  );

  if (gm2Loading) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={source}
        onMessage={async (event) => {
          console.log(event.nativeEvent.data);
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
                    result: JSON.stringify(event.nativeEvent.data),
                  },
                ],
              },
            });
          }
        }}
      />
    </View>
  );
}
