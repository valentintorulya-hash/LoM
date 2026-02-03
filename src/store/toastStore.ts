import { create } from 'zustand';
import type { Toast, ToastType } from '../components/ui/Toast';

interface ToastState {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (type: ToastType, title: string, message?: string, duration?: number) => {
    const id = `${Date.now()}-${Math.random()}`;
    const toast: Toast = {
      id,
      type,
      title,
      message,
      duration: duration || 3000,
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },
}));

// Helper functions for easier usage
export const toast = {
  success: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().addToast('success', title, message, duration);
  },
  error: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().addToast('error', title, message, duration);
  },
  warning: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().addToast('warning', title, message, duration);
  },
  info: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().addToast('info', title, message, duration);
  },
};
