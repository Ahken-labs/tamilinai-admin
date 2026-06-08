"use client";

import { InaiMarkIcon, ArrowRightIcon } from "@/assets/Icons";
import { SITE } from "@/data/contacts";

export default function HeroSection({ onOpenLogin }: { onOpenLogin: () => void }) {
  return (
    <section
      className="relative flex flex-col items-center justify-center
        max-[370px]:px-2 px-4 sm:px-6 py-15 sm:py-17 md:py-20 text-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(179,27,56,0.07) 0%, transparent 70%)",
      }}
    >
      {/* Logo — single click opens login (hidden trigger) */}
      <button
        type="button"
        onClick={onOpenLogin}
        className="fade-up group relative mb-8 cursor-pointer"
        title=" "
      >
        <div
          className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]
            rounded-[32px] pb-0.5 pr-1 sm:rounded-[38px] bg-[#B31B38] text-white flex items-center justify-center
            shadow-[0_16px_64px_rgba(179,27,56,0.35)]
            group-hover:shadow-[0_20px_80px_rgba(179,27,56,0.45)]
            group-active:scale-95 transition-all duration-300">
          <InaiMarkIcon size={58}/>
        </div>
        <div
          className="absolute inset-0 rounded-[32px] sm:rounded-[38px] ring-2 ring-[#B31B38]/0
            group-hover:ring-[#B31B38]/20 group-hover:scale-110
            transition-all duration-300 pointer-events-none"
        />
      </button>

      <h1 className="fade-up-d1 font-tamil font-bold text-[#222222] leading-none tracking-tight
        text-[34px] sm:text-[44px] md:text-[54px]">
        இணை.lk
      </h1>

      <p className="fade-up-d2 mt-3 md:mt-4 text-[14px] sm:text-[16px] md:text-[18px] font-semibold
        tracking-[3px] uppercase text-[#B31B38]">
        Sri Lankan Tamil Matrimony
      </p>

      <p className="fade-up-d3 mt-6 max-w-[560px] text-[14px] sm:text-[16px] font-light
        text-[#6B6B6B] leading-[1.8]">
        Connecting Sri Lankan Tamil families across the world with privacy, culture, and the
        values that matter most — wherever you are.
      </p>

      <div className="fade-up-d4 mt-8 flex items-center max-[370px]:gap-2 gap-3 flex-wrap justify-center">
        <a
          href={SITE}
          className="inline-flex items-center gap-2 bg-[#B31B38] text-white font-semibold
            text-[14px] sm:text-[15px] md:text-[16px] px-7 py-3.5 rounded-[14px] hover:bg-[#9A1730]
            transition-colors shadow-[0_4px_20px_rgba(179,27,56,0.32)]"
        >
          Visit Inai.lk <ArrowRightIcon/>
        </a>
        <a
          href={`${SITE}/login`}
          className="inline-flex items-center gap-2 border border-[#E8E8E8] text-[#0A0A0A]
            font-medium text-[14px] sm:text-[15px] md:text-[16px] px-7 py-3.5 rounded-[14px]
            hover:bg-[#F8F8F8] hover:border-[#DDD] transition-all"
        >
          Sign in to Inai
        </a>
      </div>
    </section>
  );
}
