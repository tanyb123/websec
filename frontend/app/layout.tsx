import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Management System",
  description: "Quản lý sinh viên với OAuth2 & Keycloak",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
