"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#F8F5F2] flex flex-col items-center justify-center px-4 text-center">
      <p className="font-poppins text-[18px] font-semibold text-[#222222]">Something went wrong</p>
      <p className="mt-2 font-poppins text-[14px] text-[#888888] max-w-[320px]">
        An unexpected error occurred. Try again or come back later.
      </p>
      <button
        onClick={reset}
        className="mt-6 px-6 py-3 rounded-full bg-[#B31B38] text-white font-poppins text-[14px] font-medium"
      >
        Try again
      </button>
    </div>
  );
}
