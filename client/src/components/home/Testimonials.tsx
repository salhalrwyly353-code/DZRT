"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "محمد العتيبي",
    location: "الرياض",
    rating: 5,
    text: "تجربة رائعة فعلاً، النكهات قوية ومتوازنة. الجودة واضحة من أول استخدام والتوصيل كان سريع جداً.",
    initials: "م",
  },
  {
    name: "سارة الحربي",
    location: "جدة",
    rating: 5,
    text: "أفضل منتج جربته حتى الآن. التغليف أنيق والمذاق طبيعي وغير مزعج. أنصح فيه بشدة.",
    initials: "س",
  },
  {
    name: "فيصل الدوسري",
    location: "الدمام",
    rating: 5,
    text: "ساعدني نظام النقاط على تخفيف اعتمادي على النيكوتين تدريجياً. منتج صادق ويحقق وعوده.",
    initials: "ف",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 bg-black text-white border-t border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.06),transparent_70%)]" />

      <div className="container relative z-10 px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Star className="h-3.5 w-3.5 fill-primary" />
            تقييمات العملاء
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 leading-tight">
            ماذا يقول <span className="text-primary">عملاؤنا</span>
          </h2>
          <p className="text-white/60 text-base md:text-lg">
            آلاف العملاء يثقون بدزرت لتجربة أفضل وأنظف.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm p-7 hover:border-primary/40 transition-all duration-300"
              data-testid={`card-testimonial-${i}`}
            >
              <Quote className="absolute top-5 left-5 h-8 w-8 text-primary/20 group-hover:text-primary/40 transition-colors" />

              <div className="flex gap-1 mb-4 justify-end">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-white/85 leading-relaxed text-right text-base mb-6 min-h-[110px]">
                {t.text}
              </p>

              <div className="flex items-center gap-3 justify-end pt-5 border-t border-white/10">
                <div className="text-right">
                  <p className="font-semibold text-white text-sm" data-testid={`text-testimonial-name-${i}`}>
                    {t.name}
                  </p>
                  <p className="text-white/50 text-xs">{t.location}</p>
                </div>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-bold text-white shrink-0">
                  {t.initials}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Trust stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-8"
        >
          {[
            { value: "+50,000", label: "عميل سعيد" },
            { value: "4.9/5", label: "تقييم العملاء" },
            { value: "+12", label: "نكهة مميزة" },
            { value: "24س", label: "توصيل سريع" },
          ].map((stat, i) => (
            <div key={i} className="text-center" data-testid={`stat-${i}`}>
              <p className="text-2xl md:text-4xl font-bold font-heading text-primary mb-1">
                {stat.value}
              </p>
              <p className="text-white/60 text-xs md:text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
