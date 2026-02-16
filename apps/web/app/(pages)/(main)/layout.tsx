import "@/globals.css";
import { Toaster } from "react-hot-toast";
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
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              padding: "14px 20px",
              fontSize: "0.9rem",
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
            },
          }}
        />
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