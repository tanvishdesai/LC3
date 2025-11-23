"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spline from '@splinetool/react-spline';

export default function WarmHero() {
  return (
    <div className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-0 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left order-2 lg:order-1 py-20 lg:py-0 lg:pr-12"
          >
            {/* Decorative Element */}
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="flex items-center gap-2 text-[#4A2C2A]">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium tracking-widest uppercase">Handcrafted with Love</span>
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-[#4A2C2A]">
              <span className="block font-serif italic text-[#8B4513]">Lil CheeseCake</span>
              <span className="block mt-2">Corner</span>
            </h1>

            <p className="text-xl md:text-2xl text-[#4A2C2A]/80 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Where friendship meets flavor. Experience the warmth of home-baked cheesecakes, crafted by two friends with a passion for sharing joy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/products">
                <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-[#4A2C2A] text-background hover:bg-[#4A2C2A]/90 border-none">
                  Explore Our Flavors
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg border-2 border-[#4A2C2A]/20 text-[#4A2C2A] hover:bg-[#4A2C2A]/10 hover:text-[#4A2C2A] transition-all duration-300">
                  Our Story
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[500px] lg:h-[90vh] w-full order-1 lg:order-2 flex items-center justify-center"
          >
             {/* Spline Element */}
             <Spline
              scene="https://prod.spline.design/eebuJnIUoicQIj1q/scene.splinecode" 
              className="w-full h-full"
            />
            
            {/* Overlay Frame - 10px thick from all sides */}
            <div className="absolute inset-0 border-[10px] border-background pointer-events-none z-20 rounded-3xl lg:rounded-none" />
            
            {/* Logo Cover Patch - Hides the 'Built with Spline' logo */}
            <div className="absolute bottom-0 right-0 w-full h-[75px] bg-background z-30 translate-y-4" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
