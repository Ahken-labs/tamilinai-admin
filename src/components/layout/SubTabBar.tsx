"use client";

type TabDef = {
  key: string;
  label: string;
  shortLabel?: string;
  icon?: React.ReactNode;
};

type Props = {
  tabs: TabDef[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
};

export default function SubTabBar({ tabs, active, onChange, className = "" }: Props) {
  return (
    <div className={`overflow-x-auto tab-scrollbar pb-1.5 ${className}`}>
      <div className="inline-flex select-none items-center gap-2 py-1.5 px-1.5 rounded-[44px] bg-[#222222] min-w-max">
        {tabs.map(({ key, label, shortLabel, icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`touch-manipulation whitespace-nowrap cursor-pointer rounded-full
                transition-all duration-200 ease-in-out
                max-[500px]:text-[12px] text-[14px] md:text-[16px] font-medium leading-none
                ${isActive
                  ? "bg-white text-[#0A0A0A]"
                  : "text-white hover:bg-white/15"
                }`}
            >
              <span className="flex items-center justify-center gap-1.5 max-[500px]:px-3 px-4 max-[500px]:py-1.5 py-2">
                {shortLabel ? (
                  <>
                    <span className="sm:hidden">{shortLabel}</span>
                    <span className="hidden sm:inline">{label}</span>
                  </>
                ) : label}
                {icon}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
