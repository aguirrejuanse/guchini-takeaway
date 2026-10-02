import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL("https://guchini-takeaway.vercel.app"),
  title: {
    default: "Guchini Takeaway — Pedí online y retirá",
    template: "%s · Guchini Takeaway",
  },
  description:
    "Canal propio de pedidos para Guchini: elegí tu sucursal, pagá con Mercado Pago y retirá sin fila. Demo navegable.",
  keywords: ["guchini", "takeaway", "sanguches", "mendoza", "pedidos online"],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Guchini Takeaway",
    title: "Guchini Takeaway — Pedí online y retirá",
    description:
      "Elegí tu sucursal, pagá online y retirá sin fila. Un manso sanguche, ahora también por web.",
    images: [
      {
        url: "/assets/og.png",
        width: 1200,
        height: 630,
        alt: "Guchini — un manso sanguche",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guchini Takeaway — Pedí online y retirá",
    description:
      "Elegí tu sucursal, pagá online y retirá sin fila. Un manso sanguche, ahora también por web.",
    images: ["/assets/og.png"],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1b7334",
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
