"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminNotifications, sendAdminNotification } from "@/lib/api";
import type { AdminNotification } from "@/lib/api";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import Popup from "@/components/Popup";
import { useToast } from "@/components/Toast";

function formatDateTime(d: string): string {
  return new Date(d).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function typeLabel(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function typeColor(type: string): string {
  if (type.includes("refund"))          return "bg-[#FFF8E1] text-[#E65100]";
  if (type.includes("limit"))           return "bg-[#FFF0F3] text-[#B31B38]";
  if (type.includes("flagged"))         return "bg-[#FFF0F3] text-[#B31B38]";
  if (type.includes("elite"))           return "bg-[#FFF8E1] text-[#E65100]";
  if (type.includes("admin_broadcast")) return "bg-[#EFF6FF] text-[#1D4ED8]";
  return "bg-[#F2F2F2] text-[#6B6B6B]";
}

function SkeletonRows({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 p-5 border-b border-[#F5F5F5] animate-pulse">
          <div className="w-2 h-2 rounded-full bg-[#F2F2F2] mt-1.5 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-[#F2F2F2] rounded w-32" />
            <div className="h-4 bg-[#F2F2F2] rounded w-3/4" />
          </div>
          <div className="h-3 bg-[#F2F2F2] rounded w-28 shrink-0" />
        </div>
      ))}
    </>
  );
}

type Mode = "specific" | "broadcast";

type PageTab = "send" | "events";

