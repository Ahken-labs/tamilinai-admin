const STATS = [
  { num: "12+",    label: "Countries" },
  { num: "100%",   label: "Sri Lankan Tamil" },
  { num: "Free",   label: "To join" },
  { num: "24 / 7", label: "Support" },
] as const;

export default function StatsSection() {
  return (
    <div className="border-y border-[#F0F0F0] bg-[#FAFAFA]">
      <div className="max-w-[900px] mx-auto px-6 lg:px-10 py-10
        grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map(({ num, label }) => (
          <div key={label} className="flex flex-col items-center text-center">
            <span className="text-[36px] sm:text-[44px] font-bold text-[#0A0A0A] leading-none">
              {num}
            </span>
            <span className="mt-1.5 text-[11px] font-semibold text-[#AAAAAA] tracking-[1.8px] uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
