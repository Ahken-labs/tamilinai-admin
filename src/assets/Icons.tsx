import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

// ─── Raw logo mark (fill="currentColor", size via prop) ───────────────────────
export function InaiMarkIcon({ size = 24, className = "", ...props }: { size?: number } & IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M23.3799 4.81556C22.9827 3.87651 22.4144 3.03322 21.6906 2.30943C20.9668 1.58584 20.1237 1.01746 19.1844 0.620249C18.2117 0.208678 17.1789 0 16.1149 0C15.051 0 14.0182 0.208678 13.0452 0.620249C12.1061 1.01746 11.263 1.58584 10.5393 2.30943C9.81546 3.03322 9.24708 3.87651 8.84988 4.81556C8.4383 5.78853 8.22963 6.82115 8.22963 7.88529V8.22963H7.88529C6.82135 8.22963 5.78853 8.4383 4.81556 8.84968C3.87651 9.24688 3.03342 9.81546 2.30963 10.5391C1.58584 11.2628 1.01746 12.1061 0.620249 13.0452C0.208678 14.0182 0 15.0508 0 16.1147C0 17.1787 0.208678 18.2115 0.620249 19.1844C1.01746 20.1235 1.58584 20.9668 2.30963 21.6906C3.03342 22.4142 3.87651 22.9825 4.81556 23.3798C5.78853 23.7913 6.82135 24 7.88529 24H21.9751C22.9522 24 23.7698 23.3045 23.9589 22.3826C23.9657 22.3497 23.9715 22.3166 23.9767 22.2831C23.9818 22.2496 23.986 22.2159 23.9896 22.1817C23.9966 22.1139 24 22.0449 24 21.9751V7.88529C24 6.82115 23.7913 5.78853 23.3799 4.81556ZM7.88529 21.5461C4.89037 21.5461 2.45387 19.1096 2.45387 16.1147C2.45387 13.1198 4.89037 10.6835 7.88529 10.6835H8.22963V18.8682C8.22963 19.5669 8.37227 20.2448 8.65377 20.8832C8.75531 21.1134 8.87302 21.3347 9.00668 21.5461H7.88529ZM16.4599 18.8682C16.4599 20.3449 15.1846 21.5461 13.617 21.5461H13.5264C11.9589 21.5461 10.6835 20.2707 10.6835 18.7032V10.6835H16.4599V18.8682ZM21.5461 21.5461H18.1369C18.2703 21.3347 18.3882 21.1134 18.4898 20.8832C18.7711 20.2448 18.9137 19.5669 18.9137 18.8682V10.6913C20.3834 10.7994 21.5461 12.0295 21.5461 13.5264V21.5461ZM21.5461 9.05516C20.7625 8.55461 19.8601 8.27072 18.9137 8.23402V7.8402C18.9137 7.43202 18.8497 7.02903 18.7236 6.64239L18.7168 6.64459C18.3601 5.54833 17.3285 4.75372 16.1149 4.75372C14.6065 4.75372 13.3794 5.98085 13.3794 7.48928C13.3794 7.74584 13.4149 7.99402 13.4813 8.22963H10.6835V7.88529C10.6835 4.89037 13.12 2.45387 16.1149 2.45387C19.1098 2.45387 21.5461 4.89037 21.5461 7.88529V9.05516Z" fill="currentColor"/>
    </svg>
  );
}

// ─── Social icons ─────────────────────────────────────────────────────────────
export function FacebookIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export function InstagramIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

export function WhatsAppIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export function XTwitterIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

// ─── UI utility icons ─────────────────────────────────────────────────────────
export function ArrowRightIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} {...props}>
      <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ExternalArrowIcon({ className = "w-3 h-3", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} {...props}>
      <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ChevronDownIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} {...props}>
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MailIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

export function ShieldCheckIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9,12 11,14 15,10"/>
    </svg>
  );
}

export function LockClosedIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

export function UsersGroupIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

export function ForwardArrowIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M5 12H19M13 6L19 12L13 18"/>
    </svg>
  );
}

export function SignOutIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

export function MenuIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

export function Logo({ className = "w-5 lg:w-6 h-5 lg:h-6 shrink-0", ...props }: IconProps) {
  return (
    <div className="flex w-9 lg:w-10 h-9 lg:h-10 items-center justify-center rounded-[20px] bg-[#B31B38] shrink-0 pt-[7px] pb-[9px] pr-[9px] pl-[7px]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} {...props}>
        <path d="M23.3799 4.81556C22.9827 3.87651 22.4144 3.03322 21.6906 2.30943C20.9668 1.58584 20.1237 1.01746 19.1844 0.620249C18.2117 0.208678 17.1789 0 16.1149 0C15.051 0 14.0182 0.208678 13.0452 0.620249C12.1061 1.01746 11.263 1.58584 10.5393 2.30943C9.81546 3.03322 9.24708 3.87651 8.84988 4.81556C8.4383 5.78853 8.22963 6.82115 8.22963 7.88529V8.22963H7.88529C6.82135 8.22963 5.78853 8.4383 4.81556 8.84968C3.87651 9.24688 3.03342 9.81546 2.30963 10.5391C1.58584 11.2628 1.01746 12.1061 0.620249 13.0452C0.208678 14.0182 0 15.0508 0 16.1147C0 17.1787 0.208678 18.2115 0.620249 19.1844C1.01746 20.1235 1.58584 20.9668 2.30963 21.6906C3.03342 22.4142 3.87651 22.9825 4.81556 23.3798C5.78853 23.7913 6.82135 24 7.88529 24H21.9751C22.9522 24 23.7698 23.3045 23.9589 22.3826C23.9657 22.3497 23.9715 22.3166 23.9767 22.2831C23.9818 22.2496 23.986 22.2159 23.9896 22.1817C23.9966 22.1139 24 22.0449 24 21.9751V7.88529C24 6.82115 23.7913 5.78853 23.3799 4.81556ZM7.88529 21.5461C4.89037 21.5461 2.45387 19.1096 2.45387 16.1147C2.45387 13.1198 4.89037 10.6835 7.88529 10.6835H8.22963V18.8682C8.22963 19.5669 8.37227 20.2448 8.65377 20.8832C8.75531 21.1134 8.87302 21.3347 9.00668 21.5461H7.88529ZM16.4599 18.8682C16.4599 20.3449 15.1846 21.5461 13.617 21.5461H13.5264C11.9589 21.5461 10.6835 20.2707 10.6835 18.7032V10.6835H16.4599V18.8682ZM21.5461 21.5461H18.1369C18.2703 21.3347 18.3882 21.1134 18.4898 20.8832C18.7711 20.2448 18.9137 19.5669 18.9137 18.8682V10.6913C20.3834 10.7994 21.5461 12.0295 21.5461 13.5264V21.5461ZM21.5461 9.05516C20.7625 8.55461 19.8601 8.27072 18.9137 8.23402V7.8402C18.9137 7.43202 18.8497 7.02903 18.7236 6.64239L18.7168 6.64459C18.3601 5.54833 17.3285 4.75372 16.1149 4.75372C14.6065 4.75372 13.3794 5.98085 13.3794 7.48928C13.3794 7.74584 13.4149 7.99402 13.4813 8.22963H10.6835V7.88529C10.6835 4.89037 13.12 2.45387 16.1149 2.45387C19.1098 2.45387 21.5461 4.89037 21.5461 7.88529V9.05516Z" fill="white" />
      </svg>
    </div>
  );
}

