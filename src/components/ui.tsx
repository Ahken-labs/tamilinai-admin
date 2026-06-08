// Shared micro-components used across landing sections

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] font-bold tracking-[2.5px] uppercase text-[#B31B38] mb-2 sm:mb-3">
      {children}
    </p>
  );
}

export function HR() {
  return <div className="w-full h-px bg-[#F0F0F0]"/>;
}
