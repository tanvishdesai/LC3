"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TestimonialsPage() {
  const testimonials = useQuery(api.testimonials.get);
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Customer Reviews
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our happy customers have to say about our cheesecakes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials?.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image || "https://placehold.co/400x400/f7d1d1/4A2C2A?text=No+Image"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{testimonial.name}</h3>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.round(testimonial.rating) }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">&quot;{testimonial.content}&quot;</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {!testimonials && (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
