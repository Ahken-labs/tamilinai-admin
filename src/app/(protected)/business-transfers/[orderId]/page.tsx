"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import {
  getBoostOrder,
  reviewBoostOrder,
  adminUploadBoostReceipt,
  downloadBoostReceiptBlob,
} from "@/lib/api";
import type { AdminBoostOrder } from "@/lib/api";
import { BackArrowIcon, DownloadIcon, ThreeDotsIcon, UploadIcon } from "@/assets/Icons";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/layout/Button";
import { generateBoostInvoicePDF } from "@/lib/generateInvoicePDF";

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtLkr(amount: number) {
  return `Rs ${Math.round(amount).toLocaleString("en-LK")}`;
}

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function fmtDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function fmtFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") return <span className="px-3 py-0.5 rounded-full bg-[#F0FDF4] text-[#2E7D32] text-[14px] font-semibold">Approved</span>;
  if (status === "rejected") return <span className="px-3 py-0.5 rounded-full bg-[#FFF0F3] text-[#B31B38] text-[14px] font-semibold">Rejected</span>;
  return <span className="px-3 py-0.5 rounded-full bg-[#FFF8E1] text-[#E65100] text-[14px] font-semibold">Pending</span>;
}

// ── Receipt upload popup ───────────────────────────────────────────────────────

