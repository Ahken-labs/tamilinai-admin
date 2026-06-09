// remove this section once website gets real profile traffic
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type RawOption = string | { value: string; label: string };
type NormOption = { value: string; label: string };
type Group = { heading: string; items: RawOption[] };

function norm(o: RawOption): NormOption {
  return typeof o === "string" ? { value: o, label: o } : o;
}

type Props = {
  value: string;
  onChange: (v: string) => void;
  options?: RawOption[];
  groups?: Group[];
  placeholder?: string;
  clearable?: boolean;
};

export default function SearchableDropdown({
  value,
  onChange,
  options = [],
  groups,
  placeholder = "Select…",
  clearable = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const allOptions = useMemo<NormOption[]>(() => {
    if (groups) return groups.flatMap((g) => g.items.map(norm));
    return options.map(norm);
  }, [options, groups]);

  const selectedLabel = allOptions.find((o) => o.value === value)?.label ?? value;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    return allOptions.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    );
  }, [allOptions, search]);

  const showGroups = !!groups && !filtered;

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

  const rows = filtered ?? allOptions;

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`h-[40px] px-3 rounded-[10px] border bg-[#FAFAFA] text-[14px] outline-none
          transition-colors cursor-pointer flex items-center gap-2 w-full
          ${open ? "border-[#B31B38]" : "border-[#EBEBEB] hover:border-[#CCCCCC]"}`}
      >
        <span
          className={`truncate flex-1 text-left text-[14px] ${
            value ? "text-[#0A0A0A]" : "text-[#BBBBBB]"
          }`}
        >
          {value ? selectedLabel : placeholder}
        </span>

        {clearable && value && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
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
          className="absolute left-0 top-[calc(100%+4px)] z-50 w-full min-w-[200px] rounded-[12px]
            border border-[#EBEBEB] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
        >
          <div className="p-2 border-b border-[#F0F0F0]">
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full px-3 py-1.5 rounded-[8px] bg-[#F5F5F5]
                text-[14px] text-[#222] placeholder:text-[#AAAAAA] outline-none"
            />
          </div>

          <div className="max-h-[220px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {showGroups ? (
              groups!.map((g) => (
                <div key={g.heading}>
                  <p className="px-4 pt-2.5 pb-1 text-[10px] font-semibold tracking-[1.2px] uppercase text-[#CCCCCC]">
                    {g.heading}
                  </p>
                  {g.items.map((raw) => {
                    const o = norm(raw);
                    const selected = o.value === value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => { onChange(o.value); setOpen(false); }}
                        className={`flex w-full items-center px-4 py-2 text-[14px] text-left transition-colors
                          ${selected ? "bg-[#FFF0F3] text-[#B31B38] font-medium" : "text-[#222] hover:bg-[#F5F5F5]"}`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              ))
            ) : rows.length === 0 ? (
              <p className="px-4 py-3 text-[14px] text-center text-[#999]">No results</p>
            ) : (
              rows.map((o) => {
                const selected = o.value === value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => { onChange(o.value); setOpen(false); }}
                    className={`flex w-full items-center px-4 py-2 text-[14px] text-left transition-colors
                      ${selected ? "bg-[#FFF0F3] text-[#B31B38] font-medium" : "text-[#222] hover:bg-[#F5F5F5]"}`}
                  >
                    {o.label}
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
