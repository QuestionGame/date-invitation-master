"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import Envelope from "@/components/Envelope";

const flowers = [
  ["Півонії", "/Fairy_Rose.png"],
  ["Тюльпани", "/Tulip.png"],
  ["Троянди", "/Blue_Jazz.png"],
] as const;

const foods = [
  ["Кава / Матча", "☕"],
  ["Хрусткий круасан", "🥐"],
  ["Смачний десерт / торт", "🍰"],
  ["Піца", "🍕"],
  ["Суші", "🍣"],
  ["", "🍷"],
] as const;

export default function Home() {
  const [step, setStep] = useState<"envelope" | "date" | "flowers" | "food" | "ticket">("envelope");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedFlowers, setSelectedFlowers] = useState<string[]>([]);
  const [customFlower, setCustomFlower] = useState("");
  const [isMastikaRevealed, setIsMastikaRevealed] = useState(false);
  const [crackStage, setCrackStage] = useState(0);
  const [isFlowerSubmitted, setIsFlowerSubmitted] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isTicketDetached, setIsTicketDetached] = useState(false);

  useEffect(() => {
    if (!isFlowerSubmitted) return;
    const timer = window.setTimeout(() => setStep("food"), 900);
    return () => window.clearTimeout(timer);
  }, [isFlowerSubmitted]);

  const toggleFlower = (flower: string) => {
    setSelectedFlowers((current) => current.includes(flower) ? current.filter((item) => item !== flower) : [...current, flower]);
    setCustomFlower("");
  };

  const selectMastika = () => {
    setSelectedFlowers((current) => current.includes("Мастика") ? current.filter((item) => item !== "Мастика") : [...current, "Мастика"]);
    setCustomFlower("");
    setIsMastikaRevealed(true);
  };

  const formatDate = (value: string) => value ? new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`)) : "Не обрано";

  const submitTicket = async () => {
    setIsSubmitting(true);
    const vibe = crackStage > 0 ? "Головне не квіти, а атмосфера" : "Квітковий вайб";
    const payload = {
      access_key: "840489e4-d055-47dd-9002-6d6dfedd1524",
      subject: "Нове побачення: DATE PASS № 0001",
      from_name: "Date Invitation",
      message: JSON.stringify({ date, time: time || "Орієнтовно", flowers: selectedFlowers, menu: selectedFoods, vibe }, null, 2),
      date,
      time: time || "Орієнтовно",
      flowers: selectedFlowers.join(", "),
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
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C3325]">Крок 2 з 3</span>
              <h1 className="mt-2 text-xl font-semibold leading-tight sm:text-2xl">Коли тобі зручно?</h1>
              <p className="mt-2 text-sm leading-relaxed text-[#7A6F68]">Обери день і приблизний час.</p>
              <Image src="/time.jpg" alt="Час для зустрічі" width={56} height={56} sizes="56px" className="absolute right-0 top-0 h-14 w-14 rotate-3 rounded-xl object-cover shadow-sm sm:h-[72px] sm:w-[72px]" />
            </div>
            <form onSubmit={(event) => { event.preventDefault(); if (date) setStep("flowers"); }} className="space-y-4">
              <label className="block min-w-0"><span className="mb-2 block text-sm font-semibold">День</span><input type="date" value={date} min="2026-09-20" onChange={(event) => setDate(event.target.value)} required className="block w-full min-w-0 appearance-none rounded-xl border border-[#D8C8B8] bg-white px-3 py-3 text-base outline-none focus:border-[#8C3325] sm:px-4" /></label>
              <label className="block min-w-0"><span className="mb-2 block text-sm font-semibold">Орієнтовний час</span><input type="time" value={time} onChange={(event) => setTime(event.target.value)} className="block w-full min-w-0 appearance-none rounded-xl border border-[#D8C8B8] bg-white px-3 py-3 text-base outline-none focus:border-[#8C3325] sm:px-4" /></label>
              <p className="rounded-xl bg-[#F5ECE5] px-4 py-3 text-xs leading-relaxed text-[#7A6F68]">Жодних жорстких рамок — орієнтовний час, підлаштуємося.</p>
              <button type="submit" disabled={!date} className="w-full rounded-xl bg-[#8C3325] px-4 py-3.5 text-sm font-semibold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#CDBDB0]">Далі</button>
            </form>
          </motion.section>
        )}

        {step === "flowers" && (
          <motion.section key="flowers-step" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-[390px] rounded-3xl border border-[#D8C8B8] bg-[#FCFAF7] p-5 shadow-xl">
            <div className="mb-5"><span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C3325]">Крок 3 з 3</span><h1 className="mt-2 text-2xl font-semibold leading-tight">За упущений момент треба обрати цветочек.</h1><p className="mt-2 text-sm leading-relaxed text-[#7A6F68]">Обери свій варіант.</p></div>
            {isFlowerSubmitted ? (
                  <div className="rounded-2xl bg-[#F3E7DC] p-5 text-center"><p className="text-lg font-semibold">Я запам&apos;ятав👌</p></div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {flowers.map(([name, image]) => (
                    <button key={name} type="button" onClick={() => toggleFlower(name)} className={`relative rounded-2xl border-2 bg-white p-4 text-left transition active:scale-[0.98] ${selectedFlowers.includes(name) ? "border-[#8C3325] bg-[#FBF2EC]" : "border-[#E5D8CC]"}`}><span className="flex h-[76px] w-full items-center justify-center rounded-lg bg-[#FAF6EE]"><Image src={image} alt={name} width={110} height={76} sizes="110px" loading="lazy" className="h-full w-full object-contain" /></span><span className="mt-2 block text-sm font-semibold">{name}</span>{selectedFlowers.includes(name) && <span className="absolute right-3 top-3 text-lg text-[#8C3325]">✓</span>}</button>
                  ))}
                  <button type="button" onClick={selectMastika} className={`relative rounded-2xl border-2 bg-white p-4 text-left transition active:scale-[0.98] ${selectedFlowers.includes("Мастика") ? "border-[#8C3325] bg-[#FBF2EC]" : "border-[#E5D8CC]"}`}><span className="flex h-[76px] w-full items-center justify-center rounded-lg bg-[#FAF6EE]">{selectedFlowers.includes("Мастика") && isMastikaRevealed ? <Image src="/mastika-mobile.webp" alt="Мастика" width={76} height={76} sizes="76px" loading="lazy" className="h-full w-full rounded-lg object-contain" /> : <span className="text-3xl">🌸</span>}</span><span className="mt-2 block text-sm font-semibold">Мастика</span>{selectedFlowers.includes("Мастика") && <span className="absolute right-3 top-3 text-lg text-[#8C3325]">✓</span>}</button>
                </div>
                <button type="button" disabled={crackStage >= 3} onClick={() => setCrackStage((stage) => Math.min(stage + 1, 3))} className="relative flex min-h-14 w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-[#E5D8CC] bg-white px-4 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-default disabled:opacity-90">
                  <span>{crackStage === 0 ? "Головне не квіти, а атмосфера ✨" : crackStage === 1 ? "Мимо мимо👀" : crackStage === 2 ? "😐🤨" : "Не дело так, я пообіцяв"}</span>
                  {crackStage > 0 && <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 360 56" preserveAspectRatio="none"><path d="M72 0 L92 16 L78 29 L112 56" fill="none" stroke="#8C3325" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  {crackStage > 1 && <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 360 56" preserveAspectRatio="none"><path d="M213 0 L198 19 L222 31 L205 56 M92 16 L119 7 M198 19 L173 10" fill="none" stroke="#8C3325" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  {crackStage > 2 && <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 360 56" preserveAspectRatio="none"><path d="M305 0 L279 14 L295 30 L267 56 M279 14 L252 5" fill="none" stroke="#8C3325" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </button>
                <label className={`block rounded-2xl border-2 p-4 transition ${customFlower ? "border-[#8C3325] bg-[#FBF2EC]" : "border-[#E5D8CC] bg-white"}`}><span className="text-sm font-semibold">Обери сама</span><input type="text" value={customFlower} onChange={(event) => { setCustomFlower(event.target.value); setSelectedFlowers(event.target.value ? [event.target.value] : []); }} placeholder="Напиши свій варіант" className="mt-2 w-full rounded-xl border border-[#D8C8B8] px-3 py-2 text-sm outline-none focus:border-[#8C3325]" /></label>
                <button type="button" disabled={!selectedFlowers.length} onClick={() => setIsFlowerSubmitted(true)} className="w-full rounded-xl bg-[#8C3325] px-4 py-3.5 text-sm font-semibold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#CDBDB0]">Далі</button>
              </div>
            )}
          </motion.section>
        )}

        {step === "food" && (
          <motion.section key="food-step" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-[390px] rounded-3xl border border-[#D8C8B8] bg-[#FCFAF7] p-5 shadow-xl">
            <div className="relative mb-5 pr-24">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C3325]">Крок 4 з 4</span>
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
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-5 text-sm"><div><p className="text-[10px] uppercase tracking-widest text-[#BBA99D]">Дата</p><p className="mt-1 font-semibold">{formatDate(date)}</p></div><div><p className="text-[10px] uppercase tracking-widest text-[#BBA99D]">Час</p><p className="mt-1 font-semibold">{time || "Орієнтовно"}</p></div><div className="col-span-2"><p className="text-[10px] uppercase tracking-widest text-[#BBA99D]">Квіти</p><p className="mt-1 font-semibold">{selectedFlowers.join(" · ")}</p></div><div className="col-span-2"><p className="text-[10px] uppercase tracking-widest text-[#BBA99D]">Меню</p><p className="mt-1 font-semibold">{selectedFoods.join(" · ")}</p></div><div className="col-span-2"><p className="text-[10px] uppercase tracking-widest text-[#BBA99D]">Вайб</p><p className="mt-1 font-semibold">{crackStage > 0 ? "Атмосфера понад усе" : "Квітковий настрій"}</p></div></div>
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
