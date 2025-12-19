import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat UI - Ollama",
  description: "Interfaz de chat para modelos de lenguaje",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
