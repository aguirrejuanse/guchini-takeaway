import type { Metadata } from "next";
import { Anton, Caveat, Poppins } from "next/font/google";
import "./globals.css";
import { DemoBar } from "@/components/demo-bar";
import { StoreSync } from "@/components/store-sync";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Guchini Takeaway — Demo",
  description: "Pedí online, pagá con Mercado Pago y retirá por el local.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${anton.variable} ${caveat.variable} ${poppins.variable}`}
    >
      <body className="font-sans antialiased">
        <DemoBar />
        {children}
        <StoreSync />
      </body>
    </html>
  );
}
