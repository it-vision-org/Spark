import "@/globals.css";
import { LogoutButton } from "@/components/ui/LogoutButton";
import { getCurrentUser } from "@/actions/authActions";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
    const user = await getCurrentUser();

  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        {user && (
          <header className="flex items-center justify-between px-6 py-4 border-b">
            <span className="text-sm text-gray-600">
              {user.name || user.email}
            </span>
            <LogoutButton />
          </header>
        )}
        {children}
        </body>
    </html>
  );
}
