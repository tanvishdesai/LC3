import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartSafe } from "@/context/CartContext";
import { toast } from "sonner";

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
    const { addToCart } = useCartSafe();

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
            <img
              src={imageUrl || "https://placehold.co/400x400/f7d1d1/4A2C2A?text=No+Image"}
              alt={name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/400x400/f7d1d1/4A2C2A?text=No+Image";
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
          
          <Button 
            className="w-full gap-2 rounded-full" 
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </motion.div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export { ProductCard };
