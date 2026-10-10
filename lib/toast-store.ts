import { create } from "zustand";
import { genId } from "./utils";

export interface ToastItem {
  id: string;
  message: string;
  tone?: "default" | "success" | "error";
}

interface ToastState {
  toasts: ToastItem[];
  push: (message: string, tone?: ToastItem["tone"]) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message, tone = "default") => {
    const id = genId("toast");
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3200);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast(message: string, tone?: ToastItem["tone"]) {
  useToastStore.getState().push(message, tone);
}
