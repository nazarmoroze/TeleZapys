"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FiArrowLeft, FiBell, FiSearch, FiX } from "react-icons/fi";
import { TelegramCloseButton } from "@/components/telegram/CloseButton";

export default function WindowControlsBar({
  label = "TeleZapys",
}: {
  label?: string;
}) {
  const isTelegram = useSyncExternalStore(
    () => () => {},
    () => Boolean(window.Telegram?.WebApp),
    () => false
  );
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const showDashboardActions =
    pathname === "/home" ||
    pathname === "/calendar" ||
    pathname === "/clients" ||
    pathname === "/services";
  const isClientDetails = pathname.startsWith("/clients/");
  const clientName = searchParams.get("name")?.trim() || "Картка клієнта";
  const clientPhone = searchParams.get("phone")?.trim() || "";
  const isEditingClient = searchParams.get("edit") === "1";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchPanelRef = useRef<HTMLDivElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        searchPanelRef.current?.contains(target) ||
        searchButtonRef.current?.contains(target)
      ) {
        return;
      }
      setIsSearchOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isSearchOpen]);

  return (
    <div className="fixed left-0 right-0 top-0 z-50 border-b border-black/5 bg-[var(--tg-theme-bg-color)] pt-[env(safe-area-inset-top,0px)]">
      <div className="mx-auto flex h-[var(--app-header-height)] w-full max-w-5xl items-center justify-between px-4">
        {isClientDetails ? (
          <>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Назад"
                onClick={() => {
                  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(
                    "light"
                  );
                  router.back();
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white/80 text-[var(--tg-theme-text-color)] transition-transform duration-150 active:scale-[0.96]"
              >
                <FiArrowLeft className="h-5 w-5" />
              </button>
              <span className="text-base font-semibold text-[var(--tg-theme-text-color)]">
                {clientName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isEditingClient) {
                  window.dispatchEvent(new CustomEvent("client:save"));
                  return;
                }
                const params = new URLSearchParams(searchParams.toString());
                params.set("edit", "1");
                router.replace(`${pathname}?${params.toString()}`);
              }}
              className="text-sm font-semibold text-[#217AF8] transition-transform duration-150 active:scale-[0.96]"
            >
              {isEditingClient ? "Зберегти" : "Змінити"}
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/70">
                <Image
                  src="/telezapys-logo.svg"
                  alt="TeleZapys"
                  width={20}
                  height={20}
                  priority
                />
              </div>
              <span className="text-base font-semibold text-[var(--tg-theme-text-color)]">
                {label}
              </span>
              {isTelegram ? (
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold text-[var(--tg-theme-hint-color)]">
                  CRM
                </span>
              ) : null}
            </div>
            {showDashboardActions ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Пошук"
                  aria-expanded={isSearchOpen}
                  aria-controls="home-search-panel"
                  onClick={() => setIsSearchOpen((prev) => !prev)}
                  ref={searchButtonRef}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white/80 text-[var(--tg-theme-hint-color)] transition-transform duration-150 active:scale-[0.96] ${
                    isSearchOpen ? "text-[#217AF8]" : ""
                  }`}
                >
                  <FiSearch className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Сповіщення"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white/80 text-[var(--tg-theme-hint-color)] transition-transform duration-150 active:scale-[0.96]"
                >
                  <FiBell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FF4D4F]" />
                </button>
              </div>
            ) : (
              <TelegramCloseButton action="back" label="Назад" />
            )}
          </>
        )}
      </div>
      {showDashboardActions ? (
        <div
          id="home-search-panel"
          ref={searchPanelRef}
          className={`mx-auto w-full max-w-5xl px-4 transition-[grid-template-rows,opacity,transform] duration-200 ease-in-out ${
            isSearchOpen
              ? "grid grid-rows-[1fr] translate-y-0 opacity-100"
              : "grid grid-rows-[0fr] -translate-y-1 opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="pb-3 pt-2">
              <div className="flex items-center gap-2 rounded-2xl border border-black/5 bg-white px-3 py-2 shadow-sm">
                <FiSearch className="h-4 w-4 text-[var(--tg-theme-hint-color)]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Пошук клієнта або послуги"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  className="h-6 w-full bg-transparent text-base text-[var(--tg-theme-text-color)] outline-none placeholder:text-[var(--tg-theme-hint-color)]"
                />
                {searchValue ? (
                  <button
                    type="button"
                    aria-label="Очистити пошук"
                    onClick={() => {
                      setSearchValue("");
                      searchInputRef.current?.focus();
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--tg-theme-hint-color)] transition-transform duration-150 active:scale-[0.96]"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
