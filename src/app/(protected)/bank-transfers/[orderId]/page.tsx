"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import {
  getBankTransfer,
  reviewBankTransfer,
  adminUploadBankReceipt,
  downloadBankReceiptBlob,
} from "@/lib/api";
import type { AdminBankTransferOrder } from "@/lib/api";
import { BackArrowIcon, DownloadIcon, ThreeDotsIcon } from "@/assets/Icons";
import { useToast } from "@/components/ui/Toast";
import { generateInvoicePDF } from "@/lib/generateInvoicePDF";
import Button from "@/components/layout/Button";

// helpers 

const PLAN_LABELS: Record<string, string> = { basic: "Basic", pro: "Pro", max: "Max" };

function fmtAmount(cents: number, currency: string) {
  const sym = currency.toLowerCase() === "lkr" ? "Rs" : "£";
  const amt = cents / 100;
  return `${sym} ${currency.toLowerCase() === "lkr" ? Math.round(amt).toLocaleString("en-LK") : amt.toFixed(2)}`;
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
  if (status === "approved") return <span className="px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#2E7D32] text-[12px] font-semibold">Approved</span>;
  if (status === "rejected") return <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0F3] text-[#B31B38] text-[12px] font-semibold">Rejected</span>;
  return <span className="px-2.5 py-0.5 rounded-full bg-[#FFF8E1] text-[#E65100] text-[12px] font-semibold">Pending</span>;
}

