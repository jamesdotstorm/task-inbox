import type { Metadata } from "next";
import "./globals.css";
import PasswordGate from "@/components/PasswordGate";

export const metadata: Metadata = {
  title: "Mission Control — Jamie & Torti",
  description: "Harnessing time to exponentially amplify Jamie's productivity — accelerating toward the singularity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PasswordGate>{children}</PasswordGate>
      </body>
    </html>
  );
}
