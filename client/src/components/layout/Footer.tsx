import { Link } from "wouter";
import { Instagram, Twitter, Facebook, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "بريد غير صالح",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "تم الاشتراك بنجاح",
      description: "ستصلك أحدث العروض والمنتجات على بريدك",
    });
    setEmail("");
  };

  return (
    <footer className="relative bg-black text-white pt-20 pb-10 border-t border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.08),transparent_70%)] pointer-events-none" />

      <div className="container px-4 mx-auto relative z-10">
        {/* Newsletter section */}
        <div className="mb-16 rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 via-white/5 to-transparent backdrop-blur-sm p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-right">
              <h3 className="text-2xl md:text-3xl font-bold font-heading mb-3">
                انضم إلى عائلة <span className="text-primary">دزرت</span>
              </h3>
              <p className="text-white/60 text-sm md:text-base leading-relaxed">
                اشترك في نشرتنا البريدية للحصول على عروض حصرية وآخر المستجدات.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 pr-11 text-right rounded-xl"
                  data-testid="input-newsletter-email"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 rounded-xl px-6 font-semibold gap-2 shadow-lg shadow-primary/20"
                data-testid="button-newsletter-subscribe"
              >
                <Send className="h-4 w-4" />
                اشترك
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12 text-right">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-3xl font-bold font-heading tracking-tighter mb-4 inline-block hover:text-primary transition-colors"
              data-testid="link-footer-logo"
            >
              دزرت
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              أكياس نيكوتين فاخرة مصممة لنمط الحياة العصري. خالية من التبغ، خالية من الدخان.
            </p>
            <div className="flex gap-3 justify-end">
              {[
                { Icon: Instagram, label: "instagram" },
                { Icon: Twitter, label: "twitter" },
                { Icon: Facebook, label: "facebook" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/15 hover:border-primary hover:bg-primary/10 hover:text-primary flex items-center justify-center text-white/70 transition-all"
                  data-testid={`link-social-${label}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-5 text-sm uppercase tracking-wider text-white/40">
              التسوق
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link href="/products" className="hover:text-primary transition-colors" data-testid="link-footer-products">
                  جميع المنتجات
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors" data-testid="link-footer-mint">
                  نعناع
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors" data-testid="link-footer-fruit">
                  فواكه
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors" data-testid="link-footer-bundles">
                  الباقات
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-5 text-sm uppercase tracking-wider text-white/40">
              الشركة
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link href="/" className="hover:text-primary transition-colors" data-testid="link-footer-about">
                  قصتنا
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors" data-testid="link-footer-blog">
                  المدونة
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors" data-testid="link-footer-contact">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-5 text-sm uppercase tracking-wider text-white/40">
              قانوني
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link href="/" className="hover:text-primary transition-colors" data-testid="link-footer-privacy">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors" data-testid="link-footer-terms">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors" data-testid="link-footer-shipping">
                  سياسة الشحن
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 text-center md:text-right">
          <p>&copy; ٢٠٢٦ دزرت. جميع الحقوق محفوظة.</p>
          <p className="max-w-2xl">
            تحذير: هذا المنتج يحتوي على النيكوتين. النيكوتين مادة كيميائية تسبب الإدمان. للبالغين 18+ فقط.
          </p>
        </div>
      </div>
    </footer>
  );
}
