import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCartSafe } from "@/context/CartContext";
import { toast } from "sonner";
import { useMemo } from "react";

// Interface for the component's props for type-safety and clarity
export interface ProductCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  imageUrl: string;
  name: string;
  tagline: string;
  price: number;
  currency?: string;
  isCouponPrice?: boolean;
  originalPrice?: number;
  offerText?: string;
  description?: string;
  flavor?: string;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      className,
      imageUrl,
      name,
      tagline,
      price,
      currency = "₹",
      isCouponPrice = false,
      originalPrice,
      offerText,
      description,
      flavor,
      ...props
    },
    ref
  ) => {
    const { addToCart, updateQuantity, cartItems } = useCartSafe();

    // Find the quantity of this product in the cart
    const quantity = useMemo(() => {
      const item = cartItems.find((item) => item.name === name);
      return item?.quantity || 0;
    }, [cartItems, name]);

    // Price formatter for consistent currency display
    const formatPrice = (amount: number) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
      })
        .format(amount)
        .replace("₹", `${currency}`);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent triggering parent click events if any
      addToCart({
        name,
        description: description || tagline,
        price,
        image: imageUrl,
        flavor: flavor || "Original",
      });
      toast.success(`Added ${name} to cart!`);
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-xl border bg-card p-6 text-center text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-md",
          className
        )}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        {...props}
      >
        <div className="flex w-full flex-col items-center">
          {/* Product Image */}
          <div className="relative mb-4 flex h-40 w-full items-center justify-center">
            <Image
              src={imageUrl || "https://placehold.co/400x400/f7d1d1/4A2C2A?text=No+Image"}
              alt={name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              onError={() => {
                // Note: onError on next/image is different, but for now we'll keep the logic simple or remove it if not supported directly the same way.
                // Next.js Image onError is supported.
                // However, modifying src directly on the SyntheticEvent target might not work as expected with Next.js Image optimization.
                // For now, let's just use the fallback in src.
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{tagline}</p>
          </div>
        </div>

        {/* Pricing and Actions */}
        <div className="mt-4 flex w-full flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">{formatPrice(price)}</span>
              {isCouponPrice && (
                <span className="text-xs font-medium text-primary">
                  Coupon Price
                </span>
              )}
            </div>
            {(originalPrice || offerText) && (
              <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                {originalPrice && (
                  <span className="text-muted-foreground line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                {offerText && (
                  <span className="font-semibold text-yellow-600 dark:text-yellow-500">
                    {offerText}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {quantity === 0 ? (
            <Button 
              className="w-full gap-2 rounded-full" 
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between w-full gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (quantity > 0) updateQuantity(name, quantity - 1);
                }}
                className="flex-1 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">
                <span className="font-semibold text-lg">{quantity}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(name, quantity + 1);
                }}
                className="flex-1 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export { ProductCard };
