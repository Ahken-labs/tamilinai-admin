// remove this section once website gets real profile traffic
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Group = { heading: string; items: string[] };

type Props = {
  value: string[];
  onChange: (v: string[]) => void;
  groups: Group[];
  placeholder?: string;
};

export default function MultiSelectDropdown({
  value,
  onChange,
  groups,
  placeholder = "Select…",
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const allItems = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? allItems.filter((item) => item.toLowerCase().includes(q)) : null;
  }, [allItems, search]);

  const triggerLabel = useMemo(() => {
    if (value.length === 0) return null;
    if (value.length <= 2) return value.join(" · ");
    return `${value.length} interests selected`;
  }, [value]);

  function toggle(item: string) {
    onChange(value.includes(item) ? value.filter((v) => v !== item) : [...value, item]);
  }

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
    else setSearch("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  function renderItem(item: string) {
    const selected = value.includes(item);
    return (
      <button
        key={item}
        type="button"
        onClick={() => toggle(item)}
        className={`flex w-full items-center gap-2.5 px-4 py-2 text-left transition-colors
          ${selected ? "bg-[#FFF0F3]" : "hover:bg-[#F5F5F5]"}`}
      >
        <span
          className={`w-4 h-4 rounded-[4px] border shrink-0 flex items-center justify-center transition-colors
            ${selected ? "bg-[#B31B38] border-[#B31B38]" : "border-[#DDDDDD]"}`}
        >
          {selected && (
            <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
              <path
                d="M2 6l3 3 5-5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span className={`text-[14px] ${selected ? "text-[#B31B38] font-medium" : "text-[#222]"}`}>
          {item}
        </span>
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`min-h-[40px] px-3 py-2 rounded-[12px] border bg-[#F2F2F2] outline-none
          transition-colors cursor-pointer flex items-center gap-2 w-full
          ${open ? "border-[#B31B38]" : "border-[#F2F2F2] hover:border-[#CCCCCC]"}`}
      >
        <span
          className={`truncate flex-1 text-left text-[14px] sm:text-[15px] md:text-[16px] ${
            triggerLabel ? "text-[#0A0A0A]" : "text-[#BBBBBB]"
          }`}
        >
          {triggerLabel ?? placeholder}
        </span>

        {value.length > 0 && (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onChange([]); }}
            className="w-4 h-4 flex items-center justify-center rounded-full
              text-[#BBBBBB] hover:text-[#555] hover:bg-[#EBEBEB] shrink-0 transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
              <path
                d="M1 1L11 11M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}

        <svg
          viewBox="0 0 12 12"
          fill="none"
          className={`w-3 h-3 text-[#AAAAAA] shrink-0 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute left-0 top-[calc(100%+4px)] z-50 w-full min-w-[240px] rounded-[12px]
            border border-[#EBEBEB] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
        >
          <div className="p-2 border-b border-[#F0F0F0]">
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search interests…"
              className="w-full px-3 py-1.5 rounded-[8px] bg-[#F5F5F5]
                text-[14px] text-[#222] placeholder:text-[#AAAAAA] outline-none"
            />
          </div>

          <div className="max-h-[260px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filtered ? (
              filtered.length === 0 ? (
                <p className="px-4 py-3 text-[14px] text-center text-[#999]">No results</p>
              ) : (
                filtered.map(renderItem)
              )
            ) : (
              groups.map((g) => (
                <div key={g.heading}>
                  <p className="px-4 pt-2.5 pb-1 text-[10px] font-semibold tracking-[1.2px] uppercase text-[#CCCCCC]">
                    {g.heading}
                  </p>
                  {g.items.map(renderItem)}
                </div>
              ))
            )}
          </div>

          {value.length > 0 && (
            <div className="border-t border-[#F0F0F0] px-4 py-2 flex items-center justify-between">
              <span className="text-[11px] text-[#AAAAAA]">{value.length} selected</span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-[12px] text-[#B31B38] font-medium hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
// end-removal ────────────────────────────────────────────────────────────────
