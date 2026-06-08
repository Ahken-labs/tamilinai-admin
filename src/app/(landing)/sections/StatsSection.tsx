const STATS = [
  { num: "12+",    label: "Countries" },
  { num: "100%",   label: "Sri Lankan Tamil" },
  { num: "Free",   label: "To join" },
  { num: "24 / 7", label: "Support" },
] as const;

export default function StatsSection() {
  return (
    <div className="border-y border-[#F0F0F0] bg-[#FAFAFA]">
      <div className="max-w-[1200px] mx-auto max-[370px]:px-2 px-4 sm:px-6 py-10
        grid grid-cols-2 sm:grid-cols-4 sm:gap-4 gap-8">
        {STATS.map(({ num, label }) => (
          <div key={label} className="flex flex-col items-center text-center">
            <span className="text-[24px] sm:text-[30px] md:text-[36px] font-semibold text-[#0A0A0A] leading-none">
              {num}
            </span>
            <span className="mt-1.5 sm:mt-2 text-[12px] font-medium text-[#AAAAAA] tracking-[1.8px] uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
