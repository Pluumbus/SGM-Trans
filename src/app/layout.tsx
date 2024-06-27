import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SGM-Trans",
  description: "Транспортная компания. Перевоз грузов России и Казахстана.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} min-h-screen bg-background font-sans antialiased`}
        >
          <Providers
            themeProps={{ attribute: "class", defaultTheme: "light", children }}
          >
            <div className="relative flex flex-col h-screen ">
              <header>
                <Navbar />
              </header>
              <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow mb-4">
                {children}
              </main>
            </div>
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