// Receipt upload popup 

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
      const res = await adminUploadBankReceipt(orderId, selectedFile);
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
        {/* Header */}
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

        {/* View current receipt */}
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

        {/* Upload box */}
        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-[#D8D8D8] bg-[#F2F2F2] px-4 py-7">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#888]">
              <path d="M12 16V8M12 8L9 11M12 8l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 16.5A3.5 3.5 0 0 0 16.5 13H15a5 5 0 1 0-9.9 1A4 4 0 0 0 4 21h13a3 3 0 0 0 3-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2.5 text-[14px] font-semibold text-[#222]">
              {currentReceiptUrl ? "Choose replacement file" : "Choose receipt file"}
            </p>
            <p className="mt-1 text-[12px] text-[#888] text-center">PDF, PNG or JPG · max 20 MB</p>
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
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="flex-1 py-2.5 rounded-xl border border-[#E0E0E0] text-[#222] text-[14px] font-medium hover:bg-[#F5F5F5] disabled:opacity-40 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedFile || uploading}
            onClick={handleUpload}
            className="flex-1 py-2.5 rounded-xl bg-[#B31B38] text-white text-[14px] font-semibold hover:bg-[#9A1730] disabled:opacity-40 transition-colors"
          >
            {uploading ? "Uploading…" : currentReceiptUrl ? "Replace receipt" : "Upload receipt"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Confirm dialog with password ─────────────────────────────────────────────

function ConfirmPasswordDialog({
  open,
  onClose,
  title,
  subtitle,
  confirmLabel,
  danger,
  submitting,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  confirmLabel: string;
  danger?: boolean;
  submitting?: boolean;
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
      <div className="relative z-10 w-full max-w-[340px] rounded-[20px] bg-white p-6 shadow-[0_16px_60px_rgba(0,0,0,0.18)]">
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
          <button type="button" onClick={onClose} disabled={submitting}
            className="flex-1 rounded-[12px] py-2.5 text-[14px] font-medium border border-[#E0E0E0] text-[#222] hover:bg-[#F5F5F5] transition-colors disabled:opacity-40">
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} disabled={submitting || !password.trim()}
            className={`flex-1 rounded-[12px] py-2.5 text-[14px] font-medium transition-colors disabled:opacity-40 ${danger ? "bg-[#B31B38] text-white hover:bg-[#9A1730]" : "bg-[#2E7D32] text-white hover:bg-[#1B5E20]"
              }`}>
            {submitting ? "Processing…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── Plan dropdown ────────────────────────────────────────────────────────────

function PlanDropdown({ value, onChange, disabled }: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const options = [
    { value: "basic", label: "Elite Basic — 3 months" },
    { value: "pro", label: "Elite Pro — 6 months" },
    { value: "max", label: "Elite Max — 10 months" },
  ];

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 px-3 py-2 rounded-xl border text-[13px] font-medium transition-colors disabled:opacity-40
          ${open ? "border-[#B31B38] bg-white text-[#0A0A0A]" : "border-[#E6E6E6] bg-white text-[#444] hover:border-[#CCCCCC]"}`}
      >
        <span>{options.find((o) => o.value === value)?.label ?? "Elite Basic — 3 months"}</span>
        <svg viewBox="0 0 10 10" fill="none" className={`w-2.5 h-2.5 text-[#AAAAAA] transition-transform shrink-0 ${open ? "rotate-180" : ""}`}>
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+3px)] z-50 rounded-[10px] border border-[#EBEBEB] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.10)]">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`flex w-full items-center px-3 py-2 text-[13px] text-left transition-colors
                first:rounded-t-[10px] last:rounded-b-[10px]
                ${value === o.value ? "bg-[#FFF0F3] text-[#B31B38] font-semibold" : "text-[#222] hover:bg-[#F5F5F5]"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ReviewPanel ──────────────────────────────────────────────────────────────

type ReviewPanelProps = { order: AdminBankTransferOrder; onDone: (action: "approve" | "reject") => void };

function ReviewPanel({ order, onDone }: ReviewPanelProps) {
  const [action, setAction] = useState<"approve" | "reject">("approve");
  const [newPlanKey, setNewPlanKey] = useState(order.planKey);
  const [adminNote, setAdminNote] = useState(order.adminNote ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [approved, setApproved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();

  const planChanged = newPlanKey !== order.planKey;
  const canOpenConfirm = action === "approve" || adminNote.trim().length > 0;

  const whatsappPhone = (order.userPhone ?? "").replace(/\D/g, "");
  const whatsappMsg = `Hi ${order.userName ?? ""},\n\nYour Inai.lk Elite ${PLAN_LABELS[newPlanKey] ?? newPlanKey} membership has been activated! Visit inai.lk/matches to start discovering your matches.\n\nWelcome to Elite!`;

  async function handleConfirm(password: string) {
    setError("");
    setSubmitting(true);
    try {
      await reviewBankTransfer(order.id, {
        action,
        newPlanKey: action === "approve" && planChanged ? newPlanKey : undefined,
        adminNote: adminNote.trim() || undefined,
        adminPassword: password,
      });
      setShowConfirm(false);
      if (action === "approve") {
        setApproved(true);
      } else {
        toast({ type: "success", title: "Transfer rejected. User notified." });
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
    return (
      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 flex flex-col gap-4 items-center text-center">
        <div className="w-14 h-14 rounded-full bg-[#F0FDF4] flex items-center justify-center text-[26px] text-[#2E7D32]">✓</div>
        <div>
          <p className="text-[15px] font-semibold text-[#0A0A0A]">Transfer approved</p>
          <p className="text-[12px] text-[#888] mt-1">Elite activated for {order.userDisplayId}. User notified via app + email.</p>
        </div>
        {whatsappPhone.length > 6 && (
          <a href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMsg)}`}
            target="_blank" rel="noreferrer"
            className="w-full py-2.5 rounded-xl bg-[#25D366] text-white text-[14px] font-bold text-center hover:bg-[#1ebe5d] transition-colors">
            Send WhatsApp to {order.userName ?? order.userDisplayId} ↗
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
      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 flex flex-col gap-4">
        <h3 className="text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Review</h3>

        <div className="flex gap-2">
          <button type="button" onClick={() => setAction("approve")}
            className={`flex-1 py-2 rounded-xl text-[13px] font-semibold border transition-colors ${action === "approve" ? "bg-[#F0FDF4] border-[#2E7D32] text-[#2E7D32]" : "bg-white border-[#E6E6E6] text-[#888] hover:border-[#2E7D32]"
              }`}>Approve</button>
          <button type="button" onClick={() => setAction("reject")}
            className={`flex-1 py-2 rounded-xl text-[13px] font-semibold border transition-colors ${action === "reject" ? "bg-[#FFF0F3] border-[#B31B38] text-[#B31B38]" : "bg-white border-[#E6E6E6] text-[#888] hover:border-[#B31B38]"
              }`}>Reject</button>
        </div>

        {action === "approve" && (
          <div className="space-y-1">
            <label className="text-[12px] text-[#888] font-medium">Grant plan</label>
            <PlanDropdown value={newPlanKey} onChange={setNewPlanKey} disabled={submitting} />
            {planChanged && <p className="text-[11px] text-[#E65100] font-medium">Plan changed {order.planKey} → {newPlanKey}</p>}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[12px] text-[#888] font-medium">
            {action === "reject" ? "Rejection reason (required — shown to user)" : "Note (optional, internal)"}
          </label>
          <textarea
            placeholder={action === "reject" ? "Enter reason for rejection…" : "Optional internal note…"}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={3}
            className={`w-full border rounded-xl px-3 py-2 text-[13px] outline-none bg-white resize-none transition-colors ${action === "reject" && !adminNote.trim() ? "border-[#FFD5DF] focus:border-[#B31B38]" : "border-[#E6E6E6] focus:border-[#B31B38]"
              }`}
          />
          {action === "reject" && !adminNote.trim() && (
            <p className="text-[11px] text-[#B31B38]">Required before rejecting</p>
          )}
        </div>

        {error && <p className="text-[12px] text-[#B31B38] bg-[#FFF0F3] border border-[#FFD5DF] rounded-lg px-3 py-2">{error}</p>}

        <button type="button" disabled={!canOpenConfirm || submitting} onClick={() => setShowConfirm(true)}
          className={`py-2.5 rounded-xl text-[14px] font-bold transition-colors disabled:opacity-40 ${action === "approve" ? "bg-[#2E7D32] text-white hover:bg-[#1B5E20]" : "bg-[#B31B38] text-white hover:bg-[#8B0000]"
            }`}>
          {action === "approve" ? "Approve transfer" : "Reject transfer"}
        </button>
      </div>

      <ConfirmPasswordDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title={action === "approve" ? `Approve payment for ${order.userDisplayId}?` : `Reject payment for ${order.userDisplayId}?`}
        subtitle={action === "approve"
          ? `This will activate Elite ${PLAN_LABELS[newPlanKey] ?? newPlanKey} for ${order.userName ?? "this user"}. An email + in-app notification will be sent.`
          : `Rejection reason will be shown to ${order.userName ?? "the user"} via in-app + email.`
        }
        confirmLabel={action === "approve" ? "Yes, approve" : "Yes, reject"}
        danger={action === "reject"}
        submitting={submitting}
        onConfirm={handleConfirm}
      />
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BankTransferDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [order, setOrder] = useState<AdminBankTransferOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showReceiptPopup, setShowReceiptPopup] = useState(false);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const receiptBlobCache = useRef<{ key: string; blob: Blob; filename: string } | null>(null);

  useEffect(() => {
    getBankTransfer(orderId)
      .then(setOrder)
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderId]);

  async function handleDownloadReceipt() {
    if (!order) return;
    setDownloadingReceipt(true);
    try {
      const cacheKey = order.receiptPresignedUrl ?? order.id;
      if (!receiptBlobCache.current || receiptBlobCache.current.key !== cacheKey) {
        const result = await downloadBankReceiptBlob(order.id);
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

  async function handleGeneratePdf() {
    if (!order) return;
    setGeneratingPdf(true);
    try {
      await generateInvoicePDF({
        id: order.id,
        paymentMethod: "Bank Transfer",
        planKey: order.planKey,
        planLabel: `Elite ${PLAN_LABELS[order.planKey] ?? order.planKey} Membership`,
        months: order.months,
        amountCents: order.amountCents,
        discountCents: order.discountCents,
        currency: order.currency,
        promoCode: order.promoCode,
        status: order.status,
        statusSuffix: order.status === "approved" ? "— Payment verified" : undefined,
        createdAt: order.createdAt,
        reviewedAt: order.reviewedAt,
        adminNote: order.adminNote,
        userName: order.userName,
        userDisplayId: order.userDisplayId,
        userEmail: order.userEmail,
        userPhone: order.userPhone,
        userGender: order.userGender,
      });
    } catch {
      toast({ type: "error", title: "Failed to generate PDF" });
    } finally {
      setGeneratingPdf(false);
    }
  }

  function handleReceiptReplaced(newPresignedUrl: string) {
    receiptBlobCache.current = null;
    setOrder((prev) => prev ? { ...prev, receiptPresignedUrl: newPresignedUrl } : prev);
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        {/* Header */}
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
        {/* Summary strip */}
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-4 sm:p-5 mb-5">
          <div className="flex items-center justify-between">
            <div className="h-5 w-20 rounded-full bg-[#F0F0F0]" />
            <div className="h-7 w-28 rounded bg-[#F0F0F0]" />
          </div>
        </div>
        {/* Body grid */}
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

  const net = order.amountCents - order.discountCents;

  return (
    <div>
      {/* Header — matches userId page style */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-4 mb-0">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={() => router.push("/bank-transfers")}
              className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-xl border border-[#E6E6E6] text-[#555] hover:border-[#B31B38] hover:bg-white hover:text-[#B31B38] transition-colors shrink-0"
              aria-label="Back to bank transfers"
            >
              <BackArrowIcon className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-[18px] sm:text-[22px] font-semibold text-[#222] leading-tight truncate">
                {order.userName ?? "—"}
              </h1>
              <p className="text-[13px] text-[#888]">{order.userDisplayId} · Elite {PLAN_LABELS[order.planKey] ?? order.planKey}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button disabled={generatingPdf} white className="!py-2" text={generatingPdf ? "Generating…" : "Invoice PDF"} iconLeft={<DownloadIcon className="w-5 h-5" />} onPress={handleGeneratePdf} />
            {/* 3-dot menu */}
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
            <span className="text-[13px] text-[#888]">Submitted {fmtDate(order.createdAt)}</span>
          </div>
          <div className="text-right">
            <p className="text-[22px] font-bold text-[#0A0A0A]">{fmtAmount(net, order.currency)}</p>
            {order.discountCents > 0 && (
              <p className="text-[12px] text-[#2E7D32]">
                Saved {fmtAmount(order.discountCents, order.currency)}{order.promoCode ? ` · ${order.promoCode}` : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — invoice details */}
        <div className="lg:col-span-2 space-y-5">

          {/* Payment breakdown */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-4 sm:p-5">
            <h3 className="text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide mb-4">Payment breakdown</h3>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#F0F0F0]">
                  <th className="text-left py-2 text-[#888] font-medium text-[12px]">Description</th>
                  <th className="text-right py-2 text-[#888] font-medium text-[12px]">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#F8F8F8]">
                  <td className="py-3">
                    <div className="font-semibold text-[#0A0A0A]">Elite {PLAN_LABELS[order.planKey] ?? order.planKey} Membership</div>
                    <div className="text-[12px] text-[#888]">{order.months} month{order.months !== 1 ? "s" : ""} · Bank transfer</div>
                  </td>
                  <td className="py-3 text-right font-medium">{fmtAmount(order.amountCents, order.currency)}</td>
                </tr>
                {order.discountCents > 0 && (
                  <tr className="border-b border-[#F8F8F8]">
                    <td className="py-3 text-[#2E7D32]">
                      Discount {order.promoCode && (
                        <span className="text-[11px] bg-[#F0FDF4] px-1.5 py-0.5 rounded-full ml-1">{order.promoCode}</span>
                      )}
                    </td>
                    <td className="py-3 text-right text-[#2E7D32] font-medium">− {fmtAmount(order.discountCents, order.currency)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td className="pt-3 font-bold text-[15px]">Total charged</td>
                  <td className="pt-3 text-right font-bold text-[15px]">{fmtAmount(net, order.currency)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Customer details */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-4 sm:p-5">
            <h3 className="text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide mb-3">Customer</h3>
            <dl className="space-y-2 text-[13px]">
              {([
                ["Full name", order.userName],
                ["Inai ID", order.userDisplayId],
                ["Email", order.userEmail],
                ["Phone", order.userPhone],
                ["Gender", order.userGender ? order.userGender.charAt(0).toUpperCase() + order.userGender.slice(1) : null],
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
            <h3 className="text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide mb-3">Receipt</h3>
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
          <ReviewPanel order={order} onDone={() => router.push("/bank-transfers")} />
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
