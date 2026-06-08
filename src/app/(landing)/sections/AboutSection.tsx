import { SectionLabel } from "@/components/ui";
import { ShieldCheckIcon, LockClosedIcon, UsersGroupIcon } from "@/assets/Icons";

const FEATURES = [
  {
    Icon: ShieldCheckIcon,
    title: "Verified Profiles",
    desc:  "Manual ID verification and photo review for every member on the platform.",
  },
  {
    Icon: LockClosedIcon,
    title: "Total Privacy",
    desc:  "Phone, email, and photos stay private. You control who sees what — always.",
  },
  {
    Icon: UsersGroupIcon,
    title: "Family First",
    desc:  "Share profiles with your parents. Tamil marriage is a family decision — we respect that.",
  },
] as const;

export default function AboutSection() {
  return (
    <section className="max-w-[1200px] mx-auto w-full max-[370px]:px-2 px-4 sm:px-6 py-15 sm:py-17 md:py-20">

      {/* Heading row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-start mb-10 md:mb-15">
        <div>
          <SectionLabel>About Inai</SectionLabel>
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-[#222222]
            leading-[1.5]">
            The only platform built exclusively for Sri Lankan Tamils
          </h2>
        </div>
        <div className="flex flex-col gap-4 sm:pt-9">
          <p className="text-[14px] md:text-[16px] text-[#555] leading-[1.8]">
            Inai.lk was created because Sri Lankan Tamils — in Sri Lanka and across the world —
            deserved a matrimony platform that truly understood their culture, not a generic app
            with a Tamil language toggle.
          </p>
          <p className="text-[14px] md:text-[16px] text-[#555] leading-[1.8]">
            We welcome Tamils from every region: Jaffna, Kilinochchi, Mullaitivu, Vavuniya,
            Trincomalee, Batticaloa, Kandy, Colombo, and the global diaspora in the UK, Canada,
            Australia, Germany, Singapore, Malaysia, and beyond.
          </p>
        </div>
      </div>

      {/* Feature tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FEATURES.map(({ Icon, title, desc }) => (
          <div key={title}
            className="group bg-[#FAFAFA] border border-[#EBEBEB] rounded-[20px] p-4 md:p-6
              hover:border-[#F0C8D0] hover:bg-[#FFF8F9]
              hover:shadow-[0_8px_32px_rgba(179,27,56,0.08)] transition-all duration-300">
            <div className="w-10 h-10 rounded-[12px] bg-white border border-[#EBEBEB]
              flex items-center justify-center text-[#B31B38] mb-3 sm:mb-4
              group-hover:bg-[#B31B38] group-hover:text-white group-hover:border-[#B31B38]
              transition-all duration-300 shadow-sm">
              <Icon/>
            </div>
            <h3 className="text-[16px] font-semibold text-[#0A0A0A] mb-1.5">{title}</h3>
            <p className="text-[14px] md:text-[16px] text-[#888] leading-[1.65]">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
