"use client";

import EtherealBeamsHero from "@/components/ui/ethereal-beams-hero";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { BouncingBalls } from "@/components/ui/bouncing-balls";
import CircularTestimonials from "@/components/ui/circular-testimonials";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const FEATURED_PRODUCTS = [
  {
    name: "Classic New York",
    description: "Rich and creamy traditional cheesecake with a graham cracker crust.",
    price: 45,
    image: "/images/cheesecake.png",
    flavor: "Classic",
  },
  {
    name: "Strawberry Bliss",
    description: "Our classic cheesecake topped with fresh strawberry glaze and berries.",
    price: 50,
    image: "/images/cheesecake.png",
    flavor: "Strawberry",
  },
  {
    name: "Blueberry Dream",
    description: "Swirled with wild blueberry compote and topped with fresh blueberries.",
    price: 52,
    image: "/images/cheesecake.png",
    flavor: "Blueberry",
  },
];

const TESTIMONIALS_DATA = [
  {
    quote:
      "The best cheesecake I've ever had! The texture is perfect and the flavors are incredible. I ordered the Strawberry Bliss for my daughter's birthday and everyone loved it.",
    name: "Sarah Johnson",
    designation: "Happy Customer",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    quote:
      "Ordered the Classic New York for our anniversary. It was absolutely divine! The delivery was prompt and the packaging was beautiful.",
    name: "Mike Chen",
    designation: "Verified Buyer",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    quote:
      "The Chocolate Decadence is to die for! Rich, creamy, and not too sweet. I'm a regular customer now and have tried almost every flavor.",
    name: "Emily Rodriguez",
    designation: "Loyal Customer",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
];

export default function Home() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Theme-aware colors for bouncing balls - violet theme
  const ballColors = mounted && (resolvedTheme === "dark" || theme === "dark")
    ? [
        "rgba(147, 51, 234, 0.8)",  // violet
        "rgba(168, 85, 247, 0.7)",  // lighter violet
        "rgba(192, 132, 252, 0.6)", // light violet
        "rgba(216, 180, 254, 0.5)", // very light violet
        "rgba(124, 58, 237, 0.7)",  // deep violet
        "rgba(139, 92, 246, 0.6)",  // medium violet
      ]
    : [
        "rgba(124, 58, 237, 0.7)",  // deep violet
        "rgba(139, 92, 246, 0.6)",  // medium violet
        "rgba(147, 51, 234, 0.65)", // violet
        "rgba(168, 85, 247, 0.55)", // lighter violet
        "rgba(109, 40, 217, 0.6)",  // darker violet
        "rgba(126, 34, 206, 0.5)",  // purple violet
      ];

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section with Ethereal Beams - Only visible in dark mode */}
      {mounted && (resolvedTheme === "dark" || theme === "dark") && <EtherealBeamsHero />}
      
      {/* Light Mode Hero Section - Only visible in light mode */}
      {mounted && (resolvedTheme === "light" || theme === "light") && (
        <section className="relative z-10 w-full overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-50/30">
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-20">
              <div className="mx-auto max-w-4xl text-center">
                {/* Main Heading */}
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6 text-4xl font-bold tracking-tight text-gray-950 xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl px-2"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.02em',
                    wordBreak: 'break-word',
                    hyphens: 'auto',
                  }}
                >
                  <span className="text-red-600">L</span>il{" "}
                  <span className="text-red-600">C</span>heese<span className="text-red-600">C</span>ake
                  <br />
                  <span className="bg-gradient-to-r from-purple-700 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                    <span className="text-red-600">C</span>orner
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mb-8 sm:mb-10 text-base leading-7 text-gray-700 sm:text-lg sm:leading-8 lg:text-2xl max-w-3xl mx-auto px-4"
                >
                  Handcrafted cheesecakes made with love and the finest ingredients. Every slice is a moment of pure bliss.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4"
                >
                  <Link href="/products">
                    <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto shadow-lg shadow-purple-600/30">
                      Explore Flavors
                    </Button>
                  </Link>
                  <Link href="/order">
                    <Button variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                      Order Now
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Bouncing Balls Background for Content Sections */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BouncingBalls
          numBalls={120}
          colors={ballColors}
          minRadius={1}
          maxRadius={3}
          speed={0.3}
          interactive={true}
          interactionRadius={120}
          interactionScale={3}
        />
      </div>
      
      {/* Lighter Gradient Overlay - allows balls to be visible */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/50 via-background/60 to-background/80 z-[1] pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 flex-1">
        {/* Products Preview */}
        <section className="py-12 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 px-2">Our Signature Flavors</h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Discover our most loved handcrafted cheesecakes, made fresh daily.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {FEATURED_PRODUCTS.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex justify-center"
                >
                  <div className="w-full max-w-sm">
                    <ProductCard {...product} />
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-8 sm:mt-12">
              <Link href="/products">
                <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8">View All Flavors</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 px-2">What Our Customers Say</h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Discover why customers love our handcrafted cheesecakes
              </p>
            </motion.div>

            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CircularTestimonials
                  testimonials={TESTIMONIALS_DATA}
                  autoplay={true}
                  colors={{
                    name: "hsl(var(--foreground))",
                    designation: "hsl(var(--muted-foreground))",
                    testimony: "hsl(var(--foreground))",
                    arrowBackground: "hsl(var(--primary))",
                    arrowForeground: "hsl(var(--primary-foreground))",
                    arrowHoverBackground: "hsl(var(--primary) / 0.8)",
                  }}
                  fontSizes={{
                    name: "1.5rem",
                    designation: "0.925rem",
                    quote: "1rem",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 sm:py-20 bg-card/80 backdrop-blur-sm border-y">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 px-2">Ready to Order?</h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto px-4">
              Have a special request or question? Get in touch with us and we&apos;ll make your cheesecake dreams come true.
            </p>
            <Link href="/contact">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8">Contact Us</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