export function FlowerIcon({ className = "w-6 h-12", color = "white", ...props }: IconProps & { color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37 72" fill="none" className={className} {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M15.1539 21.1415C19.2603 18.167 21.2297 14.7221 21.0621 10.8069C20.8945 6.89184 18.6234 3.28952 14.249 0C10.1427 2.97465 8.17325 6.41954 8.34078 10.3346C8.50854 14.2498 10.7794 17.8521 15.1539 21.1415Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M20.4285 47.2293C16.1099 47.0691 12.3049 48.8469 9.01444 52.5623C9.16412 52.7266 9.31572 52.887 9.46659 53.0447C9.46575 53.0458 9.4645 53.0466 9.46366 53.0477L9.48417 53.0633C12.977 56.7081 16.7892 58.6081 20.9226 58.7615C23.7599 58.8668 26.3749 58.1356 28.7683 56.5682C29.0109 56.7892 29.2525 57.0238 29.4939 57.2723C31.9035 59.7656 31.8737 62.1231 30.8611 63.8055C29.7493 65.6525 27.0623 67.326 22.992 67.326V71.9998C28.2603 71.9998 32.7031 69.8066 34.865 66.2146C37.1248 62.4591 36.5138 57.8087 32.8504 54.0203L32.8455 54.0154C32.6637 53.8283 32.481 53.6472 32.2976 53.4715C32.3105 53.457 32.3239 53.443 32.3367 53.4285C28.717 49.4564 24.7474 47.3898 20.4285 47.2293Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M20.6502 45.6061C19.5686 40.6789 17.1157 37.167 13.2917 35.0705C9.46744 32.974 5.03689 32.7123 0 34.2854C1.08159 39.2128 3.53449 42.7247 7.35848 44.8212C11.1827 46.9177 15.6133 47.1792 20.6502 45.6061Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M14.1774 33.7422C15.9238 29.18 15.6448 25.1636 13.34 21.6929C11.0355 18.222 7.16641 15.9912 1.73255 15.0002C-0.0137863 19.5624 0.265431 23.5789 2.56997 27.0496C4.8745 30.5203 8.74382 32.7512 14.1774 33.7422Z" fill={color} />
    </svg>
  );
}

