import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MemeForge — AI memes that actually land",
  description: "Upload any photo. AI writes six genuinely funny captions. Edit, export, share.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans grain mesh-bg">{children}</body>
    </html>
  );
}
