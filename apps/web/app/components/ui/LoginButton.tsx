import Link from "next/link";

export function LoginButton() {
  return (
    <Link
      href="/auth/login"
      className="text-sm text-blue-600 hover:text-blue-800"
    >
      Login
    </Link>
  );
}