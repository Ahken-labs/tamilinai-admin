import { InaiMarkIcon, ExternalArrowIcon } from "@/assets/Icons";
import { SITE } from "@/data/contacts";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#F2F2F2] bg-white/85 backdrop-blur-md">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between">
        <div className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 rounded-[10px] bg-[#B31B38] text-white flex items-center justify-center">
            <InaiMarkIcon size={18}/>
          </div>
          <span className="font-tamil text-[15px] font-semibold tracking-[0.4px] text-[#0A0A0A]">
            இணை.lk
          </span>
        </div>
        <a href={SITE}
          className="text-[13px] font-medium text-[#6B6B6B] hover:text-[#0A0A0A]
            transition-colors flex items-center gap-1.5">
          Visit Inai.lk <ExternalArrowIcon/>
        </a>
      </div>
    </header>
  );
}
