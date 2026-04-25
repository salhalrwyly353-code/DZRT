"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HelpCircle, ShoppingCart, Check } from "lucide-react";
import { useState, useEffect } from "react";

export interface StrengthOption {
  mg: number;
  label: string;
  dots: number;
}

const STRENGTHS: StrengthOption[] = [
  { mg: 6, label: "متوسط", dots: 3 },
  { mg: 3, label: "خفيف", dots: 2 },
  { mg: 0, label: "زيرو", dots: 0 },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  productImage?: string;
  onConfirm: (strength: StrengthOption) => void;
}

export function StrengthSelectDialog({ open, onOpenChange, productName, productImage, onConfirm }: Props) {
  const [selected, setSelected] = useState<number>(6);

  useEffect(() => {
    if (open) setSelected(6);
  }, [open]);

  function handleConfirm() {
    const opt = STRENGTHS.find((s) => s.mg === selected) ?? STRENGTHS[0];
    onConfirm(opt);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="max-w-md p-0 gap-0 overflow-hidden border-white/10 bg-[#0e1621] text-white"
      >
        <DialogHeader className="px-6 pt-6 pb-2 text-right">
          <DialogTitle className="text-lg sm:text-xl font-bold text-white text-right" data-testid="text-strength-title">
            حدد قوة النيكوتين
          </DialogTitle>
          {productName && (
            <p className="text-sm text-white/55 mt-1">{productName}</p>
          )}
        </DialogHeader>

        {productImage && (
          <div className="px-6 pb-2 flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-center">
              <img src={productImage} alt="" className="w-full h-full object-contain" />
            </div>
          </div>
        )}

        <div className="px-6 pb-2 grid grid-cols-3 gap-3 mt-2">
          {STRENGTHS.map((s) => {
            const active = selected === s.mg;
            return (
              <button
                key={s.mg}
                type="button"
                onClick={() => setSelected(s.mg)}
                className={cn(
                  "relative rounded-2xl border-2 p-3 sm:p-4 flex flex-col items-center justify-center gap-1.5 transition-all text-center",
                  active
                    ? "border-primary bg-primary/15 shadow-md shadow-primary/20"
                    : "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"
                )}
                data-testid={`button-strength-${s.mg}`}
                aria-pressed={active}
              >
                {active && (
                  <span className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </span>
                )}
                <span className="text-base sm:text-lg font-extrabold text-white leading-none">
                  {s.mg} ملغ
                </span>
                <span className="text-xs text-white/65 font-medium">{s.label}</span>
                <div className="flex items-center gap-1 mt-1.5">
                  {[...Array(3)].map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        i < s.dots ? "bg-primary" : "bg-white/20"
                      )}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="mx-6 my-3 text-xs text-primary/90 hover:text-primary inline-flex items-center gap-1.5 underline-offset-4 hover:underline self-start"
          data-testid="link-help"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          كيف اختار قوة النيكوتين المناسبة لي؟
        </button>

        <div className="px-6 pb-6 pt-2 border-t border-white/10 bg-black/20">
          <Button
            onClick={handleConfirm}
            className="w-full h-12 rounded-xl gap-2 font-semibold text-base"
            data-testid="button-confirm-strength"
          >
            <ShoppingCart className="h-4 w-4" />
            أضف للسلة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
