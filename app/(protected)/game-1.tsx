import React, { useRef, useState, useCallback } from "react";
import { WebView } from "react-native-webview";
import { View } from "react-native";
import {
  useQuestionsBySlugRetrieve,
  useSaveActivityCreate,
} from "@/utils/api/apiComponents";
import Loading from "@/components/Loading";
import { useFocusEffect } from "expo-router";

export default function GameOneModule() {
  const webviewRef = useRef(null);
  const [source, setSource] = useState({
    uri: "https://lasjdhu.github.io/cane-client/flutter",
  });
  const { data: gm1Questions, isLoading: gm1Loading } =
    useQuestionsBySlugRetrieve({
      queryParams: { slug: "GM1" },
    });
  const { mutateAsync: saveData } = useSaveActivityCreate({});

  useFocusEffect(
    useCallback(() => {
      // Reset source when screen loses focus
      return () => {
        setSource({ uri: "about:blank" });
        console.log("Resetting source");
        setTimeout(() => {
          setSource({ uri: "https://lasjdhu.github.io/cane-client/flutter" });
          webviewRef.current?.reload();
        }, 100);
      };
    }, []),
  );

  if (gm1Loading) {
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
