"use client";

type ButtonProps = {
    text: string;
    onPress?: () => void;
    className?: string;
    type?: "button" | "submit";
    icon?: React.ReactNode;
    iconLeft?: React.ReactNode;
    disabled?: boolean;
    secondary?: boolean;
    sub?: boolean;
    white?: boolean;
    pink?: boolean;
};

export default function Button({
    text,
    onPress,
    className = "",
    type = "button",
    icon,
    iconLeft,
    disabled = false,
    secondary = false,
    sub = false,
    white = false,
    pink = false,
}: ButtonProps) {
    let base: string;

    if (pink) {
        base = `
            inline-flex items-center justify-center select-none cursor-pointer
            font-semibold text-[#B31B38]
            transition-all duration-150
            active:scale-[0.98]
            py-3 px-6
            rounded-xl
            text-[14px] md:text-[16px]
            bg-[#FFF0F3]
            hover:bg-[#FFE0E7]
            active:bg-[#FFE0E7]
            disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none
        `;
    } else if (white) {
        base = `
            inline-flex items-center justify-center select-none cursor-pointer
            font-semibold text-[#525252]
            transition-all duration-150
            active:scale-[0.98]
            py-3 px-6
            rounded-xl
            text-[14px] md:text-[16px]
            bg-white border border-[#E6E6E6]
            hover:bg-[#F2F2F2]
            active:bg-[#E8E8E8]
            disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none
        `;
    } else if (secondary && sub) {
        // Secondary sub — smaller, outlined
        base = `
            inline-flex items-center justify-center select-none cursor-pointer
            font-semibold text-[#B31B38]
            transition-all duration-150
            active:scale-[0.98]
            py-1 px-4 sm:px-6
            rounded-xl
            text-[14px] md:text-[16px]
            bg-white border border-[#B31B38]
            hover:bg-[#FFF0F3]
            active:bg-[#FFE0E7]
            disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none
        `;
    } else if (secondary) {
        // Secondary — full size,  outlined
        base = `
            inline-flex items-center justify-center select-none cursor-pointer
            font-semibold text-[#B31B38]
            transition-all duration-150
            active:scale-[0.98]
            py-3 px-6
            rounded-xl
            text-[14px] md:text-[16px]
            bg-white border border-[#B31B38]
            hover:bg-[#FFF0F3]
            active:bg-[#FFE0E7]
            disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none
        `;
    } else {
        // Primary — default red filled
        base = `
            inline-flex items-center justify-center select-none cursor-pointer
            font-semibold text-white
            transition-all duration-150
            active:scale-[0.98]
            py-3 px-6
            rounded-xl
            text-[14px] md:text-[16px]
            bg-[#B31B38]
            hover:bg-[#8E162D]
            active:bg-[#6F1023]
            disabled:bg-[#525252] disabled:cursor-not-allowed disabled:pointer-events-none
        `;
    }

    return (
        <button
            type={type}
            onClick={onPress}
            disabled={disabled}
            className={`${base} ${className}`}
        >
            {iconLeft && <span className="mr-2 flex items-center">{iconLeft}</span>}
            {text}
            {icon && <span className="ml-2 flex items-center">{icon}</span>}
        </button>
    );
}