export function TrustVerifiedIcon({ className = "shrink-0", ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M8.38086 12.0001L10.7909 14.4201L15.6209 9.58008" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.7509 2.44982C11.4409 1.85982 12.5709 1.85982 13.2709 2.44982L14.8509 3.80982C15.1509 4.06982 15.7109 4.27982 16.1109 4.27982H17.8109C18.8709 4.27982 19.7409 5.14982 19.7409 6.20982V7.90982C19.7409 8.29982 19.9509 8.86982 20.2109 9.16982L21.5709 10.7498C22.1609 11.4398 22.1609 12.5698 21.5709 13.2698L20.2109 14.8498C19.9509 15.1498 19.7409 15.7098 19.7409 16.1098V17.8098C19.7409 18.8698 18.8709 19.7398 17.8109 19.7398H16.1109C15.7209 19.7398 15.1509 19.9498 14.8509 20.2098L13.2709 21.5698C12.5809 22.1598 11.4509 22.1598 10.7509 21.5698L9.17086 20.2098C8.87086 19.9498 8.31086 19.7398 7.91086 19.7398H6.18086C5.12086 19.7398 4.25086 18.8698 4.25086 17.8098V16.0998C4.25086 15.7098 4.04086 15.1498 3.79086 14.8498L2.44086 13.2598C1.86086 12.5698 1.86086 11.4498 2.44086 10.7598L3.79086 9.16982C4.04086 8.86982 4.25086 8.30982 4.25086 7.91982V6.19982C4.25086 5.13982 5.12086 4.26982 6.18086 4.26982H7.91086C8.30086 4.26982 8.87086 4.05982 9.17086 3.79982L10.7509 2.44982Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrustPrivacyIcon({ className = "shrink-0", ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M20.9099 11.1198C20.9099 16.0098 17.3599 20.5898 12.5099 21.9298C12.1799 22.0198 11.8198 22.0198 11.4898 21.9298C6.63984 20.5898 3.08984 16.0098 3.08984 11.1198V6.72979C3.08984 5.90979 3.70986 4.97979 4.47986 4.66979L10.0498 2.38982C11.2998 1.87982 12.7098 1.87982 13.9598 2.38982L19.5298 4.66979C20.2898 4.97979 20.9199 5.90979 20.9199 6.72979L20.9099 11.1198Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12.69L10.61 14.3L14.91 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GlobeIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronIcon({ open, className = "w-4 h-3.5 shrink-0 transition-transform duration-200", strokeWidth = "2", stroke = "#222", ...props }: { open: boolean } & IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className={`${className} ${open ? "rotate-180" : ""}`} aria-hidden="true" {...props}>
      <path d="M13.2801 5.9668L8.93343 10.3135C8.42009 10.8268 7.58009 10.8268 7.06676 10.3135L2.72009 5.9668" stroke={stroke} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TamilLanguageIcon({ className = "w-6 h-6 shrink-0", color = "#222222", ...props }: IconProps & { color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M22.2437 22L17.232 12L12.2202 22M13.5362 19.3742H20.9277" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 15C2 18.87 5.13 22 9 22L7.95 20.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 9C22 5.13 18.87 2 15 2L16.05 3.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.21282 2.17939C6.21282 2.17939 9.64319 1.50768 9.64319 7.35371C9.64319 9.39815 8.58874 12 5.91628 12C2.89651 12 1.19435 7.35323 2.37992 7.35323C3.56548 7.35323 11.3555 7.35323 11.3555 7.35323M11.4393 2V12M7.68843 3.72287C7.68843 4.57755 6.99558 5.27041 6.1409 5.27041C5.28622 5.27041 4.59336 4.57755 4.59336 3.72287C4.59336 2.86819 5.28622 2.17534 6.1409 2.17534C6.99558 2.17534 7.68843 2.86819 7.68843 3.72287Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function StepProfileIcon({ className = "w-6 h-6", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} {...props}>
      <path d="M20.1979 21.3C20.0812 21.2833 19.9312 21.2833 19.7979 21.3C16.8646 21.2 14.5312 18.8 14.5312 15.85C14.5312 12.8333 16.9646 10.3833 19.9979 10.3833C23.0146 10.3833 25.4646 12.8333 25.4646 15.85C25.4479 18.8 23.1312 21.2 20.1979 21.3Z" stroke="#222222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31.2297 32.3001C28.263 35.0168 24.3297 36.6668 19.9963 36.6668C15.663 36.6668 11.7297 35.0168 8.763 32.3001C8.92967 30.7334 9.92967 29.2001 11.713 28.0001C16.2797 24.9668 23.7463 24.9668 28.2797 28.0001C30.063 29.2001 31.063 30.7334 31.2297 32.3001Z" stroke="#222222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 36.6667C29.2047 36.6667 36.6666 29.2048 36.6666 20C36.6666 10.7953 29.2047 3.33337 20 3.33337C10.7952 3.33337 3.33331 10.7953 3.33331 20C3.33331 29.2048 10.7952 36.6667 20 36.6667Z" stroke="#222222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StepPreferencesIcon({ className = "w-6 h-6", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} {...props}>
      <path d="M20.6224 14.7998H29.3724" stroke="#222222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.6459 14.7998L11.8959 16.0498L15.6459 12.2998" stroke="#222222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.6224 26.4663H29.3724" stroke="#222222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.6459 26.4663L11.8959 27.7163L15.6459 23.9663" stroke="#222222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.0079 36.6667H25.0079C33.3412 36.6667 36.6745 33.3334 36.6745 25V15C36.6745 6.66671 33.3412 3.33337 25.0079 3.33337H15.0079C6.67452 3.33337 3.34119 6.66671 3.34119 15V25C3.34119 33.3334 6.67452 36.6667 15.0079 36.6667Z" stroke="#222222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StepMatchIcon({ className = "w-6 h-6", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} {...props}>
      <path d="M23.3301 31.6669C23.3301 27.985 18.8529 25.0002 13.3301 25.0002C7.80723 25.0002 3.33008 27.985 3.33008 31.6669M13.3301 20.0002C9.64818 20.0002 6.66341 17.0154 6.66341 13.3335C6.66341 9.65164 9.64818 6.66687 13.3301 6.66687C17.012 6.66687 19.9967 9.65164 19.9967 13.3335C19.9967 17.0154 17.012 20.0002 13.3301 20.0002Z" stroke="#222222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31.6602 18.4192C30.549 15.8112 26.6602 16.089 26.6602 19.4224C26.6602 22.7557 31.6602 25.5334 31.6602 25.5334C31.6602 25.5334 36.6602 22.7557 36.6602 19.4224C36.6602 16.089 32.7713 15.8112 31.6602 18.4192Z" stroke="#222222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StepFamilyIcon({ className = "w-6 h-6", strokeWidth = "2.5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} {...props}>
      <path d="M30.0074 11.9333C29.9074 11.9166 29.7907 11.9166 29.6907 11.9333C27.3907 11.8499 25.5574 9.96659 25.5574 7.63325C25.5574 5.24992 27.474 3.33325 29.8574 3.33325C32.2407 3.33325 34.1574 5.26659 34.1574 7.63325C34.1407 9.96659 32.3074 11.8499 30.0074 11.9333Z" stroke="#222222" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28.2896 24.0669C30.573 24.4502 33.0896 24.0502 34.8563 22.8669C37.2063 21.3002 37.2063 18.7335 34.8563 17.1669C33.073 15.9835 30.523 15.5835 28.2396 15.9835" stroke="#222222" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.95213 11.9333C10.0521 11.9166 10.1688 11.9166 10.2688 11.9333C12.5688 11.8499 14.4021 9.96659 14.4021 7.63325C14.4021 5.24992 12.4855 3.33325 10.1021 3.33325C7.71879 3.33325 5.80212 5.26659 5.80212 7.63325C5.81879 9.96659 7.65213 11.8499 9.95213 11.9333Z" stroke="#222222" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.6704 24.0669C9.38702 24.4502 6.87035 24.0502 5.10369 22.8669C2.75369 21.3002 2.75369 18.7335 5.10369 17.1669C6.88702 15.9835 9.43702 15.5835 11.7203 15.9835" stroke="#222222" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.0021 24.3837C19.9021 24.367 19.7855 24.367 19.6855 24.3837C17.3855 24.3004 15.5521 22.417 15.5521 20.0837C15.5521 17.7004 17.4688 15.7837 19.8521 15.7837C22.2355 15.7837 24.1521 17.717 24.1521 20.0837C24.1355 22.417 22.3021 24.317 20.0021 24.3837Z" stroke="#222222" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.1531 29.634C12.8031 31.2006 12.8031 33.7673 15.1531 35.334C17.8198 37.1173 22.1865 37.1173 24.8531 35.334C27.2031 33.7673 27.2031 31.2006 24.8531 29.634C22.2031 27.8673 17.8198 27.8673 15.1531 29.634Z" stroke="#222222" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TamilLetterIcon({ className = "w-6 h-6", stroke = "black", ...props }: SVGProps<SVGSVGElement> & { stroke?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <circle cx="10.8048" cy="5.7211" r="2.965" stroke={stroke} strokeWidth="1.44463" />
      <path d="M10.9427 2.76388C10.9427 2.76388 17.5151 1.4769 17.5151 12.6776C17.5151 16.5946 15.4948 21.5797 10.3745 21.5797C4.58877 21.5797 1.32751 12.6767 3.599 12.6767C5.87048 12.6767 20.7957 12.6767 20.7957 12.6767M20.9564 2.42017V21.5797" stroke={stroke} strokeWidth="1.44463" strokeLinecap="round" />
    </svg>
  );
}

export function CommunityIcon({ className = "w-6 h-6", stroke = "#222222", ...props }: SVGProps<SVGSVGElement> & { stroke?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M14 16C14 17.77 13.23 19.37 12 20.46C10.94 21.42 9.54 22 8 22C4.69 22 2 19.31 2 16C2 13.24 3.88 10.9 6.42 10.21C7.11 11.95 8.59 13.29 10.42 13.79C10.92 13.93 11.45 14 12 14C12.55 14 13.08 13.93 13.58 13.79C13.85 14.47 14 15.22 14 16Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 8C18 8.78 17.85 9.53 17.58 10.21C16.89 11.95 15.41 13.29 13.58 13.79C13.08 13.93 12.55 14 12 14C11.45 14 10.92 13.93 10.42 13.79C8.59 13.29 7.11 11.95 6.42 10.21C6.15 9.53 6 8.78 6 8C6 4.69 8.69 2 12 2C15.31 2 18 4.69 18 8Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 16C22 19.31 19.31 22 16 22C14.46 22 13.06 21.42 12 20.46C13.23 19.37 14 17.77 14 16C14 15.22 13.85 14.47 13.58 13.79C15.41 13.29 16.89 11.95 17.58 10.21C20.12 10.9 22 13.24 22 16Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UnionDesignIcon({ className = "h-[460px] w-auto md:h-[640px] lg:h-[744px]", ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 399 744" fill="none" className={className} {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M38.0483 60.3148C59.3082 80.0865 59.3097 112.143 38.0504 131.915C28.9346 140.393 17.3882 145.231 5.49802 146.439L48.86 186.765L71.7078 165.517C86.1043 152.129 109.445 152.131 123.841 165.519C138.237 178.907 138.238 200.614 123.843 214.002C109.446 227.391 86.1043 227.391 71.7078 214.002L48.8663 192.76L2.93182 235.46L49.0085 278.311L71.5357 257.361C85.9736 243.933 109.384 243.934 123.822 257.361C138.259 270.788 138.257 292.558 123.82 305.985L101.293 326.935L146.403 368.888L192.327 326.178L169.488 304.938C155.091 291.549 155.091 269.841 169.488 256.452C183.884 243.064 207.224 243.066 221.621 256.454C236.017 269.842 236.018 291.549 221.623 304.938L198.775 326.186L242.066 366.559C243.345 355.466 248.554 344.69 257.697 336.187C278.957 316.415 313.426 316.416 334.686 336.188L373.18 371.987L334.686 407.786C313.426 427.558 278.957 427.559 257.696 407.788C248.6 399.329 243.399 388.62 242.087 377.587L198.937 417.717L221.761 438.943C236.157 452.332 236.158 474.038 221.763 487.427C207.366 500.815 184.024 500.815 169.628 487.427C155.232 474.038 155.231 452.33 169.628 438.941L192.459 417.708L146.403 374.876L100.68 417.399L123.817 438.916C138.255 452.343 138.257 474.113 123.82 487.54C109.382 500.967 85.9708 500.967 71.5329 487.54L48.396 466.023L2.66776 508.55L48.7235 551.382L71.5859 530.12C85.9823 516.732 109.323 516.734 123.719 530.122C138.115 543.51 138.116 565.217 123.721 578.606C109.324 591.994 85.9817 591.995 71.5852 578.606L48.7381 557.358L5.53424 597.538C17.6462 598.636 29.4383 603.5 38.7151 612.128C59.9742 631.9 59.9742 663.954 38.7151 683.726L0.219299 719.527L-38.2744 683.728C-59.5347 663.956 -59.5347 631.898 -38.2744 612.126C-29.2802 603.762 -17.922 598.936 -6.20004 597.649L-49.6603 557.231L-72.5039 578.475C-86.9004 591.864 -110.243 591.864 -124.639 578.475C-139.035 565.087 -139.035 543.378 -124.639 529.99C-110.243 516.602 -86.9022 516.604 -72.506 529.992L-49.6666 551.232L-3.77249 508.551L-48.8828 466.598L-71.3424 487.486C-85.8046 500.935 -109.262 500.91 -123.689 487.429C-138.068 473.992 -138.04 452.266 -123.627 438.861L-101.167 417.974L-147.279 375.09L-193.184 417.761L-170.286 439.057C-155.89 452.445 -155.888 474.151 -170.284 487.54C-184.68 500.929 -208.022 500.929 -222.419 487.54C-236.815 474.151 -236.815 452.443 -222.419 439.055L-199.56 417.796L-242.369 377.985C-243.748 388.895 -248.937 399.468 -257.937 407.839C-279.197 427.611 -313.669 427.611 -334.929 407.839L-373.425 372.038L-334.929 336.237C-313.669 316.466 -279.199 316.468 -257.939 336.239C-248.783 344.754 -243.573 355.549 -242.304 366.659L-199.31 326.674L-222.157 305.426C-236.553 292.037 -236.553 270.328 -222.157 256.939C-207.76 243.552 -184.42 243.553 -170.024 256.941C-155.628 270.33 -155.626 292.037 -170.021 305.426L-192.883 326.688L-147.277 369.102L-101.538 326.584L-123.629 306.04C-138.091 292.59 -138.062 270.773 -123.565 257.355C-109.117 243.984 -85.7577 244.011 -71.3445 257.416L-49.243 277.97L-3.50983 235.458L-49.1482 193.014L-71.9792 214.247C-86.3758 227.635 -109.719 227.635 -124.115 214.246C-138.511 200.857 -138.511 179.149 -124.115 165.761C-109.719 152.373 -86.3783 152.375 -71.9821 165.762L-49.1343 187.011L-5.59177 146.516C-17.7627 145.448 -29.6216 140.582 -38.9413 131.915C-60.201 112.143 -60.2006 80.0854 -38.9405 60.3135L-0.446838 24.5143L38.0483 60.3148Z" fill="#FFD6C7" />
      <path d="M390.618 364.231C395.229 364.231 398.966 367.707 398.966 371.995C398.966 376.284 395.229 379.759 390.618 379.759C386.007 379.759 382.27 376.283 382.27 371.995C382.27 367.707 386.007 364.231 390.618 364.231Z" fill="#FFD6C7" />
      <path d="M-0.00854492 0C4.6022 0.00022933 8.33926 3.47563 8.33945 7.76364C8.33945 12.0519 4.60184 15.5279 -0.00924683 15.5279C-4.62012 15.5278 -8.35706 12.0524 -8.35724 7.76428C-8.35724 3.47598 -4.61963 1.699e-06 -0.00854492 0Z" fill="#FFD6C7" />
    </svg>
  );
}

export function LockIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M17 11H7C5.89543 11 5 11.8954 5 13V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V13C19 11.8954 18.1046 11 17 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="currentColor" />
      <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PhotoIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UsersIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BillingIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function EliteCrownIcon({ className = "w-5 h-5 shrink-0", fill = "currentColor", ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} {...props}>
      <path d="M3.9049 15.98L2.13851 6.13421C1.99394 5.32836 2.97654 4.81897 3.55175 5.40156L5.1459 7.01618C5.4919 7.36663 6.06472 7.34219 6.37961 6.96354L9.36802 3.37019C9.68884 2.98442 10.2753 2.96756 10.6178 3.33426L13.6047 6.53266C13.9108 6.86047 14.4215 6.88718 14.7601 6.5931L16.5468 5.04157C17.1409 4.52571 18.0531 5.04465 17.9133 5.8189L16.0769 15.9856C15.9336 16.7793 15.2426 17.3564 14.4361 17.3561L5.54469 17.3524C4.738 17.352 4.04735 16.774 3.9049 15.98Z" fill={fill} />
    </svg>
  );
}

export function EliteProIcon({ className = "w-5 h-5 shrink-0", fill = "currentColor", ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M2.11597 5.92144L3.88232 15.7673C4.02466 16.5613 4.71533 17.1393 5.52197 17.1396L14.4136 17.1433C15.22 17.1436 15.9109 16.5665 16.0542 15.7729L17.8906 5.60614C18.0305 4.83189 17.1182 4.31294 16.5242 4.8288L14.7375 6.38033C14.3989 6.67441 13.8882 6.6477 13.582 6.3199L10.5952 3.12149C10.2527 2.75479 9.66626 2.77165 9.34546 3.15742L6.35693 6.75078C6.04199 7.12942 5.46924 7.15386 5.12329 6.80341L3.52905 5.1888C2.95386 4.6062 1.97144 5.1156 2.11597 5.92144ZM10.7104 7.5909L12.4126 9.29298C12.803 9.6835 12.803 10.3167 12.4126 10.7072L10.7104 12.4093C10.3198 12.7998 9.68677 12.7998 9.29614 12.4093L7.59424 10.7072C7.20361 10.3167 7.20361 9.6835 7.59424 9.29298L9.29614 7.5909C9.68677 7.20037 10.3198 7.20037 10.7104 7.5909Z" fill={fill} />
    </svg>
  );
}

export function EliteVIPIcon({ className = "w-5 h-5 shrink-0", fill = "currentColor", ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.5277 3.62724C12.723 3.82251 12.723 4.1391 12.5277 4.33436L11.719 5.143C11.5285 5.33357 11.5232 5.64087 11.7072 5.83783L13.8246 8.10511C14.0083 8.30178 14.3146 8.31781 14.5178 8.14137L16.0797 6.78514C16.2986 6.595 16.3105 6.25907 16.1054 6.05403L15.8413 5.79003C15.646 5.59476 15.646 5.27815 15.8413 5.08288L16.9271 3.99711C17.1224 3.80186 17.439 3.80186 17.6342 3.99711L18.7201 5.08288C18.9153 5.27816 18.9153 5.59476 18.72 5.79003L18.1477 6.36226C18.0756 6.43432 18.0273 6.52668 18.0092 6.62697L16.1269 17.0489C15.9549 18.0012 15.1257 18.6938 14.1579 18.6934L5.82392 18.69C4.85591 18.6896 4.02714 17.996 3.85619 17.0432L1.98684 6.62428C1.96881 6.52379 1.92045 6.43122 1.84826 6.35903L1.27926 5.79003C1.08399 5.59476 1.084 5.27817 1.27927 5.08291L2.36512 3.99711C2.56038 3.80186 2.87695 3.80186 3.07221 3.99711L4.15807 5.08291C4.35334 5.27817 4.35334 5.59476 4.15808 5.79003L3.73304 6.21507C3.53867 6.40945 3.53766 6.72429 3.73079 6.9199L5.40461 8.6153C5.61222 8.82558 5.95592 8.81091 6.14486 8.58372L8.38476 5.89032C8.54999 5.69164 8.53661 5.39978 8.35388 5.21706L7.47116 4.33436C7.27589 4.1391 7.27589 3.82251 7.47116 3.62724L9.64588 1.45259C9.84114 1.25734 10.1577 1.25734 10.353 1.45259L12.5277 3.62724ZM12.4086 10.6352L10.7065 8.93313C10.3158 8.54261 9.68278 8.54261 9.29215 8.93313L7.59025 10.6352C7.19962 11.0257 7.19962 11.6589 7.59025 12.0494L9.29215 13.7515C9.68278 14.142 10.3158 14.142 10.7065 13.7515L12.4086 12.0494C12.799 11.6589 12.799 11.0257 12.4086 10.6352Z" fill={fill} />
    </svg>
  );
}

export function EliteIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M3.9049 15.9803L2.13851 6.13445C1.99394 5.32861 2.97654 4.81921 3.55175 5.40181L5.1459 7.01642C5.4919 7.36687 6.06472 7.34243 6.37961 6.96379L9.36802 3.37043C9.68884 2.98466 10.2753 2.9678 10.6178 3.33451L13.6047 6.53291C13.9108 6.86071 14.4215 6.88742 14.7601 6.59334L16.5468 5.04182C17.1409 4.52595 18.0531 5.0449 17.9133 5.81914L16.0769 15.9859C15.9336 16.7795 15.2426 17.3566 14.4361 17.3563L5.54469 17.3526C4.738 17.3523 4.04735 16.7743 3.9049 15.9803Z" fill="currentColor"/>
    </svg>
  );
}

