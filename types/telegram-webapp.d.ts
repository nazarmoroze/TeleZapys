export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
    __SUPABASE_ENV__?: Record<string, string>;
  }

  interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
      user?: {
        id: number;
        first_name?: string;
        last_name?: string;
        username?: string;
        language_code?: string;
      };
      query_id?: string;
      auth_date?: number;
    };
    themeParams: Record<string, string>;
    ready: () => void;
    expand: () => void;
    enableClosingConfirmation: () => void;
    close?: () => void;
    openLink: (url: string) => void;
    showAlert?: (message: string) => void;
    HapticFeedback?: {
      impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    };
    MainButton: {
      show: () => void;
      hide: () => void;
      setText: (text: string) => void;
      onClick: (callback: () => void) => void;
      offClick: (callback: () => void) => void;
      showProgress: () => void;
      hideProgress: () => void;
    };
    BackButton: {
      show: () => void;
      hide: () => void;
      onClick: (callback: () => void) => void;
      offClick: (callback: () => void) => void;
    };
    CloudStorage?: {
      getItem: (key: string) => Promise<string | null>;
      setItem: (key: string, value: string) => Promise<void>;
      removeItem?: (key: string) => Promise<void>;
    };
    onEvent?: (eventType: string, callback: () => void) => void;
    offEvent?: (eventType: string, callback: () => void) => void;
  }
}
