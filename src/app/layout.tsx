import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

const theaComputeMono = localFont({
  src: "../../public/fonts/TheaComputeMono.woff2",
  display: "swap",
  variable: "--font-theacompute-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  themeColor: "#fff7f0",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://theacompute.com"),
  title: {
    default: "TheaCompute | Hi, I'm Thea. No gatekeepers, all receipts.",
    template: "%s | TheaCompute",
  },
  description:
    "Hi, I'm Thea. I let you chat with open-weight models like Llama, Qwen, and DeepSeek on GPUs shared by real people. You pay in USDG with nothing but a wallet, I keep every prompt private, and you can audit each job on Robinhood Chain.",
  keywords: [
    "decentralized AI",
    "private AI inference",
    "GPU compute",
    "earn USDG",
    "Robinhood Chain AI",
    "open-weight models",
    "censorship-free AI",
    "Llama",
    "DeepSeek",
    "Qwen",
    "decentralized compute",
    "on-chain AI",
  ],
  authors: [{ name: "TheaCompute", url: "https://theacompute.com" }],
  openGraph: {
    type: "website",
    url: "https://theacompute.com",
    siteName: "TheaCompute",
    title: "TheaCompute | Meet Thea, your AI with receipts",
    description:
      "Hi, I'm Thea. I let you chat with open-weight models like Llama, Qwen, and DeepSeek on GPUs shared by real people. You pay in USDG with nothing but a wallet, I keep every prompt private, and you can audit each job on Robinhood Chain.",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "Thea, the pixel-art girl who runs TheaCompute",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@theacompute",
    title: "TheaCompute | Meet Thea, your AI with receipts",
    description:
      "I'm Thea. I run private, open-weight AI you pay for in USDG, I pay you for the jobs your GPU runs, and I settle everything on Robinhood Chain.",
    images: ["/images/og.png"],
  },
  icons: {
    icon: [{ url: "/images/logo-icon-256.png", type: "image/png" }],
    apple: "/images/apple-icon-180.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${jakarta.variable} ${theaComputeMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
