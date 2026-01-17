import { Inter } from "next/font/google";
import "./globals.css"; // <--- YE LINE SABSE ZARURI HAI

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DevSamp Digital Sign",
  description: "Legally binding digital signatures",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}