export function VerifiedIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M13.749 1.94982C14.439 1.35982 15.569 1.35982 16.269 1.94982L17.849 3.30982C18.149 3.56982 18.709 3.77982 19.109 3.77982H20.809C21.869 3.77982 22.739 4.64982 22.739 5.70982V7.40982C22.739 7.79982 22.949 8.36982 23.209 8.66982L24.569 10.2498C25.159 10.9398 25.159 12.0698 24.569 12.7698L23.209 14.3498C22.949 14.6498 22.739 15.2098 22.739 15.6098V17.3098C22.739 18.3698 21.869 19.2398 20.809 19.2398H19.109C18.719 19.2398 18.149 19.4498 17.849 19.7098L16.269 21.0698C15.579 21.6598 14.449 21.6598 13.749 21.0698L12.169 19.7098C11.869 19.4498 11.309 19.2398 10.909 19.2398H9.179C8.119 19.2398 7.249 18.3698 7.249 17.3098V15.5998C7.249 15.2098 7.039 14.6498 6.789 14.3498L5.439 12.7598C4.859 12.0698 4.859 10.9498 5.439 10.2598L6.789 8.66982C7.039 8.36982 7.249 7.80982 7.249 7.41982V5.69982C7.249 4.63982 8.119 3.76982 9.179 3.76982H10.909C11.299 3.76982 11.869 3.55982 12.169 3.29982L13.749 1.94982Z" fill="currentColor"/>
      <path d="M11.379 11.5001L13.789 13.9201L18.619 9.08008" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function BellIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BackArrowIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M19 12H5M11 6L5 12L11 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// remove this section once website gets real profile traffic
