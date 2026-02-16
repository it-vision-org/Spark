"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

type User = { name?: string | null; email?: string | null } | null;

export function AppHeader({ user }: { user: User }) {
  const pathname = usePathname();
  if (pathname === "/contact") return null;

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      {user ? (
        <>
          <span className="text-sm text-gray-600">{user.name || user.email}</span>
          <LogoutButton />
        </>
      ) : (
        <>
          <span />
          <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-800">
            Login
          </Link>
        </>
      )}
    </header>
  );
}