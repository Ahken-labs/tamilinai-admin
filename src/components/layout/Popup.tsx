"use client";

export interface PopupButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

interface PopupProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  buttons: PopupButton[];
}

const BUTTON_STYLES: Record<NonNullable<PopupButton["variant"]>, string> = {
  primary:   "bg-[#B31B38] text-white hover:bg-[#9A1730] active:bg-[#7A1028]",
  danger:    "bg-[#B31B38] text-white hover:bg-[#9A1730] active:bg-[#7A1028]",
  secondary: "border border-[#E0E0E0] text-[#222222] hover:bg-[#F5F5F5]",
};

export default function Popup({ open, onClose, title, subtitle, children, buttons }: PopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-[340px] rounded-[20px] bg-white p-6
        shadow-[0_16px_60px_rgba(0,0,0,0.18)]">
        <p className="text-[14px] md:text-[16px] font-semibold text-[#0A0A0A] leading-snug">
          {title}
        </p>
        {subtitle && (
          <p className="mt-2 text-[12px] md:text-[14px] text-[#6B6B6B] leading-[1.6]">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex gap-3">
          {buttons.map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={btn.onClick}
              disabled={btn.disabled}
              className={`flex-1 rounded-[12px] py-2.5 text-[14px] md:text-[16px] font-medium
                transition-colors duration-150 cursor-pointer
                disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-[#525252] disabled:text-white
                ${BUTTON_STYLES[btn.variant ?? "secondary"]}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