export function SeedIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <g clipPath="url(#seed-clip)">
        <path d="M12.5 11.95C12.9833 11.4167 13.3543 10.8083 13.613 10.125C13.8717 9.44167 14.0007 8.73333 14 8C13.9993 7.26667 13.8703 6.55833 13.613 5.875C13.3557 5.19167 12.9847 4.58333 12.5 4.05C13.5 4.18333 14.3333 4.625 15 5.375C15.6667 6.125 16 7 16 8C16 9 15.6667 9.875 15 10.625C14.3333 11.375 13.5 11.8167 12.5 11.95ZM17.45 20C17.6333 19.7 17.771 19.3793 17.863 19.038C17.955 18.6967 18.0007 18.3507 18 18V17C18 16.4 17.8667 15.829 17.6 15.287C17.3333 14.745 16.9833 14.266 16.55 13.85C17.4 14.15 18.1877 14.5377 18.913 15.013C19.6383 15.4883 20.0007 16.1507 20 17V18C20 18.55 19.8043 19.021 19.413 19.413C19.0217 19.805 18.5507 20.0007 18 20H17.45ZM20 11H19C18.7167 11 18.4793 10.904 18.288 10.712C18.0967 10.52 18.0007 10.2827 18 10C17.9993 9.71733 18.0953 9.48 18.288 9.288C18.4807 9.096 18.718 9 19 9H20V8C20 7.71667 20.096 7.47933 20.288 7.288C20.48 7.09667 20.7173 7.00067 21 7C21.2827 6.99933 21.5203 7.09533 21.713 7.288C21.9057 7.48067 22.0013 7.718 22 8V9H23C23.2833 9 23.521 9.096 23.713 9.288C23.905 9.48 24.0007 9.71733 24 10C23.9993 10.2827 23.9033 10.5203 23.712 10.713C23.5207 10.9057 23.2833 11.0013 23 11H22V12C22 12.2833 21.904 12.521 21.712 12.713C21.52 12.905 21.2827 13.0007 21 13C20.7173 12.9993 20.48 12.9033 20.288 12.712C20.096 12.5207 20 12.2833 20 12V11ZM5.175 10.825C4.39167 10.0417 4 9.1 4 8C4 6.9 4.39167 5.95833 5.175 5.175C5.95833 4.39167 6.9 4 8 4C9.1 4 10.0417 4.39167 10.825 5.175C11.6083 5.95833 12 6.9 12 8C12 9.1 11.6083 10.0417 10.825 10.825C10.0417 11.6083 9.1 12 8 12C6.9 12 5.95833 11.6083 5.175 10.825ZM0 18V17.2C0 16.6333 0.146 16.1127 0.438 15.638C0.73 15.1633 1.11733 14.8007 1.6 14.55C2.63333 14.0333 3.68333 13.646 4.75 13.388C5.81667 13.13 6.9 13.0007 8 13C9.1 12.9993 10.1833 13.1287 11.25 13.388C12.3167 13.6473 13.3667 14.0347 14.4 14.55C14.8833 14.8 15.271 15.1627 15.563 15.638C15.855 16.1133 16.0007 16.634 16 17.2V18C16 18.55 15.8043 19.021 15.413 19.413C15.0217 19.805 14.5507 20.0007 14 20H2C1.45 20 0.979333 19.8043 0.588 19.413C0.196667 19.0217 0.000666667 18.5507 0 18ZM8 10C8.55 10 9.021 9.80433 9.413 9.413C9.805 9.02167 10.0007 8.55067 10 8C9.99933 7.44933 9.80367 6.97867 9.413 6.588C9.02233 6.19733 8.55133 6.00133 8 6C7.44867 5.99867 6.978 6.19467 6.588 6.588C6.198 6.98133 6.002 7.452 6 8C5.998 8.548 6.194 9.019 6.588 9.413C6.982 9.807 7.45267 10.0027 8 10ZM2 18H14V17.2C14 17.0167 13.9543 16.85 13.863 16.7C13.7717 16.55 13.6507 16.4333 13.5 16.35C12.6 15.9 11.6917 15.5627 10.775 15.338C9.85833 15.1133 8.93333 15.0007 8 15C7.06667 14.9993 6.14167 15.112 5.225 15.338C4.30833 15.564 3.4 15.9013 2.5 16.35C2.35 16.4333 2.229 16.55 2.137 16.7C2.045 16.85 1.99933 17.0167 2 17.2V18Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="seed-clip">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
// end-removal ────────────────────────────────────────────────────────────────

export function DashboardIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M13 8V4C13 3.71667 13.096 3.47933 13.288 3.288C13.48 3.09667 13.7173 3.00067 14 3H20C20.2833 3 20.521 3.096 20.713 3.288C20.905 3.48 21.0007 3.71733 21 4V8C21 8.28333 20.904 8.521 20.712 8.713C20.52 8.905 20.2827 9.00067 20 9H14C13.7167 9 13.4793 8.904 13.288 8.712C13.0967 8.52 13.0007 8.28267 13 8ZM3 12V4C3 3.71667 3.096 3.47933 3.288 3.288C3.48 3.09667 3.71733 3.00067 4 3H10C10.2833 3 10.521 3.096 10.713 3.288C10.905 3.48 11.0007 3.71733 11 4V12C11 12.2833 10.904 12.521 10.712 12.713C10.52 12.905 10.2827 13.0007 10 13H4C3.71667 13 3.47933 12.904 3.288 12.712C3.09667 12.52 3.00067 12.2827 3 12ZM13 20V12C13 11.7167 13.096 11.4793 13.288 11.288C13.48 11.0967 13.7173 11.0007 14 11H20C20.2833 11 20.521 11.096 20.713 11.288C20.905 11.48 21.0007 11.7173 21 12V20C21 20.2833 20.904 20.521 20.712 20.713C20.52 20.905 20.2827 21.0007 20 21H14C13.7167 21 13.4793 20.904 13.288 20.712C13.0967 20.52 13.0007 20.2827 13 20ZM3 20V16C3 15.7167 3.096 15.4793 3.288 15.288C3.48 15.0967 3.71733 15.0007 4 15H10C10.2833 15 10.521 15.096 10.713 15.288C10.905 15.48 11.0007 15.7173 11 16V20C11 20.2833 10.904 20.521 10.712 20.713C10.52 20.905 10.2827 21.0007 10 21H4C3.71667 21 3.47933 20.904 3.288 20.712C3.09667 20.52 3.00067 20.2827 3 20ZM5 11H9V5H5V11ZM15 19H19V13H15V19ZM15 7H19V5H15V7ZM5 19H9V17H5V19Z" fill="currentColor"/>
    </svg>
  );
}

// ─── Dashboard stat icons ─────────────────────────────────────────────────────

export function TrendingUpIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="16 7 22 7 22 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ActivityIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ClockIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function AlertTriangleIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function StarIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function UserBlockedIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M10 15H8C6.67392 15 5.40215 15.5268 4.46447 16.4645C3.52678 17.4021 3 18.6739 3 20V21H10.05M20.475 15.525L15.525 20.475M16 7.5C16 8.69347 15.5259 9.83807 14.682 10.682C13.8381 11.5259 12.6935 12 11.5 12C10.3065 12 9.16193 11.5259 8.31802 10.682C7.47411 9.83807 7 8.69347 7 7.5C7 6.30653 7.47411 5.16193 8.31802 4.31802C9.16193 3.47411 10.3065 3 11.5 3C12.6935 3 13.8381 3.47411 14.682 4.31802C15.5259 5.16193 16 6.30653 16 7.5ZM21.182 21.182C20.3381 22.0259 19.1935 22.5 18 22.5C16.8065 22.5 15.6619 22.0259 14.818 21.182C13.9741 20.3381 13.5 19.1935 13.5 18C13.5 16.8065 13.9741 15.6619 14.818 14.818C15.6619 13.9741 16.8065 13.5 18 13.5C19.1935 13.5 20.3381 13.9741 21.182 14.818C22.0259 15.6619 22.5 16.8065 22.5 18C22.5 19.1935 22.0259 20.3381 21.182 21.182Z" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
    </svg>
  );
}

