import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"] 
});

export const metadata: Metadata = {
  title: "Small Quest :)",
  description: "A quick question for you",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className="h-full bg-canvas">
      <body className={`${font.className} h-full select-none antialiased text-espresso`}>
        {children}
      </body>
    </html>
  );
}