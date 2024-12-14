import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import React from "react";
import { ConfirmProvider } from "@/tool-kit/hooks/useConfirm/useConfirmContext";
import { AnimationRenderer } from "@/tool-kit/ui/Effects";

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
      <html lang="ru">
        <body
          className={`${inter.className} min-h-screen bg-background font-sans antialiased`}
        >
          <Providers
            themeProps={{ attribute: "class", defaultTheme: "light", children }}
          >
            {/* @ts-ignore */}
            <ConfirmProvider>
              {children}
              <AnimationRenderer />
              <Toaster />
            </ConfirmProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
