// Start of Selection
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            About Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Where friendship meets flavor
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-left"
          >
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                In December 2024, two college friends, <span className="font-semibold text-foreground">Grish</span> and <span className="font-semibold text-foreground">Aastha</span>, discovered that their shared love for baking could create something magical. What started as whipping up cheesecakes for a small home party quickly became the talk of the town.
              </p>
              <p>
                Their dedication to the craft and genuine joy in feeding others shone through every slice. The appreciation they received that first evening wasn&apos;t just about the taste—it was about the love baked into every bite.
              </p>
              <p>
                Encouraged by the overwhelming response, they took their passion to college events, where their handcrafted creations became the highlight. Two successful events later, they realized this wasn&apos;t just a hobby—it was their calling.
              </p>
              <p>
                Today, LilCheeseCakeCorner stands as a testament to their friendship and unwavering values. Each batch is still lovingly made by hand, just like those first few in their college kitchen. Because for Grish and Aastha, happiness isn&apos;t just an ingredient—it&apos;s the secret recipe that makes every cheesecake special.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/g&A.png"
              alt="Grish and Aastha baking together"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </div>
    </div>
  );

}