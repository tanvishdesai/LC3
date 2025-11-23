"use client";

import WarmHero from "@/components/ui/warm-hero";
import { ProductCard } from "@/components/ui/product-card-2";
import { Button } from "@/components/ui/button";
import CircularTestimonials from "@/components/ui/circular-testimonials";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

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
  const products = useQuery(api.products.get);
  const featuredProducts = products?.slice(0, 3) || [];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <WarmHero />
      
      {/* Content */}
      <div className="relative z-10 flex-1">
        {/* Products Preview */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 font-serif text-primary">Our Signature Flavors</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our most loved handcrafted cheesecakes, made fresh daily.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex justify-center h-full"
                >
                  <div className="w-full max-w-sm h-full">
                    <ProductCard
                      name={product.name}
                      tagline={product.description} // Using description as tagline for now
                      price={product.price}
                      imageUrl={product.image}
                      originalPrice={product.originalPrice}
                      offerText={product.offerText}
                      description={product.description}
                      flavor={product.flavor}
                    />
                  </div>
                </motion.div>
              ))}
              {products === undefined && (
                 // Loading skeleton or placeholder could go here
                 <div className="col-span-full text-center py-12">Loading deliciousness...</div>
              )}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/products">
                <Button size="lg" className="text-lg px-8 rounded-full">View All Flavors</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 font-serif text-primary">What Our Customers Say</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover why customers love our handcrafted cheesecakes
              </p>
            </motion.div>

            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
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
        <section className="py-20 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6 font-serif text-primary">Ready to Order?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have a special request or question? Get in touch with us and we&apos;ll make your cheesecake dreams come true.
            </p>
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8 rounded-full">Contact Us</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
