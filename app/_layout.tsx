import { StatusBar } from "@/components/ui/status-bar";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { SessionProvider } from "@/utils/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Loading from "@/components/Loading";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <GluestackUIProvider mode="light">
        <Loading />
      </GluestackUIProvider>
    );
  }

  return <RootLayoutProviders />;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function RootLayoutProviders() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <GluestackUIProvider mode="light">
          <QueryClientProvider client={queryClient}>
            <SessionProvider>
              <Slot />
            </SessionProvider>
            <StatusBar barStyle="default" />
          </QueryClientProvider>
        </GluestackUIProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
