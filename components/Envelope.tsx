"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface EnvelopeProps {
  onOpenComplete?: () => void;
}

function WaxSealIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22V2" />
      <path d="M12 17c3-1.5 4-4 4-6-2 0-3.5 1-4 2" />
      <path d="M12 13c-3-1.5-4-4-4-6 2 0 3.5 1 4 2" />
      <path d="M12 9c3-1.5 4-4 4-6-2 0-3.5 1-4 2" />
      <path d="M12 5C9 3.5 8 1 8 0c2 0 3.5 1 4 2" />
    </svg>
  );
}

export default function Envelope({ onOpenComplete }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (event?: React.SyntheticEvent) => {
    event?.stopPropagation();
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className="relative w-full min-h-[100dvh] px-2 flex items-center justify-center select-none overflow-hidden">
      {/* КОРПУС КОНВЕРТА */}
      <motion.div
        role="button"
        tabIndex={0}
        animate={{ y: isOpen ? 28 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[390px] aspect-[334/260] rounded-2xl shadow-lg p-[6px] border border-[#D5C6B5]"
        style={{
          background:
            "repeating-linear-gradient(135deg, #DE4D43 0, #DE4D43 11px, #FAF7F2 11px, #FAF7F2 16px, #428094 16px, #428094 27px, #FAF7F2 27px, #FAF7F2 32px)",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* Внутрішній простір конверта */}
        <div className="relative w-full h-full bg-[#E4D5C3] rounded-[10px]">

          {/* 1. ЛИСТ: шар z-10 у закритому стані (схований під клапаном), z-35 при відкритті */}
          <motion.div
            initial={{ y: 0, rotate: 0, opacity: 0 }}
            animate={{
              y: isOpen ? [0, -55, 18] : 0,
              rotate: 0,
              opacity: isOpen ? 1 : 0,
              zIndex: isOpen ? 35 : 10,
            }}
            transition={{
              y: {
                delay: isOpen ? 0.35 : 0,
                duration: 1.25,
                times: [0, 0.42, 1],
                ease: [0.16, 1, 0.3, 1],
              },
              rotate: { delay: isOpen ? 0.45 : 0, duration: 0.6 },
              opacity: { delay: isOpen ? 0.25 : 0, duration: 0.3 },
              zIndex: { delay: isOpen ? 0.95 : 0 },
            }}
            style={{ originX: 0.5, originY: 1, willChange: "transform, opacity" }}
            className={`absolute left-1 right-1 top-2.5 h-[220px] bg-[#FCFAF7] rounded-xl p-4 shadow-md border border-[#E2D7CC] flex flex-col justify-between ${
              isOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <div className="space-y-1 text-left">
              <div className="flex justify-between items-center text-[#8C3325]">
                <span className="text-[9px] font-mono tracking-widest uppercase opacity-80 flex items-center gap-1 font-bold">
                  <Sparkles className="w-3 h-3 text-[#8C3325]" /> Запрошення
                </span>
                <span className="text-[9px] font-mono text-[#8C827A]">№ 01</span>
              </div>

              <h3 className="text-[18px] font-semibold text-[#2E2825] leading-snug">
                Тут подумав, так прикольніше
              </h3>
              <p className="text-[14px] text-[#7A6F68] leading-relaxed">
                Вот такий квест тобі.
              </p>
            </div>

            <Image
              src="/convert.jpg"
              alt="Кумедна реакція"
              width={84}
              height={84}
              className="absolute bottom-[72px] right-3 h-[84px] w-[84px] rotate-3 rounded-xl border-2 border-white object-cover shadow-md"
            />

          </motion.div>

          {/* 2. ПЕРЕДНЯ КИШЕНЯ КОНВЕРТА (шар z-20) */}
          <div className="absolute inset-0 rounded-[10px] overflow-hidden z-20 pointer-events-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 322 212"
              preserveAspectRatio="none"
            >
              <polygon points="0,0 161,112 0,212" fill="#DEC9B3" />
              <polygon points="322,0 161,112 322,212" fill="#D7C2AC" />
              <path
                d="M 0,212 L 322,212 L 169,108 C 165,104 157,104 153,108 Z"
                fill="#E4D3C0"
                stroke="#CCAFA0"
                strokeWidth="0.5"
              />
            </svg>
          </div>

          {/* CTA залишається над кишенею, коли лист частково схований */}
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 8 }}
            transition={{ delay: isOpen ? 1.45 : 0, duration: 0.35 }}
            onClick={(event) => {
              event.stopPropagation();
              onOpenComplete?.();
            }}
            className="absolute left-[24%] right-[24%] top-[178px] z-40 flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-[#8C3325] px-3 py-2 text-xs font-semibold text-white shadow-md active:scale-[0.98] [touch-action:manipulation]"
            style={{ willChange: "transform, opacity" }}
          >
            <span>Поглянути далі</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>

          {/* 3. ПОШТОВА МАРКА ТА ШТЕМПЕЛЬ (шар z-25) */}
          <div className="absolute bottom-3 right-3 z-25 pointer-events-none select-none">
            <div className="relative bg-[#FAF6EE] border border-[#C5B5A1] p-1.5 shadow-xs rounded-[2px] -rotate-2">
              <div className="border border-dashed border-[#8C3325]/50 px-2.5 py-1 flex flex-col items-center justify-center">
                <span className="text-xs">☕</span>
                <span className="text-[6.5px] font-mono font-bold text-[#8C3325] mt-0.5 tracking-tighter">
                  POST 2026
                </span>
              </div>
            </div>

            <div className="absolute -top-2.5 -left-4 -rotate-12 flex items-center gap-1 opacity-40">
              <div className="w-6 h-6 rounded-full border border-dashed border-[#443B35] flex items-center justify-center text-[5px] font-mono text-[#443B35] font-bold">
                AIR
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="w-3.5 h-[1px] bg-[#443B35]" />
                <div className="w-4 h-[1px] bg-[#443B35]" />
              </div>
            </div>
          </div>

          {/* 4. ВЕРХНІЙ ТРИКУТНИЙ КЛАПАН (шар z-30 закритий, z-5 після відкриття) */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={{
              rotateX: isOpen ? 180 : 0,
              zIndex: isOpen ? 5 : 30,
            }}
            transition={{
              rotateX: { duration: 0.65, ease: [0.33, 1, 0.68, 1] },
              zIndex: { delay: isOpen ? 0.2 : 0 },
            }}
            style={{
              originY: 0,
              originX: 0.5,
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              willChange: "transform",
            }}
            className="absolute top-0 left-0 right-0 h-[135px] pointer-events-none"
          >
            {/* Лицьова сторона */}
            <div
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
              className="absolute inset-0 w-full h-full"
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 322 135"
                preserveAspectRatio="none"
              >
                <path
                  d="M 10,0 H 312 Q 322,0 322,10 L 161,135 L 0,10 Q 0,0 10,0 Z"
                  fill="#E4D3C0"
                  stroke="#CCAFA0"
                  strokeWidth="0.5"
                />
              </svg>
            </div>

            {/* Зворотна сторона після відкидання нагору */}
            <div
              style={{
                transform: "rotateX(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              className="absolute inset-0 w-full h-full"
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 322 135"
                preserveAspectRatio="none"
              >
                <path
                  d="M 161,0 L 0,125 Q 0,135 10,135 H 312 Q 322,135 322,125 Z"
                  fill="#EADBCE"
                  stroke="#CCAFA0"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
          </motion.div>

        </div>

        {/* 5. СУРГУЧНА ПЕЧАТКА: НАЙВИЩИЙ ШАР z-[100] ПОВЕРХ ВСІХ ЕЛЕМЕНТІВ */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              key="wax-seal-btn"
              type="button"
              initial={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.25, ease: "easeOut" } }}
              onClick={handleOpen}
              onPointerUp={handleOpen}
              onTouchEnd={handleOpen}
              aria-label="Відкрити конверт"
                className="absolute left-1/2 -translate-x-1/2 top-[53%] -translate-y-1/2 z-[100] w-15 h-15 bg-gradient-to-br from-[#8C3325] via-[#78281C] to-[#591B12] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center cursor-pointer text-[#FAF4EE] border-2 border-[#A14334]/50 active:scale-95 transition-transform [touch-action:manipulation]"
                style={{ willChange: "transform, opacity" }}
            >
              <div className="w-8 h-8 rounded-full border border-[#FAF4EE]/30 flex items-center justify-center bg-black/10 pointer-events-none">
                <WaxSealIcon className="w-4 h-4 text-[#FAF4EE]/90" />
              </div>
              <span className="text-[7.5px] font-mono font-bold tracking-[1px] uppercase mt-0.5 text-[#FAF4EE]/90 pointer-events-none">
                OPEN
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}