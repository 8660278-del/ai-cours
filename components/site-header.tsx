"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Главная", href: "/" },
  { label: "Программа курса", href: "/course" },
  { label: "Библиотека промптов", href: "/library" },
  { label: "Безопасность", href: "/security" },
  { label: "Полезные материалы", href: "/materials" },
  { label: "Мой прогресс", href: "/progress" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href.startsWith("/course")) {
    return pathname === "/course" || pathname.startsWith("/course/");
  }

  if (href === "/progress") {
    return pathname === "/progress";
  }

  if (href === "/library") {
    return pathname === "/library" || pathname.startsWith("/library/");
  }

  if (href === "/security") {
    return pathname === "/security";
  }

  if (href === "/materials") {
    return pathname === "/materials" || pathname.startsWith("/materials/");
  }

  return false;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0c0c0d] text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 md:h-16 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="ГК ПИР — на главную"
        >
          <span
            className="h-5 w-1 rounded-full bg-[#f36f21]"
            aria-hidden="true"
          />
          <span className="text-base font-bold uppercase tracking-[0.16em] sm:text-lg">
            ГК ПИР
          </span>
        </Link>

        <nav
          aria-label="Основная навигация"
          className="hidden items-center gap-1 lg:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                isActivePath(pathname, item.href)
                  ? "font-medium text-[#f36f21]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Мобильная навигация"
          className="border-t border-white/10 lg:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-3 text-sm transition-colors",
                  isActivePath(pathname, item.href)
                    ? "font-medium text-[#f36f21]"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
