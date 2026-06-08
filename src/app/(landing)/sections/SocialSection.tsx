import { SectionLabel } from "@/components/ui";
import {
  FacebookIcon, InstagramIcon, WhatsAppIcon, XTwitterIcon, ExternalArrowIcon,
} from "@/assets/Icons";
import { SOCIALS } from "@/data/contacts";
import type { ComponentType, SVGProps } from "react";

type IconMap = Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

const ICON_MAP: IconMap = {
  facebook:  FacebookIcon,
  instagram: InstagramIcon,
  whatsapp:  WhatsAppIcon,
  x:         XTwitterIcon,
};

export default function SocialSection() {
  return (
    <section className="max-w-[1200px] mx-auto w-full max-[370px]:px-2 px-4 sm:px-6 py-15 sm:py-17 md:py-20">

      {/* Heading row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-10">
        <div>
          <SectionLabel>Follow us</SectionLabel>
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-[#0A0A0A] leading-[1.15] tracking-tight">
            Connect with the community
          </h2>
        </div>
        <p className="text-[14px] text-[#888] leading-[1.7] max-w-[300px]">
          Stay updated with new features, success stories, and Tamil community news.
        </p>
      </div>

      {/* Social cards — brand-red circle, white icon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SOCIALS.map(({ key, label, sub, href }) => {
          const Icon = ICON_MAP[key];
          return (
            <a key={key} href={href} target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center text-center gap-4 bg-[#FAFAFA]
                border border-[#EBEBEB] rounded-[22px] p-6
                hover:border-[#F0C8D0] hover:bg-[#FFF8F9]
                hover:shadow-[0_8px_32px_rgba(179,27,56,0.08)] transition-all duration-300">
              {/* Red circle with white icon */}
              <div className="w-12 h-12 rounded-full bg-[#B31B38] text-white
                flex items-center justify-center
                group-hover:scale-110 group-hover:shadow-[0_6px_20px_rgba(179,27,56,0.38)]
                transition-all duration-300">
                {Icon && <Icon/>}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#0A0A0A]">{label}</p>
                <p className="mt-0.5 text-[11.5px] text-[#BBBBBB] truncate max-w-[110px]">{sub}</p>
              </div>
            </a>
          );
        })}
      </div>

      {/* Subtle external link row below on mobile */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 lg:hidden">
        {SOCIALS.map(({ key, label, href }) => (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-[12px] font-medium text-[#AAAAAA]
              hover:text-[#B31B38] transition-colors">
            {label} <ExternalArrowIcon/>
          </a>
        ))}
      </div>
    </section>
  );
}
