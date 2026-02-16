import "@/globals.css";
import { LoginButton } from "@/components/ui/LoginButton";
import { LogoutButton } from "@/components/ui/LogoutButton";
import { getCurrentUser } from "@/actions/authActions";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <header className="flex items-center justify-between px-6 py-4 border-b">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                {user.name || user.email}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <span />
              <LoginButton />
            </>
          )}
        </header>
        {children}
      </body>
    </html>
  );
}