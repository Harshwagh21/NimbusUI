import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NimbusCloud",
  description: "Your files have a cloud to ride on.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-[family-name:var(--font-body)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
