"use client";

import { useRouter } from "next/navigation";

type Props = {
  className?: string;
};

export function LogoutButton({ className }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={
        className ||
        "text-sm font-semibold text-red-600 transition hover:text-red-700"
      }
    >
      Logout
    </button>
  );
}