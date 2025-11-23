"use client";

import { ProductCard } from "@/components/ui/product-card-2";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ProductsPage() {
  const products = useQuery(api.products.get);

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif text-primary">
            Our Cheesecakes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our full collection of handcrafted cheesecakes. Each one is made with premium ingredients and lots of love.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products?.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="flex justify-center h-full"
            >
              <div className="w-full max-w-sm h-full">
                <ProductCard
                  name={product.name}
                  tagline={product.description}
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
             <div className="col-span-full text-center py-12">Loading our menu...</div>
          )}
          {products?.length === 0 && (
             <div className="col-span-full text-center py-12">No products available at the moment. Check back soon!</div>
          )}
        </div>
      </div>
    </div>
  );
}
