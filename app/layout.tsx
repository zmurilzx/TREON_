import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TREON - Plataforma Profissional de Apostas",
    description: "Calculadoras, métodos e ferramentas profissionais para apostadores",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                <Providers>
                    {children}
                    <Toaster position="top-right" richColors />
                </Providers>
            </body>
        </html>
    );
}
