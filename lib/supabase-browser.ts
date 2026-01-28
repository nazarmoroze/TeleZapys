import { createBrowserClient as createBrowserClientSsr } from "@supabase/ssr";

const getEnv = (key: string) => {
  const runtimeValue =
    typeof window !== "undefined"
      ? (window as Window & { __SUPABASE_ENV__?: Record<string, string> })
          .__SUPABASE_ENV__?.[key]
      : undefined;
  const value = runtimeValue ?? process.env[key];
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
};

export const createBrowserClient = () =>
  createBrowserClientSsr(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
