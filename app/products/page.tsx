"use client";

import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

const ALL_PRODUCTS = [
  {
    name: "Classic New York",
    description: "Rich and creamy traditional cheesecake with a graham cracker crust. A timeless favorite.",
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
  {
    name: "Chocolate Decadence",
    description: "Rich chocolate cheesecake with chocolate ganache and chocolate shavings.",
    price: 55,
    image: "/images/cheesecake.png",
    flavor: "Chocolate",
  },
  {
    name: "Lemon Zest",
    description: "Light and tangy lemon cheesecake with a buttery graham cracker base.",
    price: 48,
    image: "/images/cheesecake.png",
    flavor: "Lemon",
  },
  {
    name: "Caramel Pecan",
    description: "Creamy cheesecake topped with caramel sauce and toasted pecans.",
    price: 53,
    image: "/images/cheesecake.png",
    flavor: "Caramel",
  },
  {
    name: "Oreo Cookies & Cream",
    description: "Loaded with Oreo cookies throughout and topped with cookie crumbles.",
    price: 54,
    image: "/images/cheesecake.png",
    flavor: "Oreo",
  },
  {
    name: "Raspberry Swirl",
    description: "Elegant raspberry swirls throughout a vanilla cheesecake base.",
    price: 51,
    image: "/images/cheesecake.png",
    flavor: "Raspberry",
  },
  {
    name: "Pumpkin Spice",
    description: "Seasonal favorite with warm spices and a gingersnap crust.",
    price: 49,
    image: "/images/cheesecake.png",
    flavor: "Pumpkin",
  },
];

export default function ProductsPage() {
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
            Our Cheesecakes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our full collection of handcrafted cheesecakes. Each one is made with premium ingredients and lots of love.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {ALL_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="flex justify-center"
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
