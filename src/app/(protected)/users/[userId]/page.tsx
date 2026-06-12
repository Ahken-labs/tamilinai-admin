"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAdminUser, setContactLimit, blockUser, unblockUser, toggleElite, clearAboutMe } from "@/lib/api";
import type { AdminUserDetail } from "@/lib/api";
import { BackArrowIcon, EliteIcon, VerifiedIcon } from "@/assets/Icons";
import Popup from "@/components/Popup";
import { useToast } from "@/components/Toast";
import Button from "@/components/Button";

function formatDate(d: string | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(d: string | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function ucFirst(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function CopyIdButton({ userId }: { userId: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(userId).then(() => {
      toast({ type: "success", title: "Copied!", message: "User ID copied to clipboard." });
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy user ID"
      className="flex items-center gap-1.5 text-[14px] md:text-[16px] text-[#AAAAAA] hover:text-[#555] transition-colors group"
    >
      <span className="font-mono">{userId.slice(0, 8)}…{userId.slice(-4)}</span>
      {copied ? (
        <svg viewBox="0 0 16 16" fill="none" className="cursor-pointer w-4 h-4 text-[#2E7D32] shrink-0">
          <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" fill="none" className="cursor-pointer w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100">
          <rect x="5" y="5" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5 4.5V3.5A1.5 1.5 0 0 1 6.5 2h6A1.5 1.5 0 0 1 14 3.5v7A1.5 1.5 0 0 1 12.5 12H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

function ElitePlanDropdown({ value, onChange, disabled }: {
  value: "basic" | "pro" | "max";
  onChange: (v: "basic" | "pro" | "max") => void;
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

  const options: { value: "basic" | "pro" | "max"; label: string }[] = [
    { value: "basic", label: "Basic" },
    { value: "pro", label: "Pro" },
    { value: "max", label: "Max" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[14px] md:text-[16px] font-medium
          transition-colors disabled:opacity-40 touch-manipulation
          ${open ? "border-[#B31B38] bg-white text-[#0A0A0A]" : "border-[#E6E6E6] bg-white text-[#444] hover:border-[#CCCCCC]"}`}
      >
        {options.find((o) => o.value === value)?.label ?? "Basic"}
        <svg viewBox="0 0 10 10" fill="none" className={`w-2.5 h-2.5 text-[#AAAAAA] transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+3px)] z-50 min-w-[90px] rounded-[10px] border border-[#EBEBEB] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.10)]">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`flex w-full items-center px-3 py-1.5 text-[14px] md:text-[16px] text-left transition-colors
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

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EEEEEE] p-4 sm:p-5">
      <h3 className="text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide mb-2">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-start gap-0.5 min-[400px]:gap-3 py-2 border-b border-[#F5F5F5] last:border-0">
      <span className="text-[14px] md:text-[16px] text-[#767676] min-[400px]:w-[140px] min-[500px]:w-[160px] shrink-0">{label}</span>
      <span className="text-[14px] md:text-[16px] text-[#222222] break-all">{value ?? "—"}</span>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: "green" | "red" | "orange" | "gray" | "blue" | "brown" }) {
  const cls = {
    green: "bg-[#F0FDF4] text-[#2E7D32]",
    brown: "bg-[#FFFFFF] text-[#8D5900]",
    red: "bg-[#FFF0F3] text-[#B31B38]",
    orange: "bg-[#FFF3DC] text-[#A97216]",
    gray: "bg-[#F2F2F2] text-[#6B6B6B]",
    blue: "bg-[#EFF6FF] text-[#1D4ED8]",
  }[color];

  const icon =
    label === "Elite" ? <EliteIcon className="w-5 h-5 shrink-0" /> :
      label === "Verified" ? <VerifiedIcon className="w-5 h-5 shrink-0" /> :
        label === "Complete" ? <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5 shrink-0"><path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> :
          null;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[14px] font-semibold ${cls}`}>
      {icon}{label}
    </span>
  );
}

type PopupAction =
  | { type: "block" | "unblock" | "elite_remove" | "clear_about" }
  | { type: "elite_grant"; plan: "basic" | "pro" | "max" }
  | { type: "contact_limit"; limit: number | null };

export default function UserDetailPage() {
  const { userId } = useParams() as { userId: string };
  const router = useRouter();

  const { toast } = useToast();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState("");

  // Contact limit UI
  const [limitInput, setLimitInput] = useState("");
  const [pendingAction, setPending] = useState<PopupAction | null>(null);
  const [elitePlan, setElitePlan] = useState<"basic" | "pro" | "max">("basic");

  useEffect(() => {
    setLoading(true);
    getAdminUser(userId)
      .then((u) => {
        setUser(u);
        setLimitInput(u.contactViewLimitOverride != null ? String(u.contactViewLimitOverride) : "");
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load user"))
      .finally(() => setLoading(false));
  }, [userId]);

  async function executeAction() {
    if (!pendingAction || !user) return;
    const act = pendingAction;
    setPending(null);
    setActing(true);
    setActionError("");
    try {
      if (act.type === "block") {
        await blockUser(user.id);
        setUser((u) => u ? { ...u, isBlocked: true } : u);
        toast({ type: "success", title: `${user.name} blocked` });
      } else if (act.type === "unblock") {
        await unblockUser(user.id);
        setUser((u) => u ? { ...u, isBlocked: false } : u);
        toast({ type: "success", title: `${user.name} unblocked` });
      } else if (act.type === "elite_grant") {
        await toggleElite(user.id, true, act.plan);
        setUser((u) => u ? { ...u, isElite: true } : u);
        toast({ type: "success", title: "Elite granted", message: `${user.name} now has Elite ${ucFirst(act.plan)}.` });
      } else if (act.type === "elite_remove") {
        await toggleElite(user.id, false);
        setUser((u) => u ? { ...u, isElite: false } : u);
        toast({ type: "success", title: "Elite removed", message: `${user.name} reverted to free plan.` });
      } else if (act.type === "clear_about") {
        await clearAboutMe(user.id);
        setUser((u) => u ? { ...u, profile: u.profile ? { ...u.profile, aboutMe: null } : u.profile } : u);
        toast({ type: "success", title: "About Me cleared", message: `${user.name}'s About Me has been cleared.` });
      } else if (act.type === "contact_limit") {
        const res = await setContactLimit(user.id, act.limit);
        setUser((u) => u ? { ...u, contactViewLimitOverride: res.contactViewLimitOverride } : u);
        setLimitInput(res.contactViewLimitOverride != null ? String(res.contactViewLimitOverride) : "");
        toast({
          type: "success",
          title: act.limit == null ? "Limit reset to default" : `Contact limit set to ${act.limit}`,
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Action failed";
      setActionError(msg);
      toast({ type: "error", title: "Action failed", message: msg });
    } finally {
      setActing(false);
    }
  }

  const popupProps = (() => {
    if (!pendingAction || !user) return { title: "", subtitle: "", label: "Confirm", danger: false };
    if (pendingAction.type === "block")
      return { title: `Block ${user.name}?`, subtitle: "This user won't be able to log in or use the platform.", label: "Yes, block", danger: true };
    if (pendingAction.type === "unblock")
      return { title: `Unblock ${user.name}?`, subtitle: `${user.name} will regain full access to the platform.`, label: "Yes, unblock", danger: false };
    if (pendingAction.type === "elite_remove")
      return { title: "Remove Elite access?", subtitle: `${user.name} will lose Elite access and revert to the free plan.`, label: "Yes, remove", danger: true };
    if (pendingAction.type === "elite_grant")
      return { title: `Grant Elite ${ucFirst(pendingAction.plan)}?`, subtitle: `${user.name} will receive Elite ${ucFirst(pendingAction.plan)} access.`, label: "Yes, grant", danger: false };
    if (pendingAction.type === "clear_about")
      return { title: "Clear About Me?", subtitle: `This will permanently erase ${user.name}'s About Me. They can rewrite it anytime.`, label: "Yes, clear", danger: true };
    if (pendingAction.type === "contact_limit") {
      const lim = pendingAction.limit;
      return {
        title: lim == null ? "Reset contact limit?" : `Set contact limit to ${lim}?`,
        subtitle: lim == null
          ? "This will reset the contact view limit to the system default (40)."
          : `${user.name} will be able to view up to ${lim} contact${lim === 1 ? "" : "s"} per month.`,
        label: "Confirm",
        danger: false,
      };
    }
    return { title: "", subtitle: "", label: "Confirm", danger: false };
  })();

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-8 w-48 bg-[#F2F2F2] rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#EEEEEE] p-6">
              <div className="h-4 w-24 bg-[#F2F2F2] rounded mb-4" />
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-3 bg-[#F2F2F2] rounded mb-3 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div>
        <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-sm text-[#888] hover:text-[#222] mb-6 transition-colors">
          <BackArrowIcon className="w-4 h-4" /> Back
        </button>
        <div className="px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-sm text-[#B31B38]">
          {error || "User not found."}
        </div>
      </div>
    );
  }

  const p = user.profile;

  return (
    <>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-5">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-xl border border-[#E6E6E6]
              text-[#555] hover:border-[#B31B38] hover:bg-[#FFF] hover:text-[#B31B38] transition-colors shrink-0"
            aria-label="Go back"
          >
            <BackArrowIcon className="w-4.5 h-4.5" />
          </button>
          <h1 className="text-[18px] sm:text-[22px] font-semibold text-[#222] leading-tight">{user.name}</h1>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3 bg-white border border-[#EEEEEE] rounded-2xl max-[370px]:px-2 px-4 sm:px-5 py-3.5">
          <div className="flex flex-col gap-1">
            <span className="text-[14px] md:text-[16px] font-semibold uppercase tracking-wide text-[#888]">Inai ID</span>
            <span className="text-[14px] md:text-[16px] text-[#222]">{user.displayId}</span>
          </div>
          <div className="w-px h-8 bg-[#EEEEEE] hidden sm:block" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] md:text-[16px] font-semibold uppercase tracking-wide text-[#888]">User ID</span>
            <CopyIdButton userId={user.id} />
          </div>
          {(user.isElite || user.isBlocked || user.isClosed || user.isOnBreak || user.trustBadge || user.isProfileComplete) && (
            <>
              <div className="w-px h-8 bg-[#EEEEEE] hidden sm:block" />
              <div className="flex flex-wrap gap-1.5 items-center">
                {user.isElite && <Badge label="Elite" color="orange" />}
                {user.isBlocked && <Badge label="Blocked" color="red" />}
                {user.isClosed && <Badge label="Closed" color="gray" />}
                {user.isOnBreak && <Badge label="On Break" color="blue" />}
                {user.trustBadge && <Badge label="Verified" color="brown" />}
                {user.isProfileComplete && <Badge label="Complete" color="green" />}
              </div>
            </>
          )}
        </div>
      </div>

      {actionError && (
        <div className="mb-5 px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-sm text-[#B31B38]">
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Account Info */}
        <SectionCard title="Account">
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Phone" value={user.phone ?? null} />
          <InfoRow label="Gender" value={ucFirst(user.gender)} />
          <InfoRow label="Profile type" value={ucFirst(user.profileType)} />
          <InfoRow label="Email verified" value={user.isEmailVerified ? "Yes" : "No"} />
          <InfoRow label="Phone verified" value={user.isPhoneVerified ? "Yes" : "No"} />
          <InfoRow label="Completion score" value={`${user.profileCompletionScore}%`} />
          <InfoRow label="Joined" value={formatDateTime(user.createdAt)} />
        </SectionCard>

        {/* Status & Actions */}
        <SectionCard title="Status & Actions">
          <InfoRow label="Elite" value={user.isElite ? `Yes — expires ${formatDate(user.eliteExpiresAt)}` : "No"} />
          <InfoRow label="Blocked" value={user.isBlocked ? "Yes" : "No"} />
          <InfoRow label="On break" value={user.isOnBreak ? `Yes — until ${formatDate(user.breakEndsAt)}` : "No"} />
          <InfoRow label="Closed" value={user.isClosed ? `Yes — ${formatDate(user.closedAt)}` : "No"} />
          {user.isClosed && user.closeReason && <InfoRow label="Close reason" value={user.closeReason} />}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button pink className={`!py-1.5 ${user.isBlocked ? "!bg-[#B31B38] !text-[#FFFFFF] !hover:bg-[#8E162D]" : "!bg-[#FFF0F3] !text-[#B31B38] !hover:bg-[#FFE0E7]"}`}
              text={user.isBlocked ? "Unblock" : "Block"}
              onPress={() => setPending(user.isBlocked ? { type: "unblock" } : { type: "block" })}
              disabled={acting}
            />
            {user.isElite ? (
              <Button onPress={() => setPending({ type: "elite_remove" })} disabled={acting} className="!py-1.5" white text="Remove Elite" />

            ) : (
              <div className="flex items-center gap-1.5">
                <ElitePlanDropdown
                  value={elitePlan}
                  onChange={(v) => setElitePlan(v)}
                  disabled={acting}
                />
              <Button onPress={() => setPending({ type: "elite_grant", plan: elitePlan })} disabled={acting} className="!py-1.5" white text="Grant Elite" />
              </div>
            )}
          </div>
        </SectionCard>

        {/* Personal */}
        {p && (
          <SectionCard title="Personal Info">
            <InfoRow label="Date of birth" value={formatDate(p.dateOfBirth)} />
            <InfoRow label="Marital status" value={p.maritalStatus ? ucFirst(p.maritalStatus.replace(/_/g, " ")) : null} />
            <InfoRow label="Height" value={p.heightCm ? `${p.heightCm} cm` : null} />
            <InfoRow label="Weight" value={p.weightKg ? `${p.weightKg} kg` : null} />
            <InfoRow label="Country" value={p.country} />
            <InfoRow label="City" value={p.city} />
            <InfoRow label="Religion" value={p.religion} />
            <InfoRow label="Caste" value={p.caste} />
            <InfoRow label="Physical build" value={p.physicalBuild ? ucFirst(p.physicalBuild) : null} />
            <InfoRow label="Resident status" value={p.residentStatus ? ucFirst(p.residentStatus.replace(/_/g, " ")) : null} />
          </SectionCard>
        )}

        {/* Career & Education */}
        {p && (
          <SectionCard title="Career & Education">
            <InfoRow label="Education" value={p.education} />
            <InfoRow label="Education detail" value={p.educationDetail} />
            <InfoRow label="Occupation" value={p.occupation} />
            <InfoRow label="Sector" value={p.sector} />
            <InfoRow label="Monthly income" value={p.monthlyIncome != null ? `${p.incomeCurrency ?? "LKR"} ${p.monthlyIncome.toLocaleString()}` : null} />
          </SectionCard>
        )}

        {/* Family */}
        {p && (
          <SectionCard title="Family">
            <InfoRow label="Father occupation" value={p.fatherOccupation} />
            <InfoRow label="Mother occupation" value={p.motherOccupation} />
            <InfoRow label="Brothers" value={p.brotherCount != null ? `${p.brotherCount} (${p.brothersMarried ?? 0} married)` : null} />
            <InfoRow label="Sisters" value={p.sisterCount != null ? `${p.sisterCount} (${p.sistersMarried ?? 0} married)` : null} />
          </SectionCard>
        )}

        {/* Lifestyle */}
        {p && (
          <SectionCard title="Lifestyle">
            <InfoRow label="Diet" value={p.dietHabit ? ucFirst(p.dietHabit) : null} />
            <InfoRow label="Smoking" value={p.smokingHabit ? ucFirst(p.smokingHabit) : null} />
            <InfoRow label="Drinking" value={p.drinkingHabit ? ucFirst(p.drinkingHabit) : null} />
            <InfoRow label="Languages" value={p.languagesSpoken?.join(", ") || null} />
            <InfoRow label="Hobbies" value={p.hobbies?.join(", ") || null} />
            <InfoRow label="Photo visibility" value={ucFirst(p.photoVisibility)} />
            <InfoRow label="Photo status" value={ucFirst(p.photoStatus)} />
          </SectionCard>
        )}

        {/* About Me */}
        {p?.aboutMe && (
          <div className="lg:col-span-2">
            <SectionCard title="About Me">
              <p className="text-[14px] md:text-[16px] text-[#222] leading-[1.7] whitespace-pre-wrap mb-4">{p.aboutMe}</p>
              <div className="justify-end flex">
                <Button
                  disabled={acting}
                  onPress={() => setPending({ type: "clear_about" })}
                  secondary sub text="Clear About Me" />
              </div>
            </SectionCard>
          </div>
        )}

        {/* Contact Limit Override — Elite only */}
        {user.isElite && (<div className="lg:col-span-2">
          <SectionCard title="Contact View Limit Override">
            <p className="text-[14px] md:text-[16px] text-[#222] mb-4">
              Only Elite users can view contacts. Plan limits: Basic — 30 per 2 months, Pro — 60 per 3 months, Max — 90 per 6 months.
              Set an override to replace the plan limit for this user (Elite only).
              Current override:{" "}
              <strong>{user.contactViewLimitOverride != null ? user.contactViewLimitOverride : "None (plan default)"}</strong>
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="number"
                min={1}
                max={500}
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                placeholder="e.g. 60"
                className="w-28 border border-[#E6E6E6] rounded-xl px-3 py-2 text-sm text-[#222] outline-none
                  focus:border-[#B31B38] transition-colors bg-white [appearance:textfield]
                  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Button
                disabled={acting || !limitInput || isNaN(Number(limitInput)) || Number(limitInput) < 1}
                onPress={() => setPending({ type: "contact_limit", limit: Number(limitInput) })}
                className="!py-2" text="Set limit" />
              {user.contactViewLimitOverride != null && (
                <Button white className="!py-2"
                  disabled={acting} onPress={() => setPending({ type: "contact_limit", limit: null })}
                  text="Reset to default" />
              )}
            </div>
          </SectionCard>
        </div>)}

      </div>

      <Popup
        open={!!pendingAction}
        onClose={() => setPending(null)}
        title={popupProps.title}
        subtitle={popupProps.subtitle}
        buttons={[
          { label: "Cancel", onClick: () => setPending(null), variant: "secondary" },
          { label: popupProps.label, onClick: executeAction, variant: popupProps.danger ? "danger" : "primary" },
        ]}
      />
    </>
  );
}
