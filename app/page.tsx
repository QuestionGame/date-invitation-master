"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import Envelope from "@/components/Envelope";

const plans = [
  ["cinema", "Чи давно ти була в кіно?", "Великий екран, попкорн і обговорення після", "🎬"],
  ["dinner", "Склади компанію на вечерю", "Щось смачне і, звісно, гостре", "🌶️"],
  ["egg", "Не придумав, коротше", "Тисни, якщо смілива", "🤷"],
] as const;

const planLabels: Record<string, string> = {
  cinema: "Кіно 🎬",
  dinner: "Вечеря 🌶️",
  egg: "Сюрприз 🏁 вирішуємо разом на місці",
};

const cars = [
  ["Porsche 911", "🏎️"],
  ["BMW M3", "🚗"],
  ["Mini Cooper", "🚙"],
  ["Ford Mustang", "🐎"],
] as const;

const foods = [
  ["Кава / Матча", "☕"],
  ["Хрусткий круасан", "🥐"],
  ["Смачний десерт / торт", "🍰"],
  ["Піца", "🍕"],
  ["Суші", "🍣"],
  ["Щось гостреньке", "🌶️"],
  ["", "🍷"],
] as const;

export default function Home() {
  const [step, setStep] = useState<"envelope" | "date" | "plan" | "car" | "food" | "ticket">("envelope");
  const [date, setDate] = useState("");
  const [plan, setPlan] = useState("");
  const [speed, setSpeed] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [selectedCar, setSelectedCar] = useState("");
  const [customCar, setCustomCar] = useState("");
  const [crackStage, setCrackStage] = useState(0);
  const [isCarSubmitted, setIsCarSubmitted] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isTicketDetached, setIsTicketDetached] = useState(false);

  const isUnlocked = speed >= 100;
  const canLeavePlan = plan !== "" && (plan !== "egg" || isUnlocked);

  useEffect(() => {
    if (!isCarSubmitted) return;
    const timer = window.setTimeout(() => setStep("food"), 900);
    return () => window.clearTimeout(timer);
  }, [isCarSubmitted]);

  // Пасхалка: педаль газу. Тримаєш — швидкість росте, відпускаєш — падає.
  useEffect(() => {
    if (isUnlocked || (!isHolding && speed === 0)) return;
    const timer = window.setTimeout(() => setSpeed((value) => isHolding ? Math.min(100, value + 2.5) : Math.max(0, value - 3)), 40);
    return () => window.clearTimeout(timer);
  }, [isHolding, speed, isUnlocked]);

  useEffect(() => {
    if (!isUnlocked) return;
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 }, colors: ["#8C3325", "#D8A15D", "#F5ECE5", "#428094"] });
  }, [isUnlocked]);

  const pickCar = (car: string) => {
    setSelectedCar((current) => current === car ? "" : car);
    setCustomCar("");
  };

  const vibeText = crackStage > 0 ? "Головне компанія, а не тачка" : "На повному газу";

  const formatDate = (value: string) => value ? new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`)) : "Не обрано";

  const submitTicket = async () => {
    setIsSubmitting(true);
    const vibe = vibeText;
    const planText = planLabels[plan] ?? plan;
    const payload = {
      access_key: "840489e4-d055-47dd-9002-6d6dfedd1524",
      subject: "Нове побачення: DATE PASS № 0001",
      from_name: "Date Invitation",
      message: JSON.stringify({ date, plan: planText, car: selectedCar, menu: selectedFoods, vibe }, null, 2),
      date,
      plan: planText,
      car: selectedCar,
      menu: selectedFoods.join(", "),
      vibe,
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Submission failed");
      setIsSent(true);
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.65 }, colors: ["#8C3325", "#D8A15D", "#F5ECE5", "#428094"] });
    } catch {
      setIsSent(false);
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
    <main className="min-h-[100dvh] bg-[#EFE8DF] flex items-center justify-center p-4 text-[#2D2622]">
      <AnimatePresence mode="wait" initial={false}>
        {step === "envelope" && (
          <motion.div key="envelope" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18, scale: 0.98 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="w-full">
            <Envelope onOpenComplete={() => setStep("date")} />
          </motion.div>
        )}

        {step === "date" && (
          <motion.section key="date-step" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-[390px] min-w-0 rounded-3xl border border-[#D8C8B8] bg-[#FCFAF7] p-4 shadow-xl sm:p-6">
            <div className="relative mb-6 min-w-0 pr-20 sm:mb-7 sm:pr-24">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C3325]">Крок 2 з 5</span>
              <h1 className="mt-2 text-xl font-semibold leading-tight sm:text-2xl">Коли тобі зручно?</h1>
              <p className="mt-2 text-sm leading-relaxed text-[#7A6F68]">Обери день, а все інше я беру на себе.</p>
              <Image src="/time.jpg" alt="Час для зустрічі" width={56} height={56} sizes="56px" className="absolute right-0 top-0 h-14 w-14 rotate-3 rounded-xl object-cover shadow-sm sm:h-[72px] sm:w-[72px]" />
            </div>
            <form onSubmit={(event) => { event.preventDefault(); if (date) setStep("plan"); }} className="space-y-4">
              <label className="block min-w-0"><span className="mb-2 block text-sm font-semibold">День</span><input type="date" value={date} min="2026-09-20" onChange={(event) => setDate(event.target.value)} required className="block w-full min-w-0 appearance-none rounded-xl border border-[#D8C8B8] bg-white px-3 py-3 text-base outline-none focus:border-[#8C3325] sm:px-4" /></label>
              <p className="rounded-xl bg-[#F5ECE5] px-4 py-3 text-xs leading-relaxed text-[#7A6F68]">Жодних жорстких рамок, підлаштуємося.</p>
              <button type="submit" disabled={!date} className="w-full rounded-xl bg-[#8C3325] px-4 py-3.5 text-sm font-semibold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#CDBDB0]">Далі</button>
            </form>
          </motion.section>
        )}

        {step === "plan" && (
          <motion.section key="plan-step" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-[390px] rounded-3xl border border-[#D8C8B8] bg-[#FCFAF7] p-5 shadow-xl">
            <div className="mb-5"><span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C3325]">Крок 3 з 5</span><h1 className="mt-2 text-2xl font-semibold leading-tight">Оскільки твоя думка важлива, то тобі на вибір:</h1></div>
            <div className="space-y-3">
              {plans.map(([id, title, hint, emoji]) => (
                <button key={id} type="button" onClick={() => setPlan(id)} className={`relative flex w-full items-center gap-3 rounded-2xl border-2 bg-white p-4 text-left transition active:scale-[0.98] ${plan === id ? "border-[#8C3325] bg-[#FBF2EC]" : "border-[#E5D8CC]"}`}>
                  <span className="text-3xl">{emoji}</span>
                  <span className="min-w-0"><span className="block text-sm font-semibold">{title}</span><span className="mt-0.5 block text-xs text-[#7A6F68]">{hint}</span></span>
                  {plan === id && <span className="absolute right-3 top-3 text-lg text-[#8C3325]">✓</span>}
                </button>
              ))}
              {plan === "egg" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border-2 border-dashed border-[#D8A15D] bg-[#FAF6EE] p-4">
                  <p className="text-sm font-semibold">Окей, тоді за кермом сьогодні ти 🏁</p>
                  <p className="mt-1 text-xs text-[#7A6F68]">Тримай педаль газу, поки не розженешся до 100.</p>
                  <div className="relative mt-3 h-16 overflow-hidden rounded-xl bg-[#2D2622]">
                    <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#FAF4EE_0_20px,transparent_20px_40px)] opacity-60" />
                    <div className="absolute right-2 top-2 h-12 w-3 bg-[conic-gradient(#fff_0_25%,#111_0_50%,#fff_0_75%,#111_0)] bg-[length:6px_6px]" />
                    <span className="absolute bottom-1 text-4xl [transform:scaleX(-1)]" style={{ left: `${speed * 0.78}%` }}>🏎️</span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between"><span className="text-xs text-[#7A6F68]">Спідометр</span><span className="text-sm font-semibold"><span className="text-2xl tabular-nums text-[#8C3325]">{Math.round(speed)}</span> км/год</span></div>
                  {isUnlocked ? (
                    <div className="mt-3 rounded-xl bg-[#F3E7DC] p-3 text-sm"><p className="font-semibold">Сюрприз розблоковано! 🏆</p><p className="mt-1 text-[#7A6F68]">Тоді план такий: я заїду, а далі вирішуємо разом на місці. Без сценарію, тільки ти, я і трошки пригод 😉</p></div>
                  ) : (
                    <button type="button" onPointerDown={(event) => { event.preventDefault(); setIsHolding(true); }} onPointerUp={() => setIsHolding(false)} onPointerLeave={() => setIsHolding(false)} onPointerCancel={() => setIsHolding(false)} onContextMenu={(event) => event.preventDefault()} className={`mt-3 w-full select-none rounded-xl px-4 py-4 text-sm font-bold text-white transition [touch-action:none] ${isHolding ? "bg-[#5E2219]" : "bg-[#8C3325]"}`}>Тримай газ 🦶</button>
                  )}
                </motion.div>
              )}
              <button type="button" disabled={!canLeavePlan} onClick={() => setStep("car")} className="w-full rounded-xl bg-[#8C3325] px-4 py-3.5 text-sm font-semibold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#CDBDB0]">Далі</button>
            </div>
          </motion.section>
        )}

        {step === "car" && (
          <motion.section key="car-step" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-[390px] rounded-3xl border border-[#D8C8B8] bg-[#FCFAF7] p-5 shadow-xl">
            <div className="mb-5"><span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C3325]">Крок 4 з 5</span><h1 className="mt-2 text-2xl font-semibold leading-tight">Обери тачку дня 🏎️</h1><p className="mt-2 text-sm leading-relaxed text-[#7A6F68]">На чому сьогодні катаємося? Ну, хоча б у мріях.</p></div>
            {isCarSubmitted ? (
              <div className="rounded-2xl bg-[#F3E7DC] p-5 text-center"><p className="text-lg font-semibold">Я запам&apos;ятав👌</p></div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {cars.map(([name, emoji]) => (
                    <button key={name} type="button" onClick={() => pickCar(name)} className={`relative min-h-24 rounded-2xl border-2 bg-white p-4 text-left transition active:scale-[0.98] ${selectedCar === name ? "border-[#8C3325] bg-[#FBF2EC]" : "border-[#E5D8CC]"}`}><span className="text-3xl">{emoji}</span><span className="mt-2 block text-sm font-semibold">{name}</span>{selectedCar === name && <span className="absolute right-3 top-3 text-lg text-[#8C3325]">✓</span>}</button>
                  ))}
                </div>
                <button type="button" disabled={crackStage >= 3} onClick={() => setCrackStage((stage) => Math.min(stage + 1, 3))} className="relative flex min-h-14 w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-[#E5D8CC] bg-white px-4 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-default disabled:opacity-90">
                  <span>{crackStage === 0 ? "Головне не тачка, а компанія ✨" : crackStage === 1 ? "Мимо мимо👀" : crackStage === 2 ? "😐🤨" : "Ну добре, на таксі теж романтично 🚕"}</span>
                  {crackStage > 0 && <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 360 56" preserveAspectRatio="none"><path d="M72 0 L92 16 L78 29 L112 56" fill="none" stroke="#8C3325" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  {crackStage > 1 && <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 360 56" preserveAspectRatio="none"><path d="M213 0 L198 19 L222 31 L205 56 M92 16 L119 7 M198 19 L173 10" fill="none" stroke="#8C3325" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  {crackStage > 2 && <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 360 56" preserveAspectRatio="none"><path d="M305 0 L279 14 L295 30 L267 56 M279 14 L252 5" fill="none" stroke="#8C3325" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </button>
                <label className={`block rounded-2xl border-2 p-4 transition ${customCar ? "border-[#8C3325] bg-[#FBF2EC]" : "border-[#E5D8CC] bg-white"}`}><span className="text-sm font-semibold">Тачка мрії</span><input type="text" value={customCar} onChange={(event) => { setCustomCar(event.target.value); setSelectedCar(event.target.value); }} placeholder="Напиши свою" className="mt-2 w-full rounded-xl border border-[#D8C8B8] px-3 py-2 text-base outline-none focus:border-[#8C3325]" /></label>
                <button type="button" disabled={!selectedCar && crackStage === 0} onClick={() => setIsCarSubmitted(true)} className="w-full rounded-xl bg-[#8C3325] px-4 py-3.5 text-sm font-semibold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#CDBDB0]">Далі</button>
              </div>
            )}
          </motion.section>
        )}

        {step === "food" && (
          <motion.section key="food-step" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-[390px] rounded-3xl border border-[#D8C8B8] bg-[#FCFAF7] p-5 shadow-xl">
            <div className="relative mb-5 pr-24">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C3325]">Крок 5 з 5</span>
              <h1 className="mt-2 text-2xl font-semibold leading-tight">Голодною я тебе не відпущу</h1>
              <p className="mt-2 text-sm leading-relaxed text-[#7A6F68]">Обери, що будемо куштувати.</p>
              <Image src="/eat-mobile.webp" alt="Щось смачненьке" width={72} height={72} sizes="72px" loading="lazy" className="absolute right-0 top-0 h-[72px] w-[72px] rotate-3 rounded-xl object-cover shadow-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {foods.map(([name, emoji]) => {
                const foodName = name || "Щось смачненьке";
                const isSelected = selectedFoods.includes(foodName);
                return (
                  <button key={foodName} type="button" onClick={() => setSelectedFoods((current) => isSelected ? current.filter((item) => item !== foodName) : [...current, foodName])} className={`relative min-h-24 rounded-2xl border-2 bg-white p-4 text-left transition active:scale-[0.98] ${isSelected ? "border-[#8C3325] bg-[#FBF2EC]" : "border-[#E5D8CC]"}`}>
                    <span className="text-3xl">{emoji}</span>
                    <span className="mt-2 block text-sm font-semibold">{foodName}</span>
                    {isSelected && <span className="absolute right-3 top-3 text-lg text-[#8C3325]">✓</span>}
                  </button>
                );
              })}
            </div>
            <button type="button" disabled={!selectedFoods.length} onClick={() => setStep("ticket")} className="mt-4 w-full rounded-xl bg-[#8C3325] px-4 py-3.5 text-sm font-semibold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#CDBDB0]">Далі</button>
          </motion.section>
        )}

        {step === "ticket" && (
          <motion.section key="ticket-step" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-[720px] text-[#FAF4EE]">
            {isSent ? (
              <div className="rounded-3xl bg-[linear-gradient(135deg,#272321_0%,#191716_55%,#40342D_100%)] px-6 py-16 text-center shadow-2xl"><p className="text-2xl font-semibold">Квиток активовано!</p><p className="mt-3 text-sm text-[#D8C8B8]">Скоро спишемось щодо деталей :)</p></div>
            ) : (
              <div className="flex flex-col overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#292522_0%,#171514_52%,#3B302A_100%)] shadow-2xl sm:flex-row">
                <div className="relative min-w-0 flex-1 p-6 sm:p-7">
                  <motion.div animate={{ x: ["-140%", "180%"] }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.5, ease: "linear" }} className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 skew-x-[-18deg] bg-white/[0.08]" />
                  <div className="flex items-start justify-between border-b border-dashed border-[#BBA99D]/50 pb-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D8A15D]">VIP Ticket</p><h1 className="mt-2 text-2xl font-semibold">DATE PASS</h1></div><div className="text-right text-[10px] text-[#CBBAB0]"><p>№ 0001</p><p className="mt-1">BOARDING</p></div></div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-5 text-sm"><div><p className="text-[10px] uppercase tracking-widest text-[#BBA99D]">Дата</p><p className="mt-1 font-semibold">{formatDate(date)}</p></div><div><p className="text-[10px] uppercase tracking-widest text-[#BBA99D]">План</p><p className="mt-1 font-semibold">{planLabels[plan] ?? "—"}</p></div><div className="col-span-2"><p className="text-[10px] uppercase tracking-widest text-[#BBA99D]">Тачка дня</p><p className="mt-1 font-semibold">{selectedCar || "Таксі теж підійде 🚕"}</p></div><div className="col-span-2"><p className="text-[10px] uppercase tracking-widest text-[#BBA99D]">Меню</p><p className="mt-1 font-semibold">{selectedFoods.join(" · ")}</p></div><div className="col-span-2"><p className="text-[10px] uppercase tracking-widest text-[#BBA99D]">Вайб</p><p className="mt-1 font-semibold">{vibeText}</p></div></div>
                  <div className="flex items-end justify-between border-t border-dashed border-[#BBA99D]/50 pt-4"><div className="flex h-9 items-end gap-1" aria-label="Декоративний штрихкод">{[3, 1, 5, 2, 1, 4, 2, 6, 1, 3, 2, 5, 1, 4, 3, 2, 6, 1].map((height, index) => <span key={index} className="w-1 bg-[#FAF4EE]" style={{ height: `${height * 4 + 5}px` }} />)}</div><span className="text-right text-[10px] tracking-[0.16em] text-[#D8A15D]">DATE PASS<br />• № 0001</span></div>
                </div>
                <motion.button type="button" onClick={detachTicket} disabled={isSubmitting || isTicketDetached} animate={{ x: isTicketDetached ? "110%" : 0, opacity: isTicketDetached ? 0 : 1 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="relative flex min-h-[150px] w-full shrink-0 flex-col items-center justify-center gap-3 border-t border-dashed border-[#D8A15D]/60 bg-[#D8A15D] px-6 py-5 text-center font-bold text-[#272321] sm:min-h-0 sm:w-[190px] sm:border-l sm:border-t-0 [touch-action:manipulation]"><span className="text-xs uppercase tracking-[0.12em]">Підтвердити</span><span className="text-[10px] leading-relaxed">Відірвати<br />та надіслати</span><span className="absolute -left-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-[#EFE8DF] sm:block" /><span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#EFE8DF]" /></motion.button>
              </div>
            )}
            {!isSent && isSubmitting && <p className="mt-3 text-center text-sm text-[#7A6F68]">Надсилаємо квиток...</p>}
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
