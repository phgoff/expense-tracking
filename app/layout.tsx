import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter as FontSans, Prompt } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TRPCReactProvider } from "@/trpc/react";
// import Providers from "./providers";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontPrompt = Prompt({
  subsets: ["thai"],
  variable: "--font-prompt",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Expenses Tracking",
  description: "Track your expenses",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          fontSans.variable,
          fontPrompt.variable,
          "h-screen bg-background font-sans antialiased",
        )}
      >
        <TRPCReactProvider>
          <main>{children}</main>
          <ReactQueryDevtools initialIsOpen={false} />
        </TRPCReactProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
