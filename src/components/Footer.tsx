import { InaiMarkIcon } from "@/assets/Icons";
import { SITE, EMAIL, CO_SITE, CO_NAME } from "@/data/contacts";

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(270deg, #35050C 0%, #740234 100%)" }}>
      <div className="max-w-[900px] mx-auto px-6 lg:px-10 py-7
        flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-[7px] bg-white/15 text-white flex items-center justify-center">
            <InaiMarkIcon size={14}/>
          </div>
          <span className="font-tamil text-[13px] font-semibold text-white/80 tracking-[0.3px]">
            இணை.lk
          </span>
        </div>

        {/* Copyright */}
        <span className="text-[12px] text-white/40">
          © {new Date().getFullYear()}{" "}
          <a href={CO_SITE} target="_blank" rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors">
            {CO_NAME}
          </a>
        </span>

        {/* Links */}
        <div className="flex items-center gap-4">
          {[
            { label: "Terms",   href: `${SITE}/terms` },
            { label: "Privacy", href: `${SITE}/privacy` },
            { label: EMAIL,     href: `mailto:${EMAIL}` },
          ].map(({ label, href }) => (
            <a key={label} href={href}
              className="text-[12px] text-white/50 hover:text-white transition-colors">
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
