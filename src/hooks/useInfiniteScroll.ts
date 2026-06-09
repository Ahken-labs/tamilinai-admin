import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to the returned ref.
 * Calls onLoadMore when the sentinel element scrolls into view.
 * Pass enabled=false to pause (while loading or no more pages).
 */
export function useInfiniteScroll(
  onLoadMore: () => void,
  enabled: boolean
) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onLoadMore(); },
      { rootMargin: "0px 0px 250px 0px" } // fires ~250px before the sentinel is visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onLoadMore, enabled]);

  return sentinelRef;
}
