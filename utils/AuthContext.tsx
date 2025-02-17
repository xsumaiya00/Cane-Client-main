import React, {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";
import { useStorageState } from "./useStorageState";

const AuthContext = createContext<{
  session?: string | null;
  isLoading: boolean;
  setSession: (session: string | null) => void;
}>({
  session: null,
  isLoading: true,
  setSession: () => {},
});

export function useSession() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  return (
    <AuthContext.Provider value={{ session, setSession, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
