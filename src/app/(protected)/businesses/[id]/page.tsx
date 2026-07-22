"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getAdminBusiness, reviewAdminBusiness } from "@/lib/api";
import type { AdminBusinessDetail, AdminBizService } from "@/lib/api";
import { BackArrowIcon, ExpandIcon } from "@/assets/Icons";
import Button from "@/components/layout/Button";
import Popup from "@/components/layout/Popup";
import { useToast } from "@/components/ui/Toast";

function formatDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function SectionCard({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#EAEAEA] p-4 sm:p-5 ${className ?? ""}`}>
      <h3 className="text-[14px] font-semibold text-[#888] uppercase tracking-wide mb-3">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-start gap-0.5 min-[400px]:gap-3 py-2 border-b border-[#F5F5F5] last:border-0">
      <span className="text-[14px] text-[#767676] min-[400px]:w-[160px] shrink-0">{label}</span>
      <span className="text-[14px] text-[#222222] break-words">{value ?? "—"}</span>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: "green" | "red" | "orange" | "gray" }) {
  const cls = {
    green: "bg-[#F0FDF4] text-[#2E7D32]",
    red: "bg-[#FFF0F3] text-[#B31B38]",
    orange: "bg-[#FFF3DC] text-[#A97216]",
    gray: "bg-[#F2F2F2] text-[#6B6B6B]",
  }[color];
  return <span className={`px-2 py-0.5 rounded-full text-[13px] font-semibold ${cls}`}>{label}</span>;
}

function ServicePhotoGallery({ service, onExpand }: { service: AdminBizService; onExpand: (url: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAEA] overflow-hidden">
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto p-3" style={{ scrollbarWidth: "none" }}>
        {service.photos.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onExpand(p.url)}
            className="relative shrink-0 w-[140px] h-[140px] rounded-[12px] overflow-hidden bg-[#F2F2F2] cursor-pointer hover:opacity-90 transition-opacity group"
          >
            <Image src={p.url} alt={service.title} fill className="object-cover" loading="lazy" />
            <div className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.12)] opacity-0 group-hover:opacity-100 transition-opacity">
              <ExpandIcon className="w-4 h-4" stroke="#222" />
            </div>
          </button>
        ))}
      </div>
      <div className="px-4 pb-4 border-t border-[#F5F5F5] pt-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[15px] font-semibold text-[#0A0A0A]">{service.title}</p>
          <span className="shrink-0 text-[14px] font-semibold text-[#B31B38]">Rs {service.price.toLocaleString()}</span>
        </div>
        <p className="mt-1 text-[13px] text-[#555] leading-[155%]">{service.description}</p>
      </div>
    </div>
  );
}

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [biz, setBiz] = useState<AdminBusinessDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getAdminBusiness(id)
      .then(setBiz)
      .catch(() => router.replace("/businesses"))
      .finally(() => setLoading(false));
  }, [id, router]);

  async function handleAction(action: "approve" | "reject") {
    if (!biz) return;
    setActionLoading(true);
    try {
      await reviewAdminBusiness(biz.id, { action, rejectionReason: action === "reject" ? rejectReason : undefined });
      toast({ type: "success", title: action === "approve" ? "Approved!" : "Rejected", message: `${biz.businessName} has been ${action}d.` });
      router.push("/businesses");
    } catch (err) {
      toast({ type: "error", title: "Failed", message: err instanceof Error ? err.message : "Action failed" });
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        {/* Back button */}
        <div className="h-8 w-32 bg-[#F2F2F2] rounded-xl" />
        {/* Cover photo */}
        <div className="w-full h-[220px] sm:h-[280px] bg-[#F2F2F2] rounded-2xl" />
        {/* Header card: logo + name + username + location */}
        <div className="bg-white rounded-2xl border border-[#EAEAEA] px-4 sm:px-5 py-4 flex items-start gap-4">
          <div className="w-14 h-14 shrink-0 rounded-full bg-[#F2F2F2]" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-40 bg-[#F2F2F2] rounded" />
            <div className="h-3.5 w-32 bg-[#F2F2F2] rounded" />
            <div className="h-3.5 w-48 bg-[#F2F2F2] rounded" />
          </div>
        </div>
        {/* Info cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[4, 4].map((rows, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#EAEAEA] p-4 sm:p-5">
              <div className="h-3.5 w-24 bg-[#F2F2F2] rounded mb-4" />
              {Array.from({ length: rows }).map((_, j) => (
                <div key={j} className="flex gap-3 py-2 border-b border-[#F5F5F5] last:border-0">
                  <div className="h-3 w-28 bg-[#F2F2F2] rounded shrink-0" />
                  <div className="h-3 bg-[#F2F2F2] rounded flex-1" />
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* Bio card */}
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-4 sm:p-5">
          <div className="h-3.5 w-12 bg-[#F2F2F2] rounded mb-4" />
          <div className="space-y-2">
            <div className="h-3 bg-[#F2F2F2] rounded w-full" />
            <div className="h-3 bg-[#F2F2F2] rounded w-5/6" />
            <div className="h-3 bg-[#F2F2F2] rounded w-4/6" />
          </div>
        </div>
        {/* Services */}
        <div className="space-y-4">
          <div className="h-3.5 w-24 bg-[#F2F2F2] rounded" />
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#EAEAEA] overflow-hidden">
              <div className="flex gap-2 p-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="shrink-0 w-[140px] h-[140px] rounded-[12px] bg-[#F2F2F2]" />
                ))}
              </div>
              <div className="px-4 pb-4 pt-3 border-t border-[#F5F5F5] space-y-2">
                <div className="h-4 w-36 bg-[#F2F2F2] rounded" />
                <div className="h-3 bg-[#F2F2F2] rounded w-full" />
                <div className="h-3 bg-[#F2F2F2] rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!biz) return null;

  const isPending = !biz.isApproved && !biz.isRejected;
  const statusBadge = biz.isApproved
    ? <Badge label="Approved" color="green" />
    : biz.isRejected
    ? <Badge label="Rejected" color="red" />
    : <Badge label="Pending Review" color="orange" />;

  return (
    <>
      {/* Back */}
      <button
        type="button"
        onClick={() => router.back()}
        className="cursor-pointer mb-5 flex items-center gap-2 text-[18px] sm:text-[20px] md:text-[22px] font-bold text-[#222] group"
      >
        <span className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#E6E6E6] group-hover:border-[#B31B38] transition-colors">
          <BackArrowIcon className="w-4 h-4" />
        </span>
        Businesses
      </button>

      {/* Cover photo */}
      {biz.coverPhotoUrl && (
        <div className="relative w-full h-[220px] sm:h-[280px] rounded-2xl overflow-hidden bg-[#F2F2F2] mb-4 group">
          <Image src={biz.coverPhotoUrl} alt="cover" fill className="object-cover" />
          <button
            type="button"
            onClick={() => setLightbox(biz.coverPhotoUrl!)}
            className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.12)] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="View full cover photo"
          >
            <ExpandIcon className="w-4 h-4" stroke="#222" />
          </button>
        </div>
      )}

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-[#EAEAEA] px-4 sm:px-5 py-4 mb-5 flex items-start gap-4">
        {biz.logoUrl ? (
          <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden bg-[#F2F2F2] border-2 border-white shadow-sm">
            <Image src={biz.logoUrl} alt="logo" fill className="object-cover" />
          </div>
        ) : (
          <div className="w-14 h-14 shrink-0 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[22px] font-semibold text-[#E5BAC2]">
            {biz.businessName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[18px] sm:text-[20px] md:text-[22px] font-bold text-[#222]">{biz.businessName}</h1>
            {statusBadge}
          </div>
          <p className="text-[13px] text-[#B31B38] mt-0.5">@{biz.username} · {biz.category}{biz.specify ? ` (${biz.specify})` : ""}</p>
          <p className="text-[13px] text-[#888] mt-0.5">{biz.village}, {biz.district} · Registered {formatDate(biz.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Business info */}
        <SectionCard title="Business Info">
          <InfoRow label="Category" value={biz.category + (biz.specify ? ` — ${biz.specify}` : "")} />
          <InfoRow label="Experience" value={biz.experience} />
          {biz.qualifications && <InfoRow label="Qualifications" value={biz.qualifications} />}
          {biz.careerHighlight && <InfoRow label="Career highlight" value={biz.careerHighlight} />}
        </SectionCard>

        {/* Location */}
        <SectionCard title="Location & Coverage">
          {biz.streetAddress && <InfoRow label="Street address" value={biz.streetAddress} />}
          <InfoRow label="Village / City" value={biz.village} />
          <InfoRow label="District" value={biz.district} />
          <InfoRow label="Coverage" value={biz.islandWide ? "Island-wide" : biz.serviceDistricts.join(", ")} />
        </SectionCard>
      </div>

      {/* Bio */}
      {biz.bio && (
        <SectionCard title="Bio" className="mb-5">
          <p className="text-[14px] text-[#444] leading-[160%]">{biz.bio}</p>
        </SectionCard>
      )}

      {/* Rejection reason (if rejected) */}
      {biz.isRejected && biz.rejectionReason && (
        <div className="mb-5 rounded-[12px] bg-[#FFF0F3] border border-[#FFD5DF] px-4 py-3">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[#B31B38] mb-1">Rejection reason</p>
          <p className="text-[14px] text-[#B31B38]">{biz.rejectionReason}</p>
        </div>
      )}

      {/* Services */}
      {biz.services.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[14px] font-semibold text-[#888] uppercase tracking-wide mb-3">
            Services ({biz.services.length})
          </h2>
          <div className="flex flex-col gap-4">
            {biz.services.map((s) => (
              <ServicePhotoGallery key={s.id} service={s} onExpand={setLightbox} />
            ))}
          </div>
        </div>
      )}

      {/* Approve / Reject actions */}
      {isPending && (
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-4 sm:p-5">
          <h3 className="text-[14px] font-semibold text-[#888] uppercase tracking-wide mb-4">Review Decision</h3>
          <div className="flex gap-3">
            <Button text="Approve" onPress={() => setConfirmAction("approve")} className="flex-1" />
            <button
              type="button"
              onClick={() => setConfirmAction("reject")}
              className="flex-1 rounded-[10px] border border-[#E0E0E0] text-[#555] font-medium text-[14px] py-2.5 hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      <Popup
        open={confirmAction === "approve"}
        onClose={() => setConfirmAction(null)}
        title={`Approve ${biz?.businessName ?? ""}?`}
        subtitle="This business will go live and be visible to users on inai.lk."
        buttons={[
          { label: "Cancel", onClick: () => setConfirmAction(null), variant: "secondary" },
          { label: actionLoading ? "Approving…" : "Yes, approve", onClick: () => handleAction("approve"), variant: "primary", disabled: actionLoading },
        ]}
      />

      <Popup
        open={confirmAction === "reject"}
        onClose={() => { setConfirmAction(null); setRejectReason(""); }}
        title={`Reject ${biz?.businessName ?? ""}?`}
        subtitle="The vendor will be notified. You can provide a reason below."
        buttons={[
          { label: "Cancel", onClick: () => { setConfirmAction(null); setRejectReason(""); }, variant: "secondary" },
          { label: actionLoading ? "Rejecting…" : "Yes, reject", onClick: () => handleAction("reject"), variant: "danger", disabled: !rejectReason.trim() || actionLoading },
        ]}
      >
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={3}
          placeholder="E.g. Incomplete information, missing photos…"
          className="w-full rounded-[12px] border border-[#E0E0E0] px-4 py-3 text-[14px] text-[#222] outline-none focus:border-[#B31B38] resize-none"
        />
      </Popup>
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative h-[85vh] w-full max-w-[700px]" onClick={(e) => e.stopPropagation()}>
            <Image src={lightbox} alt="" fill className="object-contain" />
          </div>
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
