// remove this section once website gets real profile traffic
"use client";

import { useEffect, useRef, useState } from "react";
import { COUNTRIES } from "@/constants/countries";

function extractDialCode(entry: string): string {
  const m = entry.match(/\((\+\d+)\)/);
  return m ? m[1] : "+94";
}

function findCountryName(dialCode: string): string {
  const entry = COUNTRIES.find((c) => extractDialCode(c) === dialCode);
  if (!entry) return dialCode;
  return entry.replace(/\s*\(\+\d+\)/, "");
}

type Props = {
  value: string; // just the dial code e.g. "+94"
  onChange: (dialCode: string) => void;
};

export default function CountryCodeDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = search.trim()
    ? COUNTRIES.filter((c) => c.toLowerCase().includes(search.toLowerCase()))
    : COUNTRIES;

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`h-[40px] px-3 rounded-[10px] border bg-[#FAFAFA]
          text-[14px] text-[#0A0A0A] outline-none transition-colors cursor-pointer
          flex items-center justify-between gap-2 w-full
          ${open ? "border-[#B31B38]" : "border-[#EBEBEB] hover:border-[#CCCCCC]"}`}
      >
        <span className="font-medium text-[#B31B38]">{value}</span>
        <span className="text-[12px] text-[#999] truncate flex-1 text-left ml-1.5">
          {findCountryName(value)}
        </span>
        <svg
          viewBox="0 0 12 12"
          fill="none"
          className={`w-3 h-3 text-[#AAAAAA] shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-[260px] rounded-[12px]
          border border-[#EBEBEB] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)]">
          <div className="p-2 border-b border-[#F0F0F0]">
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country…"
              className="w-full px-3 py-1.5 rounded-[8px] bg-[#F5F5F5]
                text-[13px] text-[#222] placeholder:text-[#AAAAAA] outline-none"
            />
          </div>
          <div className="max-h-[220px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-[13px] text-center text-[#999]">No results</p>
            ) : (
              filtered.map((c) => {
                const code = extractDialCode(c);
                const name = c.replace(/\s*\(\+\d+\)/, "");
                const selected = code === value;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { onChange(code); setOpen(false); }}
                    className={`flex w-full items-center justify-between px-4 py-2 text-left transition-colors
                      ${selected ? "bg-[#FFF0F3] text-[#B31B38]" : "text-[#222] hover:bg-[#F5F5F5]"}`}
                  >
                    <span className="text-[13px] truncate mr-2">{name}</span>
                    <span className={`text-[11px] font-semibold shrink-0 ${selected ? "text-[#B31B38]" : "text-[#999]"}`}>
                      {code}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
// end-removal ────────────────────────────────────────────────────────────────
