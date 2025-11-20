"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useCartSafe } from "@/context/CartContext";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useState, useMemo } from "react";

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  image: string;
  flavor: string;
}

export default function ProductCard({ name, description, price, image, flavor }: ProductCardProps) {
  const { addToCart, updateQuantity, cartItems } = useCartSafe();
  const [isAdded, setIsAdded] = useState(false);

  // Find the quantity of this product in the cart
  const quantity = useMemo(() => {
    const item = cartItems.find((item) => item.name === name);
    return item?.quantity || 0;
  }, [cartItems, name]);

  const handleAddToCart = () => {
    addToCart({ name, description, price, image, flavor });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleIncrement = () => {
    updateQuantity(name, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      updateQuantity(name, quantity - 1);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group max-w-sm">
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-2 right-2 bg-primary/90 text-primary-foreground hover:bg-primary">
          {flavor}
        </Badge>
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-start text-lg">
          <span className="font-bold">{name}</span>
          <span className="text-base font-semibold text-primary">${price.toFixed(2)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        {quantity === 0 ? (
          <Button 
            className="w-full" 
            size="sm"
            onClick={handleAddToCart}
            variant={isAdded ? "outline" : "default"}
          >
            {isAdded ? (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrement}
              className="flex-1"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
              <span className="font-semibold text-lg">{quantity}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleIncrement}
              className="flex-1"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
