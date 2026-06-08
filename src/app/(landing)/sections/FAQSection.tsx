"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui";
import { ChevronDownIcon, ExternalArrowIcon } from "@/assets/Icons";
import { FAQS } from "@/data/faq";
import { EMAIL } from "@/data/contacts";

function FAQItem({
  q, a, open, onToggle,
}: {
  q: string; a: string; open: boolean; onToggle: () => void;
}) {
  return (
    <div className="border-b border-[#F0F0F0]">
      <button type="button" onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left py-5
          cursor-pointer group">
        <span className="text-[15px] sm:text-[16px] font-medium text-[#0A0A0A] leading-snug
          group-hover:text-[#B31B38] transition-colors">
          {q}
        </span>
        <span className={`shrink-0 text-[#CCCCCC] group-hover:text-[#B31B38]
          transition-all duration-300 ${open ? "rotate-180 !text-[#B31B38]" : ""}`}>
          <ChevronDownIcon/>
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? 320 : 0 }}
      >
        <p className="text-[14px] sm:text-[15px] text-[#666] leading-[1.8] pb-5">{a}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="max-w-[900px] mx-auto w-full px-6 lg:px-10 py-20">
      <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-20">

        {/* Left — sticky heading */}
        <div className="lg:w-[260px] shrink-0 lg:sticky lg:top-24">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-[28px] sm:text-[30px] font-bold text-[#0A0A0A]
            leading-[1.2] tracking-tight">
            Your questions, answered
          </h2>
          <p className="mt-4 text-[14px] text-[#888] leading-[1.7]">
            Everything you need to know about Inai.lk before you begin your journey.
          </p>
          <a href={`mailto:${EMAIL}`}
            className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold
              text-[#B31B38] hover:underline">
            Ask a question <ExternalArrowIcon/>
          </a>
        </div>

        {/* Right — accordion */}
        <div className="flex-1 min-w-0 border-t border-[#F0F0F0]">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a}
              open={openIndex === i}
              onToggle={() => toggle(i)}/>
          ))}
        </div>
      </div>
    </section>
  );
}
