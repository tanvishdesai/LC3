import Link from "next/link";
import { Instagram } from "lucide-react";
import { RetroGrid } from "@/components/ui/retro-grid";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-muted py-12 mt-auto overflow-hidden">
      {/* RetroGrid Background */}
      <RetroGrid />
      
      {/* Footer Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">LilCheeseCakeCorner</h3>
            <p className="text-sm text-muted-foreground">
              Handcrafted cheesecakes made with love and the finest ingredients.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-primary">Products</Link></li>
              <li><Link href="/testimonials" className="hover:text-primary">Testimonials</Link></li>
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Gandhinagar</li>
              <li>Gujarat, India</li>
              <li>makgrish104@gmail.com</li>
              <li>+91 99980 51609</li>
              <li>+91 63532 08421</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <Link href="https://www.instagram.com/lil.cheesecakecorner/" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LilCheeseCakeCorner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
