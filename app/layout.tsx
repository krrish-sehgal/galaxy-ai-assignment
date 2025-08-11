import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "ChatGPT Clone",
  description: "A pixel-perfect ChatGPT clone built with Next.js and AI SDK",
  generator: "v0.dev",
  icons: {
    icon: "/open-ai-logo.png",
    shortcut: "/open-ai-logo.png",
    apple: "/open-ai-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