function AdminReceiptUploadPopup({
  currentReceiptUrl,
  orderId,
  onClose,
  onReplaced,
}: {
  currentReceiptUrl: string | null;
  orderId: string;
  onClose: () => void;
  onReplaced: (newPresignedUrl: string) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  async function handleUpload() {
    if (!selectedFile) return;
    setUploading(true);
    setError("");
    try {
      const res = await adminUploadBoostReceipt(orderId, selectedFile);
      toast({ type: "success", title: "Receipt uploaded successfully" });
      onReplaced(res.receiptPresignedUrl);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4 bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget && !uploading) onClose(); }}
    >
      <div className="w-full sm:max-w-[520px] bg-white rounded-t-[20px] sm:rounded-[20px] px-5 sm:px-6 pt-5 sm:pt-6 pb-8 sm:pb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] md:text-[16px] font-semibold text-[#0A0A0A]">
            {currentReceiptUrl ? "Replace receipt" : "Upload receipt"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F2F2] hover:bg-[#E0E0E0] disabled:opacity-40 transition-colors"
            aria-label="Close"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M13 1L1 13M1 1L13 13" stroke="#222222" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {currentReceiptUrl && (
          <a
            href={currentReceiptUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between mb-4 px-4 py-2.5 rounded-xl border border-[#E6E6E6] text-[13px] text-[#B31B38] font-medium hover:bg-[#FFF0F3] transition-colors"
          >
            <span>View current receipt</span>
            <span className="text-[11px]">↗</span>
          </a>
        )}

        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-[#D8D8D8] bg-[#F2F2F2] px-4 py-7">
            <UploadIcon />
            <p className="mt-2.5 text-[14px] font-semibold text-[#222]">
              {currentReceiptUrl ? "Choose replacement file" : "Choose receipt file"}
            </p>
            <p className="mt-1 text-[12px] text-[#888] text-center">PDF, PNG or JPG · max 10 MB</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#B31B38] text-white text-[14px] font-semibold hover:bg-[#9A1730] transition-colors"
            >
              Choose file
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { setSelectedFile(f); setError(""); }
                e.target.value = "";
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-[16px] border border-[#E6E6E6] bg-[#F8F8F8] px-4 py-3">
            <div className="w-9 h-9 rounded-[8px] bg-white border border-[#E6E6E6] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#B31B38" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M14 2v6h6" stroke="#B31B38" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#0A0A0A] truncate">{selectedFile.name}</p>
              <p className="text-[12px] text-[#888]">{fmtFileSize(selectedFile.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="text-[#888] hover:text-[#B31B38] text-[12px] font-medium shrink-0 transition-colors"
            >
              Remove
            </button>
          </div>
        )}

        {error && (
          <p className="mt-2 text-[12px] text-[#B31B38] bg-[#FFF0F3] px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="mt-4 flex gap-2.5">
          {/* <button type="button" onClick={onClose} disabled={uploading}
            className="flex-1 py-2.5 rounded-xl border border-[#E0E0E0] text-[#222] text-[14px] font-medium hover:bg-[#F5F5F5] disabled:opacity-40 transition-colors">
            Cancel
          </button>
          <button type="button" disabled={!selectedFile || uploading} onClick={handleUpload}
            className="flex-1 py-2.5 rounded-xl bg-[#B31B38] text-white text-[14px] font-semibold hover:bg-[#9A1730] disabled:opacity-40 transition-colors">
            {uploading ? "Uploading…" : currentReceiptUrl ? "Replace receipt" : "Upload receipt"}
          </button> */}

          <Button white className="flex-1" text="Cancel" onPress={onClose} disabled={uploading} />
          <Button className="flex-1" text={uploading ? "Uploading…" : currentReceiptUrl ? "Replace receipt" : "Upload receipt"}
            onPress={handleUpload}
            disabled={!selectedFile || uploading}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Confirm password dialog ────────────────────────────────────────────────────

function ConfirmPasswordDialog({
  open, onClose, title, subtitle, confirmLabel, danger, submitting, onConfirm,
}: {
  open: boolean; onClose: () => void; title: string; subtitle: string;
  confirmLabel: string; danger?: boolean; submitting?: boolean;
  onConfirm: (password: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setPassword(""); setError(""); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  if (!open) return null;

  function handleConfirm() {
    if (!password.trim()) { setError("Password is required"); return; }
    setError("");
    onConfirm(password);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[400px] rounded-[20px] bg-white p-6 shadow-[0_16px_60px_rgba(0,0,0,0.18)]">
        <p className="text-[15px] font-semibold text-[#0A0A0A] leading-snug">{title}</p>
        <p className="mt-1.5 text-[13px] text-[#6B6B6B] leading-[1.6]">{subtitle}</p>
        <div className="mt-4 space-y-1">
          <label className="text-[12px] text-[#888] font-medium">Admin password to confirm</label>
          <input
            ref={inputRef}
            type="password"
            placeholder="Enter your admin password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleConfirm(); if (e.key === "Escape") onClose(); }}
            className="w-full border border-[#E6E6E6] rounded-xl px-3 py-2 text-[13px] outline-none focus:border-[#B31B38] bg-white"
          />
          {error && <p className="text-[11px] text-[#B31B38]">{error}</p>}
        </div>
        <div className="mt-5 flex gap-3">
          <Button className="flex-1" disabled={submitting} onPress={onClose} white text="Cancel" />
          {/* <button type="button" onClick={handleConfirm} disabled={submitting || !password.trim()}
            className={`flex-1 rounded-[12px] py-2.5 text-[14px] font-medium transition-colors disabled:bg-[#525252] ${danger ? "bg-[#B31B38] text-white hover:bg-[#9A1730]" : "bg-[#2E7D32] text-white hover:bg-[#1B5E20]"}`}>
            {submitting ? "Processing…" : confirmLabel}
          </button> */}
          <Button className="flex-1" text={submitting ? "Processing…" : confirmLabel}
            onPress={handleConfirm} disabled={submitting || !password.trim()}
          />
        </div>
      </div>
    </div>
  );
}

// ── ReviewPanel ────────────────────────────────────────────────────────────────

function ReviewPanel({ order, onDone }: { order: AdminBoostOrder; onDone: (action: "approve" | "reject") => void }) {
  const [action, setAction] = useState<"approve" | "reject">("approve");
  const [adminNote, setAdminNote] = useState(order.adminNote ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [approved, setApproved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const { toast } = useToast();

  const canOpenConfirm = action === "approve" || adminNote.trim().length > 0;

  async function handleConfirm(password: string) {
    setError("");
    setSubmitting(true);
    try {
      const res = await reviewBoostOrder(order.id, { action, adminNote: adminNote.trim() || undefined, adminPassword: password });
      setShowConfirm(false);
      if (action === "approve") {
        setWhatsappPhone(res.whatsappPhone ?? "");
        setApproved(true);
      } else {
        toast({ type: "success", title: "Transfer rejected." });
        onDone("reject");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
      setShowConfirm(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (approved) {
    const phone = whatsappPhone.replace(/\D/g, "");
    const msg = `Hi ${order.businessName ?? ""},\n\nYour Business Boost on Inai has been activated! Your listing is now boosted.\n\nThank you for choosing Inai Business!`;
    return (
      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 flex flex-col gap-4 items-center text-center">
        <div className="w-14 h-14 rounded-full bg-[#F0FDF4] flex items-center justify-center text-[26px] text-[#2E7D32]">✓</div>
        <div>
          <p className="text-[15px] font-semibold text-[#0A0A0A]">Boost approved</p>
          <p className="text-[12px] text-[#888] mt-1">Business Boost activated for @{order.username}.</p>
        </div>
        {phone.length > 6 && (
          <a href={`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer"
            className="w-full py-2.5 rounded-xl bg-[#25D366] text-white text-[14px] font-bold text-center hover:bg-[#1ebe5d] transition-colors">
            Send WhatsApp to {order.businessName ?? order.username} ↗
          </a>
        )}
        <button type="button" onClick={() => onDone("approve")}
          className="w-full py-2.5 rounded-xl border border-[#E0E0E0] text-[#888] text-[13px] font-medium hover:bg-[#FAFAFA] transition-colors">
          Back to list
        </button>
      </div>
    );
  }

  if (order.status !== "pending") {
    return (
      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5">
        <h3 className="text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide mb-3">Status</h3>
        <StatusBadge status={order.status} />
        {order.adminNote && (
          <div className="mt-3 bg-[#FAFAFA] rounded-xl p-3 text-[13px] text-[#444]">
            <span className="text-[11px] text-[#888] font-medium block mb-1">Admin note</span>
            {order.adminNote}
          </div>
        )}
        {order.reviewedAt && <p className="text-[12px] text-[#888] mt-2">Reviewed {fmtDateTime(order.reviewedAt)}</p>}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-4 md:p-5 flex flex-col gap-4">
        <h3 className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Review</h3>

        <div className="flex gap-2">
          <button type="button" onClick={() => setAction("approve")}
            className={`cursor-pointer flex-1 py-2 rounded-xl text-[14px] sm:text-[15px] md:text-[16px] font-semibold border transition-colors ${action === "approve" ? "bg-[#F0FDF4] border-[#2E7D32] text-[#2E7D32]" : "bg-white border-[#E6E6E6] text-[#888] hover:border-[#2E7D32]"}`}>
            Approve
          </button>
          <button type="button" onClick={() => setAction("reject")}
            className={`cursor-pointer flex-1 py-2 rounded-xl text-[14px] sm:text-[15px] md:text-[16px] font-semibold border transition-colors ${action === "reject" ? "bg-[#FFF0F3] border-[#B31B38] text-[#B31B38]" : "bg-white border-[#E6E6E6] text-[#888] hover:border-[#B31B38]"}`}>
            Reject
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-[12px] sm:text-[13px] md:text-[14px] text-[#888] font-medium">
            {action === "reject" ? "Rejection reason (required — shown to business)" : "Note (optional, internal)"}
          </label>
          <textarea
            placeholder={action === "reject" ? "Enter reason for rejection…" : "Optional internal note…"}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={3}
            className={`w-full border rounded-xl px-3 py-2 text-[14px] outline-none bg-white resize-none transition-colors ${action === "reject" && !adminNote.trim() ? "border-[#FFD5DF] focus:border-[#B31B38]" : "border-[#E6E6E6] focus:border-[#B31B38]"}`}
          />
          {action === "reject" && !adminNote.trim() && (
            <p className="text-[12px] md:text-[13px] text-[#B31B38]">Required before rejecting</p>
          )}
        </div>

        {error && <p className="text-[12px] md:text-[13px] text-[#B31B38] bg-[#FFF0F3] border border-[#FFD5DF] rounded-lg px-3 py-2">{error}</p>}

        <Button onPress={() => setShowConfirm(true)} disabled={!canOpenConfirm || submitting} text={action === "approve" ? "Approve transfer" : "Reject transfer"}
        />
      </div>

      <ConfirmPasswordDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title={action === "approve" ? `Approve boost for @${order.username}?` : `Reject boost for @${order.username}?`}
        subtitle={action === "approve"
          ? `This will activate Business Boost for ${order.businessName ?? order.username}. They will be notified via WhatsApp.`
          : `Rejection reason will be shown to ${order.businessName ?? order.username}.`}
        confirmLabel={action === "approve" ? "Yes, approve" : "Yes, reject"}
        danger={action === "reject"}
        submitting={submitting}
        onConfirm={handleConfirm}
      />
    </>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function BusinessTransferDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [order, setOrder] = useState<AdminBoostOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showReceiptPopup, setShowReceiptPopup] = useState(false);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const receiptBlobCache = useRef<{ key: string; blob: Blob; filename: string } | null>(null);

  useEffect(() => {
    getBoostOrder(orderId)
      .then(setOrder)
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderId]);

  async function handleGeneratePdf() {
    if (!order) return;
    setGeneratingPdf(true);
    try {
      await generateBoostInvoicePDF({
        id: order.id,
        businessName: order.businessName,
        username: order.username,
        phone: order.phone ?? null,
        countryCode: order.countryCode ?? null,
        amountLkr: order.amountLkr,
        discountLkr: order.discountLkr,
        promoCode: order.promoCode,
        status: order.status,
        createdAt: order.createdAt,
        reviewedAt: order.reviewedAt,
        adminNote: order.adminNote,
      });
    } catch {
      toast({ type: "error", title: "Failed to generate PDF" });
    } finally {
      setGeneratingPdf(false);
    }
  }

  async function handleDownloadReceipt() {
    if (!order) return;
    setDownloadingReceipt(true);
    try {
      const cacheKey = order.receiptPresignedUrl ?? order.id;
      if (!receiptBlobCache.current || receiptBlobCache.current.key !== cacheKey) {
        const result = await downloadBoostReceiptBlob(order.id);
        receiptBlobCache.current = { key: cacheKey, ...result };
      }
      const { blob, filename } = receiptBlobCache.current;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast({ type: "error", title: "Failed to download receipt" });
    } finally {
      setDownloadingReceipt(false);
    }
  }

  function handleReceiptReplaced(newPresignedUrl: string) {
    receiptBlobCache.current = null;
    setOrder((prev) => prev ? { ...prev, receiptPresignedUrl: newPresignedUrl, receiptKey: newPresignedUrl } : prev);
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-xl bg-[#F0F0F0]" />
            <div className="space-y-2">
              <div className="h-4 w-36 rounded bg-[#F0F0F0]" />
              <div className="h-3 w-24 rounded bg-[#F0F0F0]" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-24 rounded-xl bg-[#F0F0F0]" />
            <div className="h-8 w-8 rounded-xl bg-[#F0F0F0]" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-4 sm:p-5 mb-5">
          <div className="flex items-center justify-between">
            <div className="h-5 w-20 rounded-full bg-[#F0F0F0]" />
            <div className="h-7 w-28 rounded bg-[#F0F0F0]" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {[80, 120, 60].map((h, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#EAEAEA] p-4 sm:p-5">
                <div className="h-3 w-32 rounded bg-[#F0F0F0] mb-4" />
                <div className={`h-${h === 80 ? "20" : h === 120 ? "28" : "12"} rounded-xl bg-[#F5F5F5]`} />
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 space-y-3">
              <div className="h-3 w-20 rounded bg-[#F0F0F0]" />
              <div className="h-9 rounded-xl bg-[#F5F5F5]" />
              <div className="h-9 rounded-xl bg-[#F5F5F5]" />
              <div className="h-20 rounded-xl bg-[#F5F5F5]" />
              <div className="h-10 rounded-xl bg-[#F0F0F0]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !order) {
    return (
      <div>
        <button type="button" onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#888] hover:text-[#222] mb-6 transition-colors">
          <BackArrowIcon className="w-4 h-4" /> Back
        </button>
        <div className="px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-sm text-[#B31B38]">
          {loadError || "Order not found."}
        </div>
      </div>
    );
  }

  const net = order.amountLkr - order.discountLkr;

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-4 mb-0">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={() => router.push("/business-transfers")}
              className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-xl border border-[#E6E6E6] text-[#555] hover:border-[#B31B38] hover:bg-white hover:text-[#B31B38] transition-colors shrink-0"
              aria-label="Back to business transfers"
            >
              <BackArrowIcon className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-[18px] sm:text-[22px] font-semibold text-[#222] leading-tight truncate">
                {order.businessName ?? "—"}
              </h1>
              <p className="text-[13px] text-[#888]">@{order.username ?? "—"} · Business Boost</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button disabled={generatingPdf} white className="!py-2" text={generatingPdf ? "Generating…" : "Invoice PDF"} iconLeft={<DownloadIcon className="w-5 h-5" />} onPress={handleGeneratePdf} />
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen((p) => !p)}
                className="cursor-pointer text-[#222222] hover:text-[#B31B38] transition-colors"
              >
                <ThreeDotsIcon className="w-6 sm:w-8 h-6 sm:h-8" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-9 z-20 w-44 bg-white border border-[#EEEEEE] rounded-xl shadow-lg py-1 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => { setMenuOpen(false); setShowReceiptPopup(true); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#222] hover:bg-[#F5F5F5] transition-colors"
                    >
                      {order.receiptPresignedUrl ? "Replace receipt" : "Upload receipt"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-4 sm:p-5 mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="text-[14px] md:text-[16px] text-[#888]">Submitted {fmtDate(order.createdAt)}</span>
          </div>
          <div className="text-right">
            <p className="text-[18px] sm:text-[20px] md:text-[22px] font-bold text-[#0A0A0A]">{fmtLkr(net)}</p>
            {order.discountLkr > 0 && (
              <p className="text-[14px] md:text-[16px] text-[#2E7D32]">
                Saved {fmtLkr(order.discountLkr)}{order.promoCode ? ` · ${order.promoCode}` : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        {/* Left — details */}
        <div className="lg:col-span-2 space-y-4 md:space-y-5">

          {/* Payment breakdown */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-4 sm:p-5">
            <h3 className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide mb-4">Payment breakdown</h3>
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-[#F0F0F0]">
                  <th className="text-left py-2 text-[#888] font-medium text-[14px]">Description</th>
                  <th className="text-right py-2 text-[#888] font-medium text-[14px]">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#F8F8F8]">
                  <td className="py-3">
                    <div className="font-semibold text-[#0A0A0A]">Business Boost</div>
                    <div className="text-[13px] text-[#888]">1 month · Bank transfer</div>
                  </td>
                  <td className="py-3 text-right font-medium">{fmtLkr(order.amountLkr)}</td>
                </tr>
                {order.discountLkr > 0 && (
                  <tr className="border-b border-[#F8F8F8]">
                    <td className="py-3 text-[#2E7D32]">
                      Discount
                      {order.promoCode && (
                        <span className="text-[11px] sm:text-[12px] md:text-[13px] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full ml-2">{order.promoCode}</span>
                      )}
                    </td>
                    <td className="py-3 text-right text-[#2E7D32] font-medium">− {fmtLkr(order.discountLkr)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td className="pt-3 font-semibold text-[14px] sm:text-[15px] md:text-[16px]">Total charged</td>
                  <td className="pt-3 text-right font-bold text-[15px]">{fmtLkr(net)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Business details */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-4 sm:p-5">
            <h3 className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide mb-3">Business</h3>
            <dl className="space-y-2 text-[14px]">
              {([
                ["Business name", order.businessName],
                ["Username", order.username ? `@${order.username}` : null],
                ["WhatsApp", order.phone ?? null],
              ] as [string, string | null | undefined][]).map(([label, value]) =>
                value ? (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-[#888]">{label}</dt>
                    <dd className="font-medium text-[#0A0A0A] text-right">{value}</dd>
                  </div>
                ) : null
              )}
            </dl>
          </div>

          {/* Receipt */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-4 sm:p-5">
            <h3 className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide mb-3">Receipt</h3>
            <div className="flex gap-2 flex-wrap">
              {order.receiptPresignedUrl ? (
                <>
                  <a href={order.receiptPresignedUrl} target="_blank" rel="noreferrer"
                    className="flex-1 text-center py-2 rounded-xl border border-[#B31B38] text-[#B31B38] text-[13px] font-semibold hover:bg-[#FFF0F3] transition-colors min-w-[100px]">
                    View ↗
                  </a>
                  <button type="button" disabled={downloadingReceipt} onClick={handleDownloadReceipt}
                    className="px-4 py-2 rounded-xl border border-[#E6E6E6] bg-white text-[#555] text-[13px] font-medium hover:border-[#B31B38] hover:text-[#B31B38] disabled:opacity-40 transition-colors">
                    {downloadingReceipt ? "…" : "Download"}
                  </button>
                </>
              ) : (
                <p className="text-[13px] text-[#999] italic">No receipt uploaded yet. Use ⋮ menu to upload.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right — review */}
        <div className="lg:col-span-1">
          <ReviewPanel order={order} onDone={() => router.push("/business-transfers")} />
        </div>
      </div>

      {showReceiptPopup && (
        <AdminReceiptUploadPopup
          currentReceiptUrl={order.receiptPresignedUrl ?? null}
          orderId={order.id}
          onClose={() => setShowReceiptPopup(false)}
          onReplaced={handleReceiptReplaced}
        />
      )}
    </div>
  );
}
