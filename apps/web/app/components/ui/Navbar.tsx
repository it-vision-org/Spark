"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";

type User = { name?: string | null; email?: string | null } | null;

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Library" },
  { href: "/events", label: "Events" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About Us" },
];

const HIDE_PATHS = [""];

export function AppHeader({ user }: { user: User }) {
  const pathname = usePathname();

  const isAuth = pathname.startsWith("/auth");
  const shouldHide = isAuth || HIDE_PATHS.includes(pathname);
  if (shouldHide) return null;

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-base font-bold">
            S
          </span>
          <div className="leading-tight">
            <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
              Spark
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-full px-3 py-2 text-sm font-medium transition",
                "hover:text-blue-700 hover:bg-blue-50",
                isActive(item.href)
                  ? "text-blue-700 bg-blue-50 border border-blue-100 shadow-xs"
                  : "text-slate-700"
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/meetings"
              className={[
                "rounded-full px-3 py-2 text-sm font-medium transition",
                "hover:text-blue-700 hover:bg-blue-50",
                isActive("/meetings")
                  ? "text-blue-700 bg-blue-50 border border-blue-100 shadow-xs"
                  : "text-slate-700"
              ].join(" ")}
            >
              Meetings
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <span className="size-2 rounded-full bg-emerald-500" />
            EN
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="max-w-[180px] truncate text-sm font-semibold text-slate-800">
                {user.name || user.email}
              </span>
              <LogoutButton className="rounded-full border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:border-red-200 hover:bg-red-100" />
            </div>
          ) : (
            <LoginButton className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300" />
          )}
        </div>
      </div>
    </header>
  );
}