"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminNotifications, sendAdminNotification, getNotificationHistory, deleteNotificationBatch } from "@/lib/api";
import type { AdminNotification, NotificationHistoryEntry } from "@/lib/api";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import Popup from "@/components/Popup";
import TabBar from "@/components/TabBar";
import SubTabBar from "@/components/SubTabBar";
import { useToast } from "@/components/Toast";
import { PasteIcon, ThreeDotsIcon, DeleteIcon } from "@/assets/Icons";
import Button from "@/components/Button";

function formatDateTime(d: string): string {
  return new Date(d).toLocaleString("en-US", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
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

type PageTab = "send" | "events" | "history";



function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4V9H4.582M19.938 11C19.469 7.054 16.116 4 12 4C8.707 4 5.853 5.966 4.582 9M4.582 9H9M20 20V15H19.418M19.418 15C18.147 18.034 15.293 20 12 20C7.884 20 4.531 16.946 4.062 13M19.418 15H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

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

  // ── Send History ───────────────────────────────────────────────────────────
  const [history, setHistory]           = useState<NotificationHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [deletingBatch, setDeletingBatch] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<NotificationHistoryEntry | null>(null);
  const [historyMenuOpen, setHistoryMenuOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const historyFetched = useRef(false);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError("");
    try {
      const res = await getNotificationHistory(1);
      setHistory(res.history);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : "Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "history" && !historyFetched.current) {
      historyFetched.current = true;
      fetchHistory();
    }
  }, [tab, fetchHistory]);

  async function handleDeleteBatch() {
    if (!deleteConfirm) return;
    const { batchId } = deleteConfirm;
    setDeleteConfirm(null);
    setDeletingBatch(batchId);
    try {
      await deleteNotificationBatch(batchId);
      setHistory((prev) => prev.filter((h) => h.batchId !== batchId));
      toast({ type: "success", title: "Notification deleted", message: "Removed from all recipients." });
    } catch (err) {
      toast({ type: "error", title: "Delete failed", message: err instanceof Error ? err.message : "Failed to delete" });
    } finally {
      setDeletingBatch(null);
    }
  }

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
      <div className="flex items-start justify-between">
        <h1 className="text-[20px] sm:text-[22px] font-bold text-[#0A0A0A]">Notifications</h1>
        {tab === "history" && (
          <div className="relative">
            {deleteMode ? (
              <Button sub secondary text="Done" onPress={() => setDeleteMode(false)}/>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setHistoryMenuOpen((p) => !p)}
                  className="cursor-pointer text-[#222222] hover:text-[#B31B38] transition-colors"
                >
                  <ThreeDotsIcon className="w-6 sm:w-8 h-6 sm:h-8"/>
                </button>
                {historyMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setHistoryMenuOpen(false)} />
                    <div className="absolute right-0 top-9 z-20 w-36 bg-white border border-[#EEEEEE] rounded-xl shadow-lg py-1 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => { setHistoryMenuOpen(false); fetchHistory(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[14px] md:text-[16px] text-[#222] hover:bg-[#F5F5F5] transition-colors"
                      >
                        <RefreshIcon />
                        Refresh
                      </button>
                      <div className="mx-3 border-t border-[#F0F0F0]" />
                      <button
                        type="button"
                        onClick={() => { setHistoryMenuOpen(false); setDeleteMode(true); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[14px] md:text-[16px] text-[#B31B38] hover:bg-[#FFF0F3] transition-colors"
                      >
                        <DeleteIcon />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Tab toggle */}
      <TabBar
        tabs={[
          { key: "send",    label: "Send Notification" },
          { key: "history", label: "Send History" },
          { key: "events",  label: "System Events" },
        ]}
        active={tab}
        onChange={(k) => setTab(k as PageTab)}
      />

      {/* ── Send tab ───────────────────────────────────────────────────────── */}
      {tab === "send" && (
        <div className="bg-white rounded-2xl border border-[#EEEEEE] p-5 sm:p-6 max-w-xl">
          <div className="justify-center flex">
          <SubTabBar
            tabs={[
              { key: "specific",  label: "Specific user" },
              { key: "broadcast", label: "Broadcast" },
            ]}
            active={mode}
            onChange={(m) => { setMode(m as Mode); setSendError(""); }}
            className="mb-5"
          />
          </div>

          <div className="space-y-0">
            {mode === "specific" && (
              <div className="flex flex-col gap-1 md:gap-2">
                <label className="text-[14px] md:text-[16px] font-medium text-[#555]">User ID</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={targetUserId}
                    onChange={(e) => setTargetId(e.target.value)}
                    placeholder="Paste the user's UUID"
                    className="w-full border border-[#E6E6E6] rounded-xl px-4 py-2.5 pr-10 text-sm text-[#222]
                      placeholder:text-[#AAAAAA] outline-none focus:border-[#B31B38] transition-colors bg-white"
                  />
                  <button
                    type="button"
                    title="Paste from clipboard"
                    onClick={async () => {
                      const text = await navigator.clipboard.readText();
                      setTargetId(text.trim());
                    }}
                    className="absolute right-3 text-[#AAAAAA] hover:text-[#B31B38] transition-colors"
                  >
                    <PasteIcon className="w-4 h-4 text-[#222] hover:text-[#B31B38] cursor-pointer" />
                  </button>
                </div>
              </div>
            )}

            {mode === "broadcast" && (
              <div className="px-3 py-2.5 bg-[#FFF0F3] border border-[#B31B38] rounded-xl text-[12px] md:text-[14px] text-[#B31B38]">
                Sends to <strong>all active users</strong>. Use for announcements, wishes, updates.
              </div>
            )}

            <div className="mt-4 flex flex-col gap-1 md:gap-2">
              <label className="text-[14px] md:text-[16px] font-medium text-[#555]">Title <span className="text-[#B31B38]">*</span></label>
              <input
                ref={titleRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                placeholder="e.g. Happy New Year 🎉"
                className="border border-[#E6E6E6] rounded-xl px-4 py-2.5 text-[12px] md:text-[14px] text-[#222]
                  placeholder:text-[#AAAAAA] outline-none focus:border-[#B31B38] transition-colors bg-white"
              />
            </div>

            <div className="mt-4 flex flex-col gap-1 md:gap-2">
              <label className="text-[14px] md:text-[16px] font-medium text-[#222]">
                Message <span className="text-[#222] font-normal">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Optional body text…"
                className="border border-[#E6E6E6] rounded-xl px-4 py-2.5 text-[12px] md:text-[14px] text-[#222]
                  placeholder:text-[#AAAAAA] outline-none focus:border-[#B31B38] transition-colors bg-white resize-none"
              />
            </div>

            {sendError && <p className="text-[12px] md:text-[14px] text-[#B31B38]">*{sendError}</p>}

            <button
              type="button"
              disabled={sending}
              onClick={openConfirm}
              className="mt-6 w-full py-2.5 bg-[#B31B38] text-white text-[14px] md:text-[16px] font-semibold rounded-xl
                hover:bg-[#9A1730] disabled:opacity-40 transition-colors"
            >
              {sending ? "Sending…" : mode === "broadcast" ? "Send to all users" : "Send notification"}
            </button>
          </div>
        </div>
      )}

      {/* ── Send History tab ───────────────────────────────────────────────── */}
      {tab === "history" && (
        <div>

          {historyError && (
            <div className="mb-4 px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-[14px] text-[#B31B38]">{historyError}</div>
          )}

          <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
            {historyLoading ? (
              <SkeletonRows count={6} />
            ) : history.length === 0 ? (
              <div className="px-5 py-16 text-center text-[14px] text-[#888]">No notifications sent yet.</div>
            ) : (
              history.map((h) => (
                <div key={h.batchId} className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[#F5F5F5] last:border-0">
                  <div className="flex-1 min-w-0 space-y-1">
                    {/* Row 1: badge + recipient */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[12px] font-semibold shrink-0 ${h.mode === "broadcast" ? "bg-[#FFF0F3] text-[#B31B38]" : "bg-[#EFF6FF] text-[#1D4ED8]"}`}>
                        {h.mode === "broadcast" ? `Broadcast · ${h.recipientCount} users` : "Specific"}
                      </span>
                      {h.targetUser && (
                        <span className="text-[14px] md:text-[16px] font-semibold text-[#222]">
                          {h.targetUser.name}
                          {h.targetUser.displayId && <span className="text-[#888] font-normal ml-3">({h.targetUser.displayId})</span>}
                        </span>
                      )}
                    </div>
                    {/* Row 2: title */}
                    <p className="mt-2 text-[14px] md:text-[16px] font-semibold text-[#222]">Title: {h.title}</p>
                    {/* Row 3: message (full, no truncation) */}
                    {h.message && <p className="mt-1.5 text-[14px] md:text-[16px] text-[#555] leading-[1.5]">Message: {h.message}</p>}
                    {/* Row 4: date */}
                    <p className="mt-2 text-[14px] md:text-[16px] text-[#888]">{formatDateTime(h.sentAt)}</p>
                  </div>
                  {deleteMode && (
                    <button
                      type="button"
                      disabled={deletingBatch === h.batchId}
                      onClick={() => setDeleteConfirm(h)}
                      className="cursor-pointer shrink-0 p-2 rounded-xl text-[#B31B38] hover:text-[#B31B38] hover:bg-[#FFF0F3] transition-colors disabled:opacity-40"
                    >
                      <DeleteIcon className="w-4.5 sm:w-5 h-4.5 sm:h-5"/>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── System Events tab ──────────────────────────────────────────────── */}
      {tab === "events" && (
        <div>
          {fetchError && (
            <div className="mb-4 px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-[14px] md:text-[16px] text-[#B31B38]">
              {fetchError}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
            {loading ? (
              <SkeletonRows count={8} />
            ) : notifications.length === 0 ? (
              <div className="px-5 py-16 text-center text-[14px] md:text-[16px] text-[#888]">No system events yet.</div>
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

      <Popup
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete this notification?"
        subtitle={`"${deleteConfirm?.title}" will be removed from ${deleteConfirm?.mode === "broadcast" ? `all ${deleteConfirm.recipientCount} recipients` : "the recipient"}'s notification feed.`}
        buttons={[
          { label: "Cancel", onClick: () => setDeleteConfirm(null), variant: "secondary" },
          { label: "Yes, delete", onClick: handleDeleteBatch, variant: "danger" },
        ]}
      />
    </div>
  );
}
