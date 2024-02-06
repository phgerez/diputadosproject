import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './components/providers'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gráficos de Cámara de Diputados Argentina",
  description: "Una app para mostrar gráficos realizada con React y Next JS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">
      <body className={inter.className}><Providers>{children}</Providers></body>
    </html>
    
  );
}