export function UserPauseIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M14 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      <rect x="16" y="9" width="2" height="6" rx="0.5" fill="currentColor"/>
      <rect x="20" y="9" width="2" height="6" rx="0.5" fill="currentColor"/>
    </svg>
  );
}

export function UserCheckIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      <polyline points="16 11 18 13 22 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function UserXIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      <line x1="17" y1="11" x2="23" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="23" y1="11" x2="17" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function ImageIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
      <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function PasteIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <g clipPath="url(#paste-clip)">
        <path fillRule="evenodd" clipRule="evenodd" d="M14 8H10C9.73478 8 9.48043 8.10536 9.29289 8.29289C9.10536 8.48043 9 8.73478 9 9V14C9 14.2652 9.10536 14.5196 9.29289 14.7071C9.48043 14.8946 9.73478 15 10 15H14C14.2652 15 14.5196 14.8946 14.7071 14.7071C14.8946 14.5196 15 14.2652 15 14V9C15 8.73478 14.8946 8.48043 14.7071 8.29289C14.5196 8.10536 14.2652 8 14 8ZM10 7C8.9 7 8 7.895 8 9V14C8 15.1 8.895 16 10 16H14C15.1 16 16 15.105 16 14V9C16 7.9 15.105 7 14 7H10Z" fill="currentColor"/>
        <path d="M10 9.5C10 9.36739 10.0527 9.24021 10.1464 9.14645C10.2402 9.05268 10.3674 9 10.5 9H13.5C13.6326 9 13.7598 9.05268 13.8536 9.14645C13.9473 9.24021 14 9.36739 14 9.5C14 9.63261 13.9473 9.75979 13.8536 9.85355C13.7598 9.94732 13.6326 10 13.5 10H10.5C10.3674 10 10.2402 9.94732 10.1464 9.85355C10.0527 9.75979 10 9.63261 10 9.5ZM10 11.5C10 11.3674 10.0527 11.2402 10.1464 11.1464C10.2402 11.0527 10.3674 11 10.5 11H13.5C13.6326 11 13.7598 11.0527 13.8536 11.1464C13.9473 11.2402 14 11.3674 14 11.5C14 11.6326 13.9473 11.7598 13.8536 11.8536C13.7598 11.9473 13.6326 12 13.5 12H10.5C10.3674 12 10.2402 11.9473 10.1464 11.8536C10.0527 11.7598 10 11.6326 10 11.5ZM10 13.5C10 13.3674 10.0527 13.2402 10.1464 13.1464C10.2402 13.0527 10.3674 13 10.5 13H12.5C12.6326 13 12.7598 13.0527 12.8536 13.1464C12.9473 13.2402 13 13.3674 13 13.5C13 13.6326 12.9473 13.7598 12.8536 13.8536C12.7598 13.9473 12.6326 14 12.5 14H10.5C10.3674 14 10.2402 13.9473 10.1464 13.8536C10.0527 13.7598 10 13.6326 10 13.5Z" fill="currentColor"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M9 3.0004C9 3.26562 8.89464 3.51997 8.70711 3.70751C8.51957 3.89504 8.26522 4.0004 8 4.0004H4C3.73478 4.0004 3.48043 3.89504 3.29289 3.70751C3.10536 3.51997 3 3.26562 3 3.0004H2C1.73478 3.0004 1.48043 3.10576 1.29289 3.29329C1.10536 3.48083 1 3.73518 1 4.0004V13.0004C1 13.2656 1.10536 13.52 1.29289 13.7075C1.48043 13.895 1.73478 14.0004 2 14.0004H7V15.0004H2C0.9 15.0004 0 14.1054 0 13.0004V4.0004C0 2.9004 0.895 2.0004 2 2.0004H3C3 1.73518 3.10536 1.48083 3.29289 1.29329C3.48043 1.10576 3.73478 1.0004 4 1.0004H4.268C4.4434 0.696816 4.69561 0.444734 4.99928 0.269475C5.30295 0.0942164 5.64739 0.00195313 5.998 0.00195312C6.34861 0.00195313 6.69306 0.0942164 6.99672 0.269475C7.30039 0.444734 7.5526 0.696816 7.728 1.0004H7.996C8.26122 1.0004 8.51557 1.10576 8.70311 1.29329C8.89064 1.48083 8.996 1.73518 8.996 2.0004H9.996C11.096 2.0004 11.996 2.8954 11.996 4.0004V6.0004H10.996V4.0004C10.996 3.73518 10.8906 3.48083 10.7031 3.29329C10.5156 3.10576 10.2612 3.0004 9.996 3.0004H8.996H9ZM4.27 2.0004C4.44543 2.0005 4.61781 1.95444 4.76981 1.86685C4.92182 1.77927 5.04811 1.65323 5.136 1.5014C5.22364 1.34892 5.34993 1.22226 5.50215 1.13417C5.65438 1.04609 5.82713 0.999709 6.003 0.999709C6.17887 0.999709 6.35163 1.04609 6.50385 1.13417C6.65606 1.22226 6.78236 1.34892 6.87 1.5014C6.95789 1.65323 7.08418 1.77927 7.23619 1.86685C7.38819 1.95444 7.56057 2.0005 7.736 2.0004H7.754C7.8203 2.0004 7.88389 2.02674 7.93078 2.07362C7.97766 2.12051 8.004 2.1841 8.004 2.2504V2.7504C8.004 2.81671 7.97766 2.88029 7.93078 2.92718C7.88389 2.97406 7.8203 3.0004 7.754 3.0004H4.254C4.1877 3.0004 4.12411 2.97406 4.07722 2.92718C4.03034 2.88029 4.004 2.81671 4.004 2.7504V2.2504C4.004 2.1841 4.03034 2.12051 4.07722 2.07362C4.12411 2.02674 4.1877 2.0004 4.254 2.0004H4.27Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="paste-clip">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function CopyDocumentIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M21 8.94C20.9897 8.84812 20.9695 8.75761 20.94 8.67V8.58C20.893 8.47655 20.8288 8.38186 20.75 8.3L14.75 2.3C14.6681 2.22122 14.5734 2.15697 14.47 2.11C14.4402 2.10547 14.4098 2.10547 14.38 2.11C14.2782 2.05222 14.1661 2.01486 14.05 2H10C9.20435 2 8.44129 2.31607 7.87868 2.87868C7.31607 3.44129 7 4.20435 7 5V6H6C5.20435 6 4.44129 6.31607 3.87868 6.87868C3.31607 7.44129 3 8.20435 3 9V19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H14C14.7956 22 15.5587 21.6839 16.1213 21.1213C16.6839 20.5587 17 19.7956 17 19V18H18C18.7956 18 19.5587 17.6839 20.1213 17.1213C20.6839 16.5587 21 15.7956 21 15V8.94ZM15 5.41L17.59 8H16C15.7348 8 15.4804 7.89464 15.2929 7.70711C15.1054 7.51957 15 7.26522 15 7V5.41ZM15 19C15 19.2652 14.8946 19.5196 14.7071 19.7071C14.5196 19.8946 14.2652 20 14 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V9C5 8.73478 5.10536 8.48043 5.29289 8.29289C5.48043 8.10536 5.73478 8 6 8H7V15C7 15.7956 7.31607 16.5587 7.87868 17.1213C8.44129 17.6839 9.20435 18 10 18H15V19ZM19 15C19 15.2652 18.8946 15.5196 18.7071 15.7071C18.5196 15.8946 18.2652 16 18 16H10C9.73478 16 9.48043 15.8946 9.29289 15.7071C9.10536 15.5196 9 15.2652 9 15V5C9 4.73478 9.10536 4.48043 9.29289 4.29289C9.48043 4.10536 9.73478 4 10 4H13V7C13 7.79565 13.3161 8.55871 13.8787 9.12132C14.4413 9.68393 15.2044 10 16 10H19V15Z" fill="currentColor"/>
    </svg>
  );
}

