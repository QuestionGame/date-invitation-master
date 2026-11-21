"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import Envelope from "@/components/Envelope";

type Step = "envelope" | "intro" | "questions" | "gifts" | "meme" | "ticket";

const ease = [0.22, 1, 0.36, 1] as const;
const stepAnim = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -18 },
  transition: { duration: 0.55, ease },
};

const questions = [
  { id: "cinema", title: "Чи давно була в кіно?", emoji: "🎬", hint: "" },
  { id: "snack", title: "Ну перекусить не проти там👀", emoji: "🍜", hint: "" },
  { id: "egg", title: "Не придумав кароч", emoji: "🤷", hint: "...." },
] as const;

const planLabels: Record<string, string> = {
  cinema: "Кіно 🎬",
  snack: "Перекусити 👀",
  egg: "Імпровізація 🤷",
};

const card = "w-full max-w-[390px] rounded-3xl border border-[#33292C] bg-[#1C1719] p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]";
const eyebrow = "text-[11px] font-bold uppercase tracking-[0.18em] text-[#D8A15D]";
const primaryBtn = "w-full rounded-xl bg-[#B23A48] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(178,58,72,0.7)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#3A3033] disabled:text-[#7D6F70] disabled:shadow-none";

function GiftBox() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="box" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#C8485A" /><stop offset="1" stopColor="#7E2231" /></linearGradient>
        <linearGradient id="rib" x1="0" x2="1"><stop offset="0" stopColor="#F2C98A" /><stop offset="1" stopColor="#C98F45" /></linearGradient>
      </defs>
      <ellipse cx="50" cy="92" rx="34" ry="4" fill="#000" opacity="0.35" />
      <rect x="18" y="44" width="64" height="46" rx="5" fill="url(#box)" />
      <rect x="13" y="34" width="74" height="14" rx="4" fill="#D25467" />
      <rect x="45" y="34" width="10" height="56" fill="url(#rib)" />
      <path d="M50 34 C40 18 26 22 30 30 C33 36 44 35 50 34 Z M50 34 C60 18 74 22 70 30 C67 36 56 35 50 34 Z" fill="url(#rib)" />
      <circle cx="50" cy="33" r="4" fill="#E9B46E" />
      <rect x="22" y="50" width="20" height="3" rx="1.5" fill="#fff" opacity="0.18" />
    </svg>
  );
}

