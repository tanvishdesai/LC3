import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { LayoutWrapper } from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LilCheeseCakeCorner",
  description: "Premium handcrafted cheesecakes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of light theme on page load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme-preference');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {
                // Fallback to dark mode if localStorage fails
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ConvexClientProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
