import React, { ReactNode } from "react";
import { Box } from "./ui/box";
import Footer from "./Footer";
import Header from "./Header";
import { ScrollView } from "./ui/scroll-view";
import { Platform } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/_layout";

export default function Wrapper({
  noPadding,
  children,
}: {
  noPadding?: boolean;
  children: ReactNode;
}) {
  const isWeb = Platform.OS === "web";
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollView>
        <Box className="flex flex-col min-h-screen max-h-full">
          {isWeb && <Header />}
          <Box
            className={
              noPadding
                ? "flex-1 py-6 overflow-y-scroll"
                : "flex-1 py-6 xs:px-2 sm:px-2 md:px-24 lg:px-36 xl:px-72 overflow-y-scroll"
            }
          >
            {children}
          </Box>
          {isWeb && <Footer />}
        </Box>
      </ScrollView>
    </QueryClientProvider>
  );
}
