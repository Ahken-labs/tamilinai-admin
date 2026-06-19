"use client";

import { EliteCrownIcon, EliteProIcon, EliteVIPIcon,  } from "@/assets/Icons";

const BASE = "inline-flex items-center gap-1 px-2 py-[2.5px] rounded-full font-poppins font-medium leading-none text-[14px] sm:text-[15px] md:text-[16px]";

interface TagProps {
  className?: string;
}

// Elite basic 
export function EliteBasicTag({ className = "" }: TagProps) {
  return (
    <span className={`${BASE} ${className}`} style={{ background: "#FFDED3", color: "#725E4C" }}>
      <EliteCrownIcon className="max-[500px]:w-4 w-4.5 md:w-5 max-[500px]:h-4 h-4.5 md:h-5 shrink-0" fill="#725E4C" />
      Elite basic
    </span>
  );
}


// Elite pro 
export function EliteProTag({ className = "" }: TagProps) {
  return (
    <span className={`${BASE} ${className}`} style={{ background: "#FFDED3", color: "#B31B38" }}>
      <EliteProIcon className="max-[500px]:w-4 w-4.5 md:w-5 max-[500px]:h-4 h-4.5 md:h-5 shrink-0" fill="#B31B38" />
      Elite pro
    </span>
  );
}


// Elite VIP 
export function EliteMaxTag({ className = "" }: TagProps) {
  return (
    <span className={`${BASE} ${className}`} style={{ background: "#222222", color: "#FFDED3" }}>
      <EliteVIPIcon className="max-[500px]:w-4 w-4.5 md:w-5 max-[500px]:h-4 h-4.5 md:h-5 shrink-0" fill="#FFDED3" />
      Elite VIP
    </span>
  );
}


// New 
export function NewTag({ className = "" }: TagProps) {
  return (
    <span className={`${BASE} px-3 bg-[#D5ECFF] text-[#5D5D5D] ${className}`}>
      New
    </span>
  );
}