export default function NotificationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = useState<PageTab>("send");

  // ── Inbox ──────────────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading]             = useState(true);
  const [loadingMore, setLoadingMore]     = useState(false);
  const [page, setPage]                   = useState(1);
  const [hasMore, setHasMore]             = useState(false);
  const [fetchError, setFetchError]       = useState("");

  const fetchNotifs = useCallback(async (pg: number, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);
    setFetchError("");
    try {
      const res = await getAdminNotifications(pg);
      setNotifications((prev) => append ? [...prev, ...res.notifications] : res.notifications);
      setHasMore(res.hasMore);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load notifications");
    } finally {
      if (append) setLoadingMore(false); else setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifs(1, false); }, [fetchNotifs]);

  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchNotifs(next, true);
  }, [loading, loadingMore, hasMore, page, fetchNotifs]);

  const sentinelRef = useInfiniteScroll(handleLoadMore, hasMore && !loading && !loadingMore);

  // ── Compose ────────────────────────────────────────────────────────────────
  const [mode, setMode]               = useState<Mode>("specific");
  const [targetUserId, setTargetId]   = useState("");
  const [title, setTitle]             = useState("");
  const [message, setMessage]         = useState("");
  const [sending, setSending]         = useState(false);
  const [sendError, setSendError]     = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  function openConfirm() {
    setSendError("");
    if (!title.trim()) { setSendError("Title is required."); return; }
    if (mode === "specific" && !targetUserId.trim()) { setSendError("User ID is required."); return; }
    setConfirmOpen(true);
  }

  async function handleSend() {
    setConfirmOpen(false);
    setSending(true);
    setSendError("");
    try {
      const payload =
        mode === "broadcast"
          ? { broadcast: true, title: title.trim(), message: message.trim() || undefined }
          : { userId: targetUserId.trim(), title: title.trim(), message: message.trim() || undefined };

      const res = await sendAdminNotification(payload);
      setTitle("");
      setMessage("");
      setTargetId("");
      titleRef.current?.focus();
      toast({
        type: "success",
        title: mode === "broadcast" ? "Broadcast sent" : "Notification sent",
        message: mode === "broadcast" && res.count != null ? `Delivered to ${res.count} user${res.count === 1 ? "" : "s"}.` : undefined,
      });
      // Refresh inbox
      setPage(1);
      fetchNotifs(1, false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send notification";
      setSendError(msg);
      toast({ type: "error", title: "Failed to send", message: msg });
    } finally {
      setSending(false);
    }
  }

  const confirmTitle = mode === "broadcast"
    ? "Send broadcast to all users?"
    : "Send notification?";
  const confirmSubtitle = mode === "broadcast"
    ? `"${title}" will be sent to every active user on the platform.`
    : `"${title}" will be sent to user ${targetUserId}.`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[20px] sm:text-[22px] font-bold text-[#0A0A0A]">Notifications</h1>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 bg-[#F2F2F2] rounded-xl p-1 w-fit">
        {([["send", "Send Notification"], ["events", "System Events"]] as [PageTab, string][]).map(([t, label]) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors touch-manipulation ${
              tab === t ? "bg-white text-[#0A0A0A] shadow-sm" : "text-[#6B6B6B] hover:text-[#222]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Send tab ───────────────────────────────────────────────────────── */}
      {tab === "send" && (
        <div className="bg-white rounded-2xl border border-[#EEEEEE] p-5 sm:p-6 max-w-xl">
          <div className="flex gap-1 bg-[#F2F2F2] rounded-xl p-1 mb-5">
            {(["specific", "broadcast"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setSendError(""); }}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                  mode === m ? "bg-white text-[#0A0A0A] shadow-sm" : "text-[#6B6B6B] hover:text-[#222]"
                }`}
              >
                {m === "specific" ? "Specific user" : "Broadcast"}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {mode === "specific" && (
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-[#555]">User ID</label>
                <input
                  type="text"
                  value={targetUserId}
                  onChange={(e) => setTargetId(e.target.value)}
                  placeholder="Paste the user's UUID"
                  className="border border-[#E6E6E6] rounded-xl px-4 py-2.5 text-sm text-[#222]
                    placeholder:text-[#AAAAAA] outline-none focus:border-[#B31B38] transition-colors bg-white"
                />
                <p className="text-[11px] text-[#AAAAAA]">Copy the ID from the user detail page.</p>
              </div>
            )}

            {mode === "broadcast" && (
              <div className="px-3 py-2.5 bg-[#FFF0F3] border border-[#B31B38] rounded-xl text-[12px] text-[#B31B38]">
                Sends to <strong>all active users</strong>. Use for announcements, wishes, updates.
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-[#555]">Title <span className="text-[#B31B38]">*</span></label>
              <input
                ref={titleRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                placeholder="e.g. Happy New Year 🎉"
                className="border border-[#E6E6E6] rounded-xl px-4 py-2.5 text-sm text-[#222]
                  placeholder:text-[#AAAAAA] outline-none focus:border-[#B31B38] transition-colors bg-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-[#555]">
                Message <span className="text-[#AAAAAA] font-normal">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Optional body text…"
                className="border border-[#E6E6E6] rounded-xl px-4 py-2.5 text-sm text-[#222]
                  placeholder:text-[#AAAAAA] outline-none focus:border-[#B31B38] transition-colors bg-white resize-none"
              />
            </div>

            {sendError && <p className="text-[12px] text-[#B31B38]">{sendError}</p>}

            <button
              type="button"
              disabled={sending}
              onClick={openConfirm}
              className="w-full py-2.5 bg-[#B31B38] text-white text-sm font-semibold rounded-xl
                hover:bg-[#9A1730] disabled:opacity-40 transition-colors"
            >
              {sending ? "Sending…" : mode === "broadcast" ? "Send to all users" : "Send notification"}
            </button>
          </div>
        </div>
      )}

      {/* ── System Events tab ──────────────────────────────────────────────── */}
      {tab === "events" && (
        <div>
          {fetchError && (
            <div className="mb-4 px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-sm text-[#B31B38]">
              {fetchError}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
            {loading ? (
              <SkeletonRows count={8} />
            ) : notifications.length === 0 ? (
              <div className="px-5 py-16 text-center text-sm text-[#888]">No system events yet.</div>
            ) : (
              <>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-4 px-5 py-4 border-b border-[#F5F5F5] transition-colors
                      ${n.userId ? "cursor-pointer hover:bg-[#FAFAFA]" : ""}
                      ${!n.isRead ? "bg-[#FFFBF8]" : ""}`}
                    onClick={() => n.userId && router.push(`/users/${n.userId}`)}
                  >
                    <div className="mt-1.5 shrink-0">
                      {!n.isRead
                        ? <div className="w-2 h-2 rounded-full bg-[#B31B38]" />
                        : <div className="w-2 h-2 rounded-full bg-transparent" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${typeColor(n.type)}`}>
                          {typeLabel(n.type)}
                        </span>
                        {n.userName && (
                          <span className="text-[12px] font-semibold text-[#0A0A0A]">
                            {n.userName}
                            {n.displayId && <span className="text-[#888] font-normal ml-1">({n.displayId})</span>}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#333] leading-[1.5]">{n.message}</p>
                    </div>
                    <span className="text-[11px] text-[#AAAAAA] shrink-0 mt-0.5 whitespace-nowrap">
                      {formatDateTime(n.createdAt)}
                    </span>
                  </div>
                ))}
                {loadingMore && <SkeletonRows count={3} />}
              </>
            )}
          </div>

          <div ref={sentinelRef} className="h-1" />
          {!hasMore && notifications.length > 0 && (
            <p className="text-center text-[12px] text-[#CCCCCC] mt-4">All events loaded</p>
          )}
        </div>
      )}

      <Popup
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={confirmTitle}
        subtitle={confirmSubtitle}
        buttons={[
          { label: "Cancel", onClick: () => setConfirmOpen(false), variant: "secondary" },
          { label: "Send",   onClick: handleSend,                  variant: mode === "broadcast" ? "danger" : "primary" },
        ]}
      />
    </div>
  );
}
