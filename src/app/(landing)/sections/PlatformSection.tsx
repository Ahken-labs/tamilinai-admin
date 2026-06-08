import { SectionLabel } from "@/components/ui";
import { InaiMarkIcon, ForwardArrowIcon } from "@/assets/Icons";
import { SITE } from "@/data/contacts";

const STEPS = [
  {
    n:     "01",
    title: "Create Profile",
    desc:  "Add your details and photos. Our team verifies every profile manually.",
  },
  {
    n:     "02",
    title: "Set Preferences",
    desc:  "Tell us what matters — background, values, location, profession.",
  },
  {
    n:     "03",
    title: "Find Your Match",
    desc:  "Browse verified profiles with full photo and data privacy protection.",
  },
  {
    n:     "04",
    title: "Involve Family",
    desc:  "Share profiles with your parents and get their blessings together.",
  },
] as const;

const TAGS = ["Verified Profiles", "Privacy First", "Family Friendly", "Free"] as const;

export default function PlatformSection() {
  return (
    <section className="max-w-[1200px] mx-auto w-full max-[370px]:px-2 px-4 sm:px-6 py-15 sm:py-17 md:py-20 space-y-14">

      {/* Main platform card */}
      <div>
        <SectionLabel>Our Platform</SectionLabel>
        <a
          href={SITE}
          className="group relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center
            gap-6 sm:gap-8 bg-white border border-[#EBEBEB] rounded-[24px] p-4 sm:p-6 lg:p-10
            hover:border-[#F0C8D0] hover:shadow-[0_16px_60px_rgba(179,27,56,0.10)]
            transition-all duration-300"
        >
          {/* Decoration blob */}
          <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full
            bg-[#B31B38]/4 group-hover:bg-[#B31B38]/8 transition-colors duration-500 pointer-events-none"/>

          {/* Logo */}
          <div className="relative w-[72px] h-[72px] lg:w-[80px] lg:h-[80px] rounded-[22px]
            bg-[#B31B38] text-white flex items-center justify-center shrink-0
            shadow-[0_8px_28px_rgba(179,27,56,0.28)]
            group-hover:shadow-[0_12px_40px_rgba(179,27,56,0.36)] transition-shadow">
            <InaiMarkIcon size={40}/>
          </div>

          {/* Copy */}
          <div className="relative flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[20px] sm:text-[22px] font-bold text-[#0A0A0A]">Inai.lk</span>
              <span className="text-[10px] sm:text-[12px] md:text-[14px] font-bold tracking-[1.5px] uppercase text-[#B31B38]
                bg-[#FFF0F3] border border-[#FFD5DF] px-2.5 py-1 rounded-full">Live</span>
            </div>
            <p className="mt-2 text-[14px] sm:text-[15px] md:text-[16px] text-[#666] leading-[1.7] max-w-[480px]">
              Sri Lankan Tamil matrimony — connect with verified profiles from your community across
              12 countries. Free to join, privacy-first, designed for Tamil families.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {TAGS.map(t => (
                <span key={t} className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-[#888] bg-[#F5F5F5]
                  px-3 py-1 rounded-full border border-[#EBEBEB]">{t}</span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="relative text-[#CCC] group-hover:text-[#B31B38] group-hover:translate-x-1
            transition-all duration-200 shrink-0 hidden sm:block">
            <ForwardArrowIcon/>
          </div>
        </a>
      </div>

      {/* How it works */}
      <div>
        <SectionLabel>How it works</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STEPS.map(({ n, title, desc }) => (
            <div key={n}
              className="bg-[#FAFAFA] border border-[#EBEBEB] rounded-[20px] p-4 sm:p-6
                hover:border-[#F0C8D0] hover:bg-[#FFF8F9] transition-all duration-300">
              <span className="text-[26px] sm:text-[28px] md:text-[32px] font-bold text-[#F0E0E4] leading-none select-none">{n}</span>
              <h3 className="mt-2 text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-[#0A0A0A]">{title}</h3>
              <p className="mt-1.5 text-[14px] sm:text-[15px] md:text-[16px] text-[#999] leading-[1.6]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
