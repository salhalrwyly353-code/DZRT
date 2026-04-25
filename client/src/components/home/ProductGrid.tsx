"use client";

import { ArrowLeft, Leaf, Zap, ShieldCheck, ShoppingCart, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cartContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { motion } from "framer-motion";
import type { Product } from "@shared/schema";

const products: (Product & { color: string; accent: string; badge?: string; rating: number; reviews: number })[] = [
  {
    id: 3,
    nameAr: "آيسي راش",
    nameEn: "Icy Rush",
    descriptionAr: "انتعاش النعناع البارد القوي",
    descriptionEn: "Powerful cold mint freshness",
    flavor: "نعناع",
    strength: "١٠ ملغ",
    strengthDots: 3,
    category: "نكهة من أرضنا",
    price: "15.00",
    imageUrl: "/blue_icy_rush_nicotine_pouch_tin.webp",
    inStock: 1,
    createdAt: new Date(),
    color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
    accent: "text-emerald-400",
    badge: "الأكثر مبيعاً",
    rating: 4.9,
    reviews: 312,
  },
  {
    id: 1,
    nameAr: "بيربل ميست",
    nameEn: "Purple Mist",
    descriptionAr: "نكهة التوت الغنية",
    descriptionEn: "Rich berry flavor",
    flavor: "توت مشكل",
    strength: "٦ ملغ",
    strengthDots: 2,
    category: "نكهات الفواكه",
    price: "15.00",
    imageUrl: "/purple_berry_nicotine_pouch_tin.webp",
    inStock: 1,
    createdAt: new Date(),
    color: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
    accent: "text-purple-400",
    rating: 4.8,
    reviews: 198,
  },
  {
    id: 5,
    nameAr: "سي سايد فروست",
    nameEn: "Seaside Frost",
    descriptionAr: "نسيم البحر البارد مع الحمضيات",
    descriptionEn: "Cool sea breeze with citrus",
    flavor: "حمضيات",
    strength: "١٠ ملغ",
    strengthDots: 3,
    category: "نكهة من أرضنا",
    price: "15.00",
    imageUrl: "/CC_FRURT.webp",
    inStock: 1,
    createdAt: new Date(),
    color: "from-orange-500/20 to-orange-500/5 border-orange-500/30",
    accent: "text-orange-400",
    badge: "جديد",
    rating: 4.7,
    reviews: 124,
  },
];

export function ProductGrid() {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    toast({
      title: "تمت الإضافة للسلة",
      description: `تم إضافة ${product.nameAr} إلى سلة التسوق`,
    });
  };

  return (
    <section className="relative py-24 bg-black border-t border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(34,197,94,0.06),transparent_60%)] pointer-events-none" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="text-right">
            <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-3.5 w-3.5" />
              مجموعتنا المختارة
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-3 text-white leading-tight">
              نكهات تليق <span className="text-primary">بذوقك</span>
            </h2>
            <p className="text-white/60 text-base md:text-lg max-w-md">
              اعثر على النكهة والقوة المثالية لك من تشكيلتنا الفاخرة.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="hidden md:flex gap-2 text-white border-white/20 hover:border-primary hover:text-primary hover:bg-primary/5 rounded-full px-6 h-11 font-semibold"
            data-testid="button-view-all"
          >
            <Link href="/products">
              عرض كل المنتجات <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className={`group relative rounded-3xl border bg-gradient-to-br ${product.color} backdrop-blur-sm overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500`}
              data-testid={`card-product-${product.id}`}
            >
              {/* Top badges */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
                {product.badge && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-primary text-white shadow-lg shadow-primary/30">
                    {product.badge}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 backdrop-blur-md text-white border border-white/20">
                  {product.strength}
                </span>
              </div>

              {/* Strength dots indicator */}
              <div className="absolute top-4 left-4 z-10 flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i < product.strengthDots ? "bg-primary shadow-sm shadow-primary/50" : "bg-white/15"
                    }`}
                  />
                ))}
              </div>

              {/* Image */}
              <div className="relative aspect-square flex items-center justify-center p-10 transition-transform duration-700 group-hover:scale-110">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)]" />
                <img
                  src={product.imageUrl}
                  alt={product.nameAr}
                  className="relative w-full h-full object-contain drop-shadow-2xl"
                />
              </div>

              {/* Content */}
              <div className="relative p-6 text-right border-t border-white/10 bg-black/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-xs text-white/60">
                    <span data-testid={`text-reviews-${product.id}`}>({product.reviews})</span>
                    <span className="font-semibold text-white">{product.rating}</span>
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  </div>
                  <span className={`text-xs font-semibold ${product.accent}`}>{product.flavor}</span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold font-heading mb-1 text-white" data-testid={`text-product-name-${product.id}`}>
                  {product.nameAr}
                </h3>
                <p className="text-white/50 text-xs mb-5">{product.descriptionAr}</p>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                  <Button
                    size="sm"
                    className="rounded-full px-5 h-10 font-semibold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all"
                    onClick={() => handleAddToCart(product)}
                    data-testid={`button-add-cart-${product.id}`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    أضف للسلة
                  </Button>
                  <div className="text-right">
                    <span className="text-xs text-white/40 block leading-none">السعر</span>
                    <span className="text-lg font-bold text-white" data-testid={`text-price-${product.id}`}>
                      15.00 ر.س
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button
            asChild
            variant="outline"
            className="w-full rounded-full border-white/20 text-white hover:border-primary hover:text-primary h-12"
          >
            <Link href="/products">عرض جميع المنتجات</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "خالي من التبغ",
      description: "نيكوتين نقي ١٠٠٪ خالي من التبغ لتجربة أنظف.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "جودة عالية",
      description: "مكونات صيدلانية مصنعة وفقاً لأعلى المعايير.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "مفعول فوري",
      description: "مصممة لإطلاق النيكوتين بشكل فوري ومستمر.",
    },
  ];

  return (
    <section className="py-24 bg-secondary/30 border-y border-border/50">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
