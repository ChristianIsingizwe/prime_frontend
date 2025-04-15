import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import AuthGate from "./components/AuthGate";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthGate>{children}</AuthGate>
        </Providers>
      </body>
    </html>
  );
}