export default function Home() {
  const [step, setStep] = useState<Step>("envelope");
  const [plan, setPlan] = useState("");
  const [opened, setOpened] = useState<[boolean, boolean]>([false, false]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isTicketDetached, setIsTicketDetached] = useState(false);
  const [sendError, setSendError] = useState("");

  const bothOpened = opened[0] && opened[1];

  // Мем спливає, тримається кілька секунд і сам переходить до квитка
  useEffect(() => {
    if (step !== "meme") return;
    const timer = window.setTimeout(() => setStep("ticket"), 3000);
    return () => window.clearTimeout(timer);
  }, [step]);

  const openGift = (index: 0 | 1) => {
    if (opened[index]) return;
    setOpened((current) => (index === 0 ? [true, current[1]] : [current[0], true]));
    confetti({ particleCount: 40, spread: 55, startVelocity: 28, origin: { x: index === 0 ? 0.3 : 0.7, y: 0.5 }, colors: ["#B23A48", "#D8A15D", "#F4ECE6"] });
  };

  const submitTicket = async () => {
    setIsSubmitting(true);
    const planText = planLabels[plan] ?? plan;
    const answeredAt = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" }).format(new Date());
    const choice = questions.find((q) => q.id === plan)?.title ?? "—";
    const message = [
      "Соня пройшла квест і підтвердила квиток 💌",
      "",
      `Обраний варіант: ${choice}`,
      `План: ${planText}`,
      "Подарунки: обидва відкрито 🏎️ 🧴",
      `Коли відповіла: ${answeredAt}`,
    ].join("\n");
    const payload = {
      access_key: "b191fe36-8b51-4f92-b22d-670f8204031b",
      subject: "💌 Соня відповіла на запрошення",
      from_name: "Квест для Сонечки",
      name: "Соня",
      message,
    };

    try {
      setSendError("");
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error(result.message || `HTTP ${response.status}`);
      setIsSent(true);
      confetti({ particleCount: 160, spread: 95, origin: { y: 0.65 }, colors: ["#B23A48", "#D8A15D", "#F4ECE6", "#7E2231"] });
    } catch (error) {
      setIsSent(false);
      setIsTicketDetached(false);
      setSendError(error instanceof Error ? error.message : "Невідома помилка");
    } finally {
      setIsSubmitting(false);
    }
  };

  const detachTicket = () => {
    if (isSubmitting || isTicketDetached) return;
    setIsTicketDetached(true);
    window.setTimeout(submitTicket, 550);
  };

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(120%_80%_at_50%_0%,#2A1E22_0%,#141012_60%)] flex items-center justify-center p-4 text-[#F4ECE6]">
      <AnimatePresence mode="wait" initial={false}>
        {step === "envelope" && (
          <motion.div key="envelope" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18, scale: 0.98 }} transition={{ duration: 0.45, ease }} className="w-full">
            <Envelope onOpenComplete={() => setStep("intro")} />
          </motion.div>
        )}

        {step === "intro" && (
          <motion.section key="intro" {...stepAnim} className="w-full max-w-[390px] px-2 text-center">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease }} className="text-[28px] font-semibold leading-tight [text-wrap:balance]">
              Оскільки мені важливо, що&nbsp;хоче <span className="text-[#D8A15D]">Хуліганка</span>...
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.5 }} className="mt-8">
              <button type="button" onClick={() => setStep("questions")} className={primaryBtn}>Далі</button>
            </motion.div>
          </motion.section>
        )}

        {step === "questions" && (
          <motion.section key="questions" {...stepAnim} className={card}>
            <div className="mb-5"><span className={eyebrow}>Крок 3 з 6</span><h1 className="mt-2 text-2xl font-semibold leading-tight">Пару уточнюючих питань</h1></div>
            <div className="space-y-3">
              {questions.map((q) => {
                const isSelected = plan === q.id;
                return (
                  <button key={q.id} type="button" onClick={() => setPlan(q.id)} className={`relative flex min-h-16 w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition active:scale-[0.98] ${isSelected ? "border-[#B23A48] bg-[#2A1C20]" : "border-[#33292C] bg-[#211B1D]"}`}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#141012] text-xl">{q.emoji}</span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold">{q.title}</span>
                      {q.hint && <span className="mt-0.5 block text-sm text-[#A8999A]">{q.hint}</span>}
                    </span>
                    {isSelected && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-[#D8A15D]">✓</span>}
                  </button>
                );
              })}
              <AnimatePresence>
                {plan === "egg" && (
                  <motion.div key="quote" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease }} className="overflow-hidden">
                    <figure className="relative m-0 mb-1 overflow-hidden rounded-2xl border border-[#D8A15D]/25 bg-[#110D0F] px-5 py-5">
                      <motion.div aria-hidden="true" animate={{ opacity: [0.25, 0.6, 0.25], scale: [1, 1.15, 1] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#D8A15D]/20 blur-3xl" />
                      <motion.div aria-hidden="true" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.2, duration: 0.7, ease }} className="absolute inset-y-3 left-0 w-[3px] origin-top rounded-full bg-[linear-gradient(#F2C98A,#B57B35)]" />
                      <blockquote className="relative m-0 text-[28px] font-semibold italic leading-tight" aria-label="«Позорище»">
                        {Array.from("«Позорище»").map((char, i) => (
                          <motion.span key={i} aria-hidden="true" initial={{ opacity: 0, y: 8, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.45 + i * 0.09, duration: 0.6, ease }} className="inline-block">
                            {char}
                          </motion.span>
                        ))}
                      </blockquote>
                      <motion.figcaption initial={{ opacity: 0, x: -8, letterSpacing: "0.4em" }} animate={{ opacity: 1, x: 0, letterSpacing: "0.05em" }} transition={{ delay: 1.6, duration: 0.9, ease }} className="relative mt-2 text-sm text-[#A8999A]">
                        — Соня
                      </motion.figcaption>
                    </figure>
                  </motion.div>
                )}
              </AnimatePresence>
              <button type="button" disabled={!plan} onClick={() => setStep("gifts")} className={primaryBtn}>Далі</button>
            </div>
          </motion.section>
        )}

        {step === "gifts" && (
          <motion.section key="gifts" {...stepAnim} className={card}>
                        <div className="grid grid-cols-2 gap-3">
              {([0, 1] as const).map((index) => (
                <button key={index} type="button" onClick={() => openGift(index)} aria-label={opened[index] ? (index === 0 ? "Гоночна машинка" : "Парфуми") : `Подарунок ${index + 1}`} className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border-2 p-4 transition active:scale-[0.98] ${opened[index] ? "border-[#D8A15D]/60 bg-[radial-gradient(circle_at_50%_40%,#3A2A2E_0%,#1C1719_70%)]" : "border-[#33292C] bg-[#211B1D]"}`}>
                  {opened[index] ? (
                    <motion.span key="item" initial={{ scale: 0.3, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} className="text-[72px] leading-none">
                      {index === 0 ? "🏎️" : "🧴"}
                    </motion.span>
                  ) : (
                    <motion.div key="box" animate={{ rotate: [0, -4, 4, -2, 0] }} transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.6 + index * 0.4 }} className="h-24 w-24">
                      <GiftBox />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
            <button type="button" disabled={!bothOpened} onClick={() => setStep("meme")} className={`mt-4 ${primaryBtn}`}>Далі</button>
          </motion.section>
        )}

        {step === "meme" && (
          <motion.section key="meme" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="w-full max-w-[390px]">
            <motion.div initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }} animate={{ opacity: [0, 1, 1, 0], scale: [0.92, 1, 1, 1.04], filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"] }} transition={{ duration: 3, times: [0, 0.22, 0.78, 1], ease: "easeInOut" }} className="overflow-hidden rounded-3xl border border-[#33292C] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
              <Image src="/meme.jpg" alt="Мем" width={523} height={382} priority className="h-auto w-full" />
            </motion.div>
          </motion.section>
        )}

        {step === "ticket" && (
          <motion.section key="ticket" {...stepAnim} className="w-full max-w-[720px]">
            {isSent ? (
              <div className="rounded-3xl border border-[#D8A15D]/40 bg-[radial-gradient(circle_at_50%_0%,#3A2A2E_0%,#1C1719_70%)] px-6 py-16 text-center shadow-2xl">
                <p className="text-3xl">✨</p>
                <p className="mt-3 text-2xl font-semibold">Квиток активовано!</p>
                <p className="mt-2 text-sm text-[#C9B9B0]">До зустрічі, Сонечка</p>
              </div>
            ) : (
              <div className="relative flex flex-col overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#7E2231_0%,#3A1820_45%,#1C1214_100%)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] ring-1 ring-[#D8A15D]/40 sm:flex-row">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#D8A15D]/10 blur-2xl" />
                <div className="relative min-w-0 flex-1 p-6 sm:p-7">
                  <motion.div animate={{ x: ["-140%", "320%"] }} transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 2.4, ease: "linear" }} className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 skew-x-[-18deg] bg-white/[0.07]" />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={eyebrow}>Admit two</p>
                      <h1 className="mt-2 bg-[linear-gradient(90deg,#F2C98A,#FFF0D2,#C98F45)] bg-clip-text text-[34px] font-bold leading-none text-transparent">DATE PASS</h1>
                      <p className="mt-2 text-sm text-[#E6D3C8]">для Сонечки</p>
                    </div>
                    <div className="flex h-16 w-16 shrink-0 -rotate-12 flex-col items-center justify-center rounded-full border-2 border-dashed border-[#D8A15D]/70 text-center text-[9px] font-bold leading-tight text-[#D8A15D]">№ 0001<br />VIP</div>
                  </div>
                  <div className="my-5 border-t border-dashed border-[#D8A15D]/35" />
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div><dt className="text-[10px] uppercase tracking-widest text-[#C9A9A0]">Дата</dt><dd className="mt-1 font-semibold">Сьогодні</dd></div>
                    <div><dt className="text-[10px] uppercase tracking-widest text-[#C9A9A0]">План</dt><dd className="mt-1 font-semibold">{planLabels[plan] ?? "—"}</dd></div>
                    <div><dt className="text-[10px] uppercase tracking-widest text-[#C9A9A0]">Подарунки</dt><dd className="mt-1 font-semibold">🏎️ + 🎁 відкрито</dd></div>
                    <div><dt className="text-[10px] uppercase tracking-widest text-[#C9A9A0]">Дрес-код</dt><dd className="mt-1 font-semibold">Як зручно</dd></div>
                  </dl>
                  <div className="mt-5 flex items-end justify-between border-t border-dashed border-[#D8A15D]/35 pt-4">
                    <div className="flex h-9 items-end gap-[3px]" aria-hidden="true">{[3, 1, 5, 2, 1, 4, 2, 6, 1, 3, 2, 5, 1, 4, 3, 2, 6, 1, 3, 5].map((h, i) => <span key={i} className="w-[3px] bg-[#F4ECE6]/85" style={{ height: `${h * 4 + 5}px` }} />)}</div>
                    <span className="text-right text-[10px] tracking-[0.16em] text-[#D8A15D]">CHERKASY<br />2026</span>
                  </div>
                </div>
                <motion.button type="button" onClick={detachTicket} disabled={isSubmitting || isTicketDetached} animate={{ x: isTicketDetached ? "110%" : 0, opacity: isTicketDetached ? 0 : 1 }} transition={{ duration: 0.55, ease }} className="relative flex min-h-[140px] w-full shrink-0 flex-col items-center justify-center gap-2 border-t-2 border-dashed border-[#1C1214]/40 bg-[linear-gradient(135deg,#F2C98A,#D8A15D_50%,#B57B35)] px-6 py-5 text-center font-bold text-[#2A1A1C] sm:min-h-0 sm:w-[190px] sm:border-l-2 sm:border-t-0 [touch-action:manipulation]">
                  <span className="text-sm uppercase tracking-[0.12em]">Підтвердити</span>
                  <span className="text-[11px] font-semibold leading-relaxed opacity-80">Відірвати<br />та надіслати</span>
                  <span className="absolute -left-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-[#141012] sm:block" />
                  <span className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-[#141012] sm:block" />
                  <span className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-[#141012] sm:hidden" />
                </motion.button>
              </div>
            )}
            {!isSent && isSubmitting && <p className="mt-3 text-center text-sm text-[#A8999A]">Надсилаємо квиток...</p>}
            {!isSent && !isSubmitting && sendError && <p className="mt-3 text-center text-sm text-[#E58A96]">Не вдалося надіслати: {sendError}. Спробуй ще раз 🙏</p>}
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
