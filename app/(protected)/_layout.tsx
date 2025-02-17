import { Redirect, router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { useSession } from "@/utils/AuthContext";
import Loading from "@/components/Loading";
import { Platform } from "react-native";
import { ArrowLeft, Home, User, UserCog } from "lucide-react-native";
import colors from "tailwindcss/colors";
import { useAuthUserRetrieve } from "@/utils/api/apiComponents";

const TabsLayout = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.blue[400],
        headerLeft: () => (
          <ArrowLeft
            size={24}
            color="black"
            style={{ marginHorizontal: 15 }}
            onPress={() => router.push("/dashboard")}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: "Admin Panel",
          href: isAdmin ? "/admin" : null,
          tabBarIcon: ({ color }) => <UserCog size={28} color={color} />,
        }}
      />
      {/* Do not show in tabs */}
      <Tabs.Screen
        name="text"
        options={{
          title: "Text Emotion",
          href: null,
        }}
      />
      <Tabs.Screen
        name="audio"
        options={{
          title: "Speech Emotion",
          href: null,
        }}
      />
      <Tabs.Screen
        name="game-1"
        options={{
          title: "Color Sequence Game",
          href: null,
        }}
      />
      <Tabs.Screen
        name="game-2"
        options={{
          title: "Reasoning and AV Games",
          href: null,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Face Emotion",
          href: null,
        }}
      />
      <Tabs.Screen
        name="canvas"
        options={{
          title: "Emotion with Handwriting",
          href: null,
        }}
      />
      <Tabs.Screen
        name="EEGScan"
        options={{
          title: "EEG Signals",
          href: null,
        }}
      />
        <Tabs.Screen
        name="EarScan"
        options={{
          title: "Ear Signals",
          href: null,
        }}
      />
      <Tabs.Screen
        name="eeg"
        options={{
          title: "EEG",
          href: null,
        }}
      />
      <Tabs.Screen
        name="ear"
        options={{
          title: "Ear",
          href: null,
        }}
      />
      <Tabs.Screen
        name="eeg-save"
        options={{
          title: "EEG Save",
          href: null,
        }}
      />
      <Tabs.Screen
        name="questionnaires/[id]"
        options={{
          title: "Questionnaire",
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Home size={28} color={color} />,
          headerLeft: () => null,
        }}
      />
    </Tabs>
  );
};

export default function ProtectedLayout() {
  const { session, setSession, isLoading } = useSession();

  const { data: user, isLoading: userLoading } = useAuthUserRetrieve({});

  useEffect(() => {
    if (!user && !userLoading) {
      setSession(null);
    }
  }, [setSession, user, userLoading]);

  if ((!session && !isLoading) || (!user && !userLoading)) {
    return <Redirect href="/signin" />;
  } else if (userLoading || isLoading) {
    return <Loading />;
  }

  // TODO: tell BE to fix user Model instead of hardcoding emails 💀
  const isAdmin =
    user?.email === "user1@cane.cz" ||
    user?.email === "aamirmalik@hotmail.com" ||
    user?.email === "dmitrii@cane.cz" ||
    false;

  return Platform.OS === "android" ? (
    <TabsLayout isAdmin={isAdmin} />
  ) : (
    <Slot />
  );
}
