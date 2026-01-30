import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Presupuestos Biel - Gestión de Presupuestos",
  description: "Crea y gestiona presupuestos de forma fácil e intuitiva.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
