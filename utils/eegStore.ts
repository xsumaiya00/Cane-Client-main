import { create } from "zustand";

const useEEGStore = create((set: any) => ({
  eegPayload: null,
  setEEGPayload: (data: any) => set({ eegPayload: data }),
  resetEEGPayload: () => set({ eegPayload: null }),
}));

export default useEEGStore;