export function DeleteIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M4.687 6.21359L6.8 18.9766C6.89665 19.5609 7.19759 20.0919 7.6492 20.475C8.10081 20.8581 8.67377 21.0685 9.266 21.0686H12.614M19.312 6.21359L17.2 18.9766C17.1033 19.5609 16.8024 20.0919 16.3508 20.475C15.8992 20.8581 15.3262 21.0685 14.734 21.0686H11.386M10.022 11.1166V16.1656M13.978 11.1166V16.1656M2.75 6.21359H21.25M14.777 6.21359V4.43359C14.777 4.03577 14.619 3.65424 14.3377 3.37293C14.0564 3.09163 13.6748 2.93359 13.277 2.93359H10.723C10.3252 2.93359 9.94364 3.09163 9.66234 3.37293C9.38104 3.65424 9.223 4.03577 9.223 4.43359V6.21359H14.777Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ThreeDotsIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2ZM12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4ZM12 15C12.3978 15 12.7794 15.158 13.0607 15.4393C13.342 15.7206 13.5 16.1022 13.5 16.5C13.5 16.8978 13.342 17.2794 13.0607 17.5607C12.7794 17.842 12.3978 18 12 18C11.6022 18 11.2206 17.842 10.9393 17.5607C10.658 17.2794 10.5 16.8978 10.5 16.5C10.5 16.1022 10.658 15.7206 10.9393 15.4393C11.2206 15.158 11.6022 15 12 15ZM12 10.5C12.3978 10.5 12.7794 10.658 13.0607 10.9393C13.342 11.2206 13.5 11.6022 13.5 12C13.5 12.3978 13.342 12.7794 13.0607 13.0607C12.7794 13.342 12.3978 13.5 12 13.5C11.6022 13.5 11.2206 13.342 10.9393 13.0607C10.658 12.7794 10.5 12.3978 10.5 12C10.5 11.6022 10.658 11.2206 10.9393 10.9393C11.2206 10.658 11.6022 10.5 12 10.5ZM12 6C12.3978 6 12.7794 6.15804 13.0607 6.43934C13.342 6.72064 13.5 7.10218 13.5 7.5C13.5 7.89782 13.342 8.27936 13.0607 8.56066C12.7794 8.84196 12.3978 9 12 9C11.6022 9 11.2206 8.84196 10.9393 8.56066C10.658 8.27936 10.5 7.89782 10.5 7.5C10.5 7.10218 10.658 6.72064 10.9393 6.43934C11.2206 6.15804 11.6022 6 12 6Z" fill="currentColor"/>
    </svg>
  );
}

export function ArrowUpRightIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <line x1="7" y1="17" x2="17" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <polyline points="7 7 17 7 17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function DownloadExcelIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M2 6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H9C9.26519 4.00006 9.51951 4.10545 9.707 4.293L11.414 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V6ZM8.586 6H4V18H20V8H11C10.7348 7.99994 10.4805 7.89455 10.293 7.707L8.586 6ZM12 9.5C12.2652 9.5 12.5196 9.60536 12.7071 9.79289C12.8946 9.98043 13 10.2348 13 10.5V13.086L13.293 12.793C13.4816 12.6108 13.7342 12.51 13.9964 12.5123C14.2586 12.5146 14.5094 12.6198 14.6948 12.8052C14.8802 12.9906 14.9854 13.2414 14.9877 13.5036C14.99 13.7658 14.8892 14.0184 14.707 14.207L12.707 16.207C12.5195 16.3945 12.2652 16.4998 12 16.4998C11.7348 16.4998 11.4805 16.3945 11.293 16.207L9.293 14.207C9.19749 14.1148 9.12131 14.0044 9.0689 13.8824C9.01649 13.7604 8.9889 13.6292 8.98775 13.4964C8.9866 13.3636 9.0119 13.2319 9.06218 13.109C9.11246 12.9861 9.18671 12.8745 9.28061 12.7806C9.3745 12.6867 9.48615 12.6125 9.60905 12.5622C9.73194 12.5119 9.86362 12.4866 9.9964 12.4877C10.1292 12.4889 10.2604 12.5165 10.3824 12.5689C10.5044 12.6213 10.6148 12.6975 10.707 12.793L11 13.086V10.5C11 10.2348 11.1054 9.98043 11.2929 9.79289C11.4804 9.60536 11.7348 9.5 12 9.5Z" fill="currentColor"/>
    </svg>
  );
}

export function DownloadIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path d="M17 9.00195C19.175 9.01395 20.353 9.11095 21.121 9.87895C22 10.758 22 12.172 22 15V16C22 18.829 22 20.243 21.121 21.122C20.243 22 18.828 22 16 22H8C5.172 22 3.757 22 2.879 21.122C2 20.242 2 18.829 2 16V15C2 12.172 2 10.758 2.879 9.87895C3.647 9.11095 4.825 9.01395 7 9.00195" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 2V15M15 11.5L12 15L9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function UploadIcon({ className, ...props }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M21.5066 15.1099V15.2399C21.5066 19.7099 19.7166 21.4999 15.2466 21.4999H8.73656C4.26656 21.4999 2.47656 19.7099 2.47656 15.2399V15.1099" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 15.0001V3.62012" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.3484 5.85L11.9984 2.5L8.64844 5.85" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}