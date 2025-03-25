import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

export const mulish = Mulish({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mulish.className} antialiased bg-slate-50`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
