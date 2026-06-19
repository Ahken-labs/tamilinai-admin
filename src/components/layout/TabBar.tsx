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

export default function TabBar({ tabs, active, onChange, className = "" }: Props) {
  return (
    <div className={`overflow-x-auto tab-scrollbar pb-1.5 ${className}`}>
      <div className="inline-flex select-none items-center gap-2 py-1.5 px-1.5 rounded-[44px] bg-white min-w-max">
        {tabs.map(({ key, label, shortLabel, icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`mx-auto py-1 min-w-[72px] rounded-full max-[500px]:text-[12px] text-[14px] md:text-[16px] font-medium leading-none
                touch-manipulation whitespace-nowrap cursor-pointer
                transition-all duration-200 ease-in-out ${
                isActive
                  ? "bg-[#222222] text-white"
                  : "text-[#222222] hover:bg-[#F0F0F0]"
              }`}
            >
              <span className="flex mx-auto max-[500px]:px-2 px-4 max-[500px]:py-1 py-1.5 items-center text-center gap-1.5">
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
