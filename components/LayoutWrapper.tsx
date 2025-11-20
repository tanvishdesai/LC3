"use client";

import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        enableColorScheme={false}
        disableTransitionOnChange
        storageKey="theme-preference"
      >
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </ThemeProvider>
    </CartProvider>
  );
}

