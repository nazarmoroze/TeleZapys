"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiCalendar, FiHome, FiUsers } from "react-icons/fi";
import { HiOutlineSquares2X2 } from "react-icons/hi2";

const navItems = [
  { href: "/home", label: "Дім", icon: FiHome },
  { href: "/calendar", label: "Календар", icon: FiCalendar },
  { href: "/clients", label: "Клієнти", icon: FiUsers },
  { href: "/services", label: "Послуги", icon: HiOutlineSquares2X2 },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isClientDetails = pathname.startsWith("/clients/") && pathname !== "/clients";

  if (isClientDetails) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-[var(--tg-theme-bg-color)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-auto flex h-[var(--app-bottom-nav-height,72px)] w-full max-w-5xl items-center justify-between px-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const colorClass = isActive
            ? "text-[#217AF8]"
            : "text-[var(--tg-theme-hint-color)]";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[64px] flex-col items-center gap-1 rounded-2xl px-2 py-1 text-xs font-medium transition-transform duration-150 active:scale-[0.96] ${colorClass}`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
