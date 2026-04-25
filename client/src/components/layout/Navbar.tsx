import { Link } from "wouter";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cartContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "الرئيسية", testId: "link-home" },
    { href: "/products", label: "المنتجات", testId: "link-products" },
    { href: "/", label: "قصتنا", testId: "link-about" },
    { href: "/", label: "الدعم", testId: "link-support" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-black/80 backdrop-blur-xl py-2 border-b border-white/10 shadow-lg shadow-black/30"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="فتح القائمة"
                className="text-white hover:bg-white/10 rounded-full border border-white/20 md:hidden"
                data-testid="button-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-white/10 text-white w-[300px]">
              <div className="flex items-center justify-between mb-10">
                <span className="text-2xl font-bold font-heading">دزرت</span>
              </div>
              <nav className="flex flex-col gap-2 text-right">
                {navLinks.map((link) => (
                  <Link
                    key={link.testId}
                    href={link.href}
                    className="text-lg font-medium px-4 py-3 rounded-xl hover:bg-white/5 hover:text-primary transition-colors"
                    data-testid={`mobile-${link.testId}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 pt-6 border-t border-white/10">
                <Button
                  asChild
                  className="w-full h-12 rounded-xl font-semibold gap-2"
                  data-testid="mobile-button-checkout"
                >
                  <Link href="/checkout">
                    <ShoppingBag className="h-4 w-4" />
                    الذهاب للسلة
                    {itemCount > 0 && (
                      <span className="bg-white text-primary text-xs font-bold rounded-full px-2 py-0.5">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1">
            {navLinks.map((link) => (
              <Link
                key={link.testId}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all"
                data-testid={link.testId}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label={`عرض السلة${itemCount > 0 ? ` (${itemCount})` : ""}`}
            className="text-white hover:bg-primary/20 hover:text-primary rounded-full border border-white/20 relative ml-1"
            data-testid="button-cart"
          >
            <Link href="/checkout">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-primary rounded-full text-[10px] font-bold flex items-center justify-center text-white shadow-lg shadow-primary/40"
                  data-testid="text-cart-count"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </Button>
        </div>

        <Link href="/">
          <span
            className="text-3xl font-bold font-heading tracking-tighter text-white cursor-pointer hover:text-primary transition-colors"
            data-testid="link-logo"
          >
            دزرت
          </span>
        </Link>
      </div>
    </nav>
  );
}
