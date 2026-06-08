import { SectionLabel } from "@/components/ui";
import { MailIcon, WhatsAppIcon, ExternalArrowIcon } from "@/assets/Icons";
import { SITE, EMAIL, CO_SITE, CO_NAME, ADDRESS } from "@/data/contacts";

const LEGAL = [
  { label: "Terms & Conditions", sub: "Rules for using Inai.lk",       href: `${SITE}/terms` },
  { label: "Privacy Policy",     sub: "How we handle your data",        href: `${SITE}/privacy` },
  { label: "Refund Policy",      sub: "Elite membership refund terms",  href: `${SITE}/refund-policy` },
] as const;

export default function SupportSection() {
  return (
    <section className="max-w-[1200px] mx-auto w-full max-[370px]:px-2 px-4 sm:px-6 py-15 sm:py-17 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Contact ── */}
        <div>
          <SectionLabel>Contact & Support</SectionLabel>
          <div className="border border-[#EBEBEB] rounded-[20px] overflow-hidden">

            {/* Email */}
            <a href={`mailto:${EMAIL}`}
              className="group flex items-start gap-4 p-4 sm:p-6 hover:bg-[#FAFAFA]
                transition-colors border-b border-[#F5F5F5]">
              <div className="w-10 h-10 rounded-[12px] bg-[#FFF0F3] text-[#B31B38]
                flex items-center justify-center shrink-0">
                <MailIcon/>
              </div>
              <div>
                <p className="text-[12px] sm:text-[13px] md:text-[14px] text-[#BBBBBB] font-medium tracking-[1px] uppercase mb-0.5">
                  Email
                </p>
                <p className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-[#0A0A0A]
                  group-hover:text-[#B31B38] transition-colors">
                  {EMAIL}
                </p>
                <p className="text-[12px] sm:text-[13px] md:text-[14px] text-[#BBBBBB] mt-0.5">
                  Replies within one business day
                </p>
              </div>
            </a>

            {/* WhatsApp */}
            <a href="https://wa.me/94750207507" target="_blank" rel="noopener noreferrer"
              className="group flex items-start gap-4 p-6 hover:bg-[#FAFAFA]
                transition-colors border-b border-[#F5F5F5]">
              <div className="w-10 h-10 rounded-[12px] bg-[#B31B38] text-white
                flex items-center justify-center shrink-0">
                <WhatsAppIcon/>
              </div>
              <div>
                <p className="text-[12px] sm:text-[13px] md:text-[14px] text-[#BBBBBB] font-medium tracking-[1px] uppercase mb-0.5">
                  WhatsApp
                </p>
                <p className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-[#0A0A0A]
                  group-hover:text-[#B31B38] transition-colors">
                  +94 75 020 7507
                </p>
                <p className="text-[12px] sm:text-[13px] md:text-[14px] text-[#BBBBBB] mt-0.5">
                  Chat directly with our team
                </p>
              </div>
            </a>

            {/* Office */}
            <div className="p-6">
              <p className="text-[12px] sm:text-[13px] md:text-[14px] text-[#BBBBBB] font-medium tracking-[1px] uppercase mb-1">
                Office
              </p>
              <a href={CO_SITE} target="_blank" rel="noopener noreferrer"
                className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-[#0A0A0A]
                  hover:text-[#B31B38] transition-colors block">
                {CO_NAME}
              </a>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#999] mt-1 leading-snug">{ADDRESS}</p>
            </div>
          </div>
        </div>

        {/* ── Legal ── */}
        <div>
          <SectionLabel>Legal</SectionLabel>
          <div className="border border-[#EBEBEB] rounded-[20px] overflow-hidden">
            {LEGAL.map(({ label, sub, href }, i) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className={`group flex items-center justify-between gap-4 p-4 sm:p-6
                  hover:bg-[#FAFAFA] transition-colors
                  ${i !== LEGAL.length - 1 ? "border-b border-[#F5F5F5]" : ""}`}>
                <div>
                  <p className="text-[16px] sm:text-[17px] md:text-[18px] font-semibold text-[#0A0A0A]
                    group-hover:text-[#B31B38] transition-colors">
                    {label}
                  </p>
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#BBBBBB] mt-0.5">{sub}</p>
                </div>
                <span className="text-[#CCCCCC] group-hover:text-[#B31B38] shrink-0 transition-colors">
                  <ExternalArrowIcon/>
                </span>
              </a>
            ))}
          </div>

          {/* Company blurb */}
          <div className="mt-4 bg-[#FAFAFA] border border-[#EBEBEB] rounded-[16px] p-4 sm:p-6">
            <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#888] leading-[1.7]">
              Inai.lk is a product of{" "}
              <a href={CO_SITE} target="_blank" rel="noopener noreferrer"
                className="text-[#555] font-medium hover:text-[#B31B38] transition-colors">
                {CO_NAME}
              </a>
              {" "}— a technology company based in Kilinochchi, Sri Lanka.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
