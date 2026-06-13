// remove this section once website gets real profile traffic
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  listSeedUsers,
  createSeedUser,
  deleteSeedUser,
  type SeedUser,
} from "@/lib/api";
import Popup from "@/components/Popup";
import { useToast } from "@/components/Toast";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import CountryCodeDropdown from "@/components/CountryCodeDropdown";
import SearchableDropdown from "@/components/SearchableDropdown";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import { CURRENCY_OPTIONS } from "@/constants/currencies";
import { COUNTRY_OPTIONS } from "@/constants/location";
import {
  EDUCATION_OPTIONS,
  SECTOR,
  RELIGION_OPTIONS,
  CASTE_OPTIONS,
  CASTE_OPTIONS_HINDU,
  CASTE_OPTIONS_CHRISTIAN,
  INTEREST_GROUPS,
} from "@/constants/profiles";

// ── DB enum → label mappings (must match PostgreSQL enum values exactly) ──────

const MARITAL_OPTIONS = [
  { value: "unmarried",     label: "Unmarried" },
  { value: "widow_widower", label: "Widow / Widower" },
  { value: "divorced",      label: "Divorced" },
  { value: "separated",     label: "Separated" },
];

const PHYSICAL_BUILD_OPTIONS = [
  { value: "slim",      label: "Slim" },
  { value: "fit",       label: "Fit" },
  { value: "athletic",  label: "Athletic" },
  { value: "muscular",  label: "Muscular" },
  { value: "average",   label: "Average" },
  { value: "heavy",     label: "Heavy" },
  { value: "plus_size", label: "Plus Size" },
];

const DIET_OPTIONS = [
  { value: "vegetarian",     label: "Vegetarian" },
  { value: "non_vegetarian", label: "Non-Vegetarian" },
  { value: "eggetarian",     label: "Eggetarian" },
  { value: "vegan",          label: "Vegan" },
];

const SMOKING_OPTIONS = [
  { value: "never",        label: "Non-Smoker" },
  { value: "occasionally", label: "Occasionally" },
  { value: "regularly",    label: "Regularly" },
];

const DRINKING_OPTIONS = [
  { value: "never",        label: "Never" },
  { value: "occasionally", label: "Occasionally" },
  { value: "socially",     label: "Socially" },
  { value: "regularly",    label: "Regularly" },
];

const RESIDENT_STATUS_OPTIONS = [
  { value: "citizen",            label: "Citizen" },
  { value: "permanent_resident", label: "Permanent Resident" },
  { value: "work_visa",          label: "Work Permit / Visa" },
  { value: "student_visa",       label: "Student Visa" },
  { value: "other",              label: "Other" },
];

// ── Micro UI helpers ──────────────────────────────────────────────────────────

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold
        ${ok ? "bg-emerald-50 text-emerald-700" : "bg-[#F5F5F5] text-[#AAAAAA]"}`}
    >
      {ok ? "✓" : "—"} {label}
    </span>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[14px] font-medium tracking-[0.8px] uppercase text-[#222222]">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-[40px] px-3 rounded-[10px] border border-[#EBEBEB] bg-[#FAFAFA]
        text-[14px] text-[#0A0A0A] placeholder:text-[#BBBBBB] outline-none
        focus:border-[#B31B38] transition-colors"
    />
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <label
      className={`flex items-start gap-2 select-none ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => { if (!disabled) onChange(e.target.checked); }}
        className="w-4 h-4 mt-0.5 accent-[#B31B38] cursor-pointer"
      />
      <span className="flex flex-col">
        <span className={`text-[14px] ${disabled ? "text-[#999]" : "text-[#555]"}`}>
          {label}
        </span>
        {hint && (
          <span className="text-[12px] text-[#BBBBBB] leading-tight">{hint}</span>
        )}
      </span>
    </label>
  );
}

// ── Profile type options (backend uses lowercase enum values) ────────────────

const PROFILE_TYPE_OPTIONS = [
  { value: "myself", label: "Myself" },
  { value: "son",    label: "Son" },
  { value: "daughter", label: "Daughter" },
  { value: "brother", label: "Brother" },
  { value: "sister",  label: "Sister" },
  { value: "relative",  label: "Relative" },
  { value: "friend",  label: "Friend" },
];

// Currency: "LKR - Sri Lankan Rupee" → stored as "LKR"
function currencyToCode(full: string) {
  return full.split(" - ")[0].trim();
}
function codeToFullCurrency(code: string) {
  return CURRENCY_OPTIONS.find((c) => c.startsWith(code + " - ")) ?? code;
}

// ── Form state ────────────────────────────────────────────────────────────────

type FormState = {
  name: string;
  gender: "male" | "female";
  profileType: string;
  email: string;
  countryCode: string;
  phone: string;
  dateOfBirth: string;
  country: string;
  city: string;
  religion: string;
  caste: string;
  education: string;
  educationDetail: string;
  occupation: string;
  sector: string;
  aboutMe: string;
  hobbies: string[];
  heightCm: string;
  weightKg: string;
  maritalStatus: string;
  physicalBuild: string;
  dietHabit: string;
  smokingHabit: string;
  drinkingHabit: string;
  residentStatus: string;
  monthlyIncome: string;
  incomeCurrency: string;
  fatherOccupation: string;
  motherOccupation: string;
  brotherCount: string;
  brothersMarried: string;
  sisterCount: string;
  sistersMarried: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  trustBadge: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  gender: "male",
  profileType: "myself",
  email: "",
  countryCode: "+94",
  phone: "",
  dateOfBirth: "",
  country: "Sri Lanka",
  city: "",
  religion: "",
  caste: "",
  education: "",
  educationDetail: "",
  occupation: "",
  sector: "",
  aboutMe: "",
  hobbies: [],
  heightCm: "",
  weightKg: "",
  maritalStatus: "",
  physicalBuild: "",
  dietHabit: "",
  smokingHabit: "",
  drinkingHabit: "",
  residentStatus: "",
  monthlyIncome: "",
  incomeCurrency: "LKR",
  fatherOccupation: "",
  motherOccupation: "",
  brotherCount: "",
  brothersMarried: "",
  sisterCount: "",
  sistersMarried: "",
  emailVerified: true,
  phoneVerified: false,
  trustBadge: false,
};

// ── Create form ───────────────────────────────────────────────────────────────

function CreateForm({ onCreated }: { onCreated: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const canGrantTrustBadge = form.emailVerified && form.phoneVerified && !!form.phone;

  // Caste options change based on religion selection
  const casteOptions = useMemo(() => {
    if (form.religion === "Hindu") return CASTE_OPTIONS_HINDU;
    if (form.religion === "Christian") return CASTE_OPTIONS_CHRISTIAN;
    return CASTE_OPTIONS;
  }, [form.religion]);

  function handleReligionChange(v: string) {
    setForm((f) => {
      const newCasteOpts =
        v === "Hindu" ? CASTE_OPTIONS_HINDU :
        v === "Christian" ? CASTE_OPTIONS_CHRISTIAN :
        CASTE_OPTIONS;
      return {
        ...f,
        religion: v,
        caste: newCasteOpts.includes(f.caste) ? f.caste : "",
      };
    });
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhoto(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Name and email are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const fd = new FormData();

      const strKeys: (keyof FormState)[] = [
        "name", "gender", "profileType", "email", "countryCode", "phone",
        "dateOfBirth", "country", "city", "religion", "caste", "education",
        "educationDetail", "occupation", "sector", "aboutMe", "heightCm",
        "weightKg", "maritalStatus", "physicalBuild", "dietHabit", "smokingHabit",
        "drinkingHabit", "residentStatus", "monthlyIncome", "incomeCurrency",
        "fatherOccupation", "motherOccupation", "brotherCount", "brothersMarried",
        "sisterCount", "sistersMarried",
      ];
      strKeys.forEach((k) => { if (form[k]) fd.append(k, form[k] as string); });

      fd.append("emailVerified", form.emailVerified ? "true" : "false");
      fd.append("phoneVerified", form.phoneVerified ? "true" : "false");
      fd.append("trustBadge",    form.trustBadge    ? "true" : "false");

      if (form.hobbies.length > 0) fd.append("hobbies", JSON.stringify(form.hobbies));
      if (photo) fd.append("photo", photo);

      const result = await createSeedUser(fd);
      setForm(EMPTY_FORM);
      setPhoto(null);
      setPhotoPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      if (result.warning) {
        toast({ type: "error", title: "Profile created — photo failed", message: result.warning });
      } else {
        toast({ type: "success", title: "Seed user created", message: form.name ? `${form.name} added successfully.` : undefined });
      }
      onCreated();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create user.";
      setError(msg);
      toast({ type: "error", title: "Failed to create", message: msg });
    } finally {
      setSaving(false);
    }
  }

  const sectionLabel = (text: string) => (
    <p className="text-[12px] font-semibold tracking-[1.2px] uppercase text-[#CCCCCC] mb-2 mt-6 first:mt-0">
      {text}
    </p>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[16px] border border-[#EBEBEB] p-5 sm:p-6">
      <h2 className="text-[18px] font-semibold text-[#0A0A0A] mb-5">Create Profile</h2>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-[10px] bg-red-50 border border-red-200 text-[12px] text-red-700">
          {error}
        </div>
      )}

      {/* ── Required ── */}
      {sectionLabel("Required")}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FieldRow label="Full Name *">
          <Input value={form.name} onChange={(v) => set("name", v)} placeholder="Sanjeevan" />
        </FieldRow>

        <FieldRow label="Gender *">
          <SearchableDropdown
            value={form.gender}
            onChange={(v) => set("gender", v as "male" | "female")}
            options={[
              { value: "female", label: "Female" },
              { value: "male",   label: "Male" },
            ]}
          />
        </FieldRow>

        <FieldRow label="Profile Type *">
          <SearchableDropdown
            value={form.profileType}
            onChange={(v) => set("profileType", v)}
            options={PROFILE_TYPE_OPTIONS}
          />
        </FieldRow>

        <FieldRow label="Email * (internal only)">
          <Input value={form.email} onChange={(v) => set("email", v)} placeholder="sanjeevanyogan@gmail.com" type="email" />
        </FieldRow>
      </div>

      {/* ── Phone ── */}
      {sectionLabel("Phone (optional)")}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FieldRow label="Country Code">
          <CountryCodeDropdown value={form.countryCode} onChange={(v) => set("countryCode", v)} />
        </FieldRow>
        <FieldRow label="Phone Number">
          <Input
            value={form.phone}
            onChange={(v) => {
              if (!v) {
                setForm((f) => ({ ...f, phone: "", phoneVerified: false, trustBadge: false }));
              } else {
                set("phone", v);
              }
            }}
            placeholder="762360948 (no leading 0)"
          />
        </FieldRow>
      </div>
      <p className="mt-2 text-[12px] text-[#AAAAAA]">
        Each phone number must be unique.
      </p>

      {/* ── Photo ── */}
      {sectionLabel("Profile Photo (optional)")}
      <div className="flex items-center gap-3">
        {photoPreview && (
          <img src={photoPreview} alt="Preview" className="w-14 h-14 rounded-full object-cover border border-[#EBEBEB]" />
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="text-[14px] text-[#555] file:mr-3 file:py-1.5 file:px-3 file:rounded-[8px]
            file:border-0 file:text-[12px] file:font-semibold file:bg-[#F0F0F0] file:text-[#555]
            file:cursor-pointer cursor-pointer"
        />
      </div>

      {/* ── Personal ── */}
      {sectionLabel("Personal Details")}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FieldRow label="Date of Birth">
          <Input value={form.dateOfBirth} onChange={(v) => set("dateOfBirth", v)} type="date" />
        </FieldRow>

        <FieldRow label="Country">
          <SearchableDropdown
            value={form.country}
            onChange={(v) => set("country", v)}
            options={COUNTRY_OPTIONS}
            placeholder="Sri Lanka"
            clearable
          />
        </FieldRow>

        <FieldRow label="City">
          <Input value={form.city} onChange={(v) => set("city", v)} placeholder="Colombo" />
        </FieldRow>

        <FieldRow label="Religion">
          <SearchableDropdown
            value={form.religion}
            onChange={handleReligionChange}
            options={RELIGION_OPTIONS}
            placeholder="Select religion"
            clearable
          />
        </FieldRow>

        <FieldRow label="Caste">
          <SearchableDropdown
            value={form.caste}
            onChange={(v) => set("caste", v)}
            options={casteOptions}
            placeholder={form.religion ? "Select caste" : "Select religion first"}
            clearable
          />
        </FieldRow>

        <FieldRow label="Marital Status">
          <SearchableDropdown
            value={form.maritalStatus}
            onChange={(v) => set("maritalStatus", v)}
            options={MARITAL_OPTIONS}
            placeholder="Select status"
            clearable
          />
        </FieldRow>

        <FieldRow label="Height (cm)">
          <Input value={form.heightCm} onChange={(v) => set("heightCm", v)} placeholder="160" type="number" />
        </FieldRow>

        <FieldRow label="Weight (kg)">
          <Input value={form.weightKg} onChange={(v) => set("weightKg", v)} placeholder="55" type="number" />
        </FieldRow>

        <FieldRow label="Physical Build">
          <SearchableDropdown
            value={form.physicalBuild}
            onChange={(v) => set("physicalBuild", v)}
            options={PHYSICAL_BUILD_OPTIONS}
            placeholder="Select build"
            clearable
          />
        </FieldRow>
      </div>

      {/* ── About & Hobbies ── */}
      {sectionLabel("About & Interests")}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FieldRow label="About Me">
          <textarea
            value={form.aboutMe}
            onChange={(e) => set("aboutMe", e.target.value)}
            rows={3}
            placeholder="Write a short bio…"
            className="px-3 py-2.5 rounded-[10px] border border-[#EBEBEB] bg-[#FAFAFA]
              text-[14px] text-[#0A0A0A] placeholder:text-[#BBBBBB] outline-none
              focus:border-[#B31B38] transition-colors resize-none"
          />
        </FieldRow>
        <FieldRow label="Hobbies / Interests">
          <MultiSelectDropdown
            value={form.hobbies}
            onChange={(v) => set("hobbies", v)}
            groups={INTEREST_GROUPS}
            placeholder="Select interests…"
          />
        </FieldRow>
      </div>

      {/* ── Work & Lifestyle ── */}
      {sectionLabel("Work & Lifestyle")}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FieldRow label="Education">
          <SearchableDropdown
            value={form.education}
            onChange={(v) => set("education", v)}
            options={EDUCATION_OPTIONS}
            placeholder="Highest qualification"
            clearable
          />
        </FieldRow>

        <FieldRow label="Education Detail">
          <Input value={form.educationDetail} onChange={(v) => set("educationDetail", v)} placeholder="B.Sc. Computer Science" />
        </FieldRow>

        <FieldRow label="Occupation">
          <Input value={form.occupation} onChange={(v) => set("occupation", v)} placeholder="Software Engineer" />
        </FieldRow>

        <FieldRow label="Sector">
          <SearchableDropdown
            value={form.sector}
            onChange={(v) => set("sector", v)}
            options={SECTOR}
            placeholder="Select sector"
            clearable
          />
        </FieldRow>

        <FieldRow label="Monthly Income">
          <Input value={form.monthlyIncome} onChange={(v) => set("monthlyIncome", v)} placeholder="80000" type="number" />
        </FieldRow>

        <FieldRow label="Currency">
          <SearchableDropdown
            value={codeToFullCurrency(form.incomeCurrency)}
            onChange={(v) => set("incomeCurrency", currencyToCode(v))}
            options={CURRENCY_OPTIONS}
            placeholder="Select currency"
            clearable
          />
        </FieldRow>

        <FieldRow label="Diet">
          <SearchableDropdown
            value={form.dietHabit}
            onChange={(v) => set("dietHabit", v)}
            options={DIET_OPTIONS}
            placeholder="Diet preference"
            clearable
          />
        </FieldRow>

        <FieldRow label="Smoking">
          <SearchableDropdown
            value={form.smokingHabit}
            onChange={(v) => set("smokingHabit", v)}
            options={SMOKING_OPTIONS}
            placeholder="Smoking habit"
            clearable
          />
        </FieldRow>

        <FieldRow label="Drinking">
          <SearchableDropdown
            value={form.drinkingHabit}
            onChange={(v) => set("drinkingHabit", v)}
            options={DRINKING_OPTIONS}
            placeholder="Drinking habit"
            clearable
          />
        </FieldRow>

        <FieldRow label="Resident Status">
          <SearchableDropdown
            value={form.residentStatus}
            onChange={(v) => set("residentStatus", v)}
            options={RESIDENT_STATUS_OPTIONS}
            placeholder="Resident status"
            clearable
          />
        </FieldRow>
      </div>

      {/* ── Family ── */}
      {sectionLabel("Family")}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <FieldRow label="Father Occ.">
          <Input value={form.fatherOccupation} onChange={(v) => set("fatherOccupation", v)} placeholder="Retired" />
        </FieldRow>
        <FieldRow label="Mother Occ.">
          <Input value={form.motherOccupation} onChange={(v) => set("motherOccupation", v)} placeholder="Homemaker" />
        </FieldRow>
        <FieldRow label="Brothers">
          <Input value={form.brotherCount} onChange={(v) => set("brotherCount", v)} placeholder="1" type="number" />
        </FieldRow>
        <FieldRow label="Bros Married">
          <Input value={form.brothersMarried} onChange={(v) => set("brothersMarried", v)} placeholder="0" type="number" />
        </FieldRow>
        <FieldRow label="Sisters">
          <Input value={form.sisterCount} onChange={(v) => set("sisterCount", v)} placeholder="1" type="number" />
        </FieldRow>
        <FieldRow label="Sis Married">
          <Input value={form.sistersMarried} onChange={(v) => set("sistersMarried", v)} placeholder="0" type="number" />
        </FieldRow>
      </div>

      {/* ── Verification ── */}
      {sectionLabel("Verification")}
      <div className="p-4 rounded-[12px] bg-[#F8F5F2] border border-[#B31B38] mb-6">
        <p className="text-[14px] text-[#B31B38] mb-3 font-medium">
          verification status.
        </p>
        <div className="flex flex-wrap gap-5">
          <Checkbox
            checked={form.emailVerified}
            onChange={(v) =>
              setForm((f) => ({ ...f, emailVerified: v, trustBadge: v ? f.trustBadge : false }))
            }
            label="Email Verified"
          />
          <Checkbox
            checked={form.phoneVerified}
            onChange={(v) =>
              setForm((f) => ({ ...f, phoneVerified: v, trustBadge: v ? f.trustBadge : false }))
            }
            label="Phone Verified"
            disabled={!form.phone}
            hint={!form.phone ? "fill phone number first" : undefined}
          />
          <Checkbox
            checked={form.trustBadge}
            onChange={(v) => set("trustBadge", v)}
            label="Trust Badge"
            disabled={!canGrantTrustBadge}
            hint={
              !canGrantTrustBadge
                ? "requires email + phone both verified"
                : "grants the ✓ badge on profile"
            }
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="h-[44px] px-8 bg-[#B31B38] text-white text-[14px] font-semibold rounded-[12px]
          flex items-center justify-center gap-2
          hover:bg-[#9A1730] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer
          shadow-[0_4px_16px_rgba(179,27,56,0.25)]"
      >
        {saving ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Creating…
          </>
        ) : (
          "Create Profile"
        )}
      </button>
    </form>
  );
}

// ── Seed user card ────────────────────────────────────────────────────────────

function SeedCard({ user, onDelete }: { user: SeedUser; onDelete: (user: SeedUser) => void }) {
  return (
    <div className="bg-white rounded-[14px] border border-[#EBEBEB] overflow-hidden flex flex-col">
      <div className="relative w-full aspect-square bg-[#F5F5F5] overflow-hidden">
        {user.photoUrl ? (
          <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#CCCCCC]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <p className="text-[14px] font-semibold text-[#0A0A0A] leading-tight">{user.name}</p>
          <p className="text-[11px] text-[#AAAAAA] mt-0.5">
            {user.displayId} · {user.gender} · {user.profileType}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge ok={user.isEmailVerified} label="Email" />
          <Badge ok={user.isPhoneVerified} label="Phone" />
          <Badge ok={user.trustBadge}      label="Trust" />
        </div>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => onDelete(user)}
          className="w-full h-[34px] rounded-[8px] text-[12px] md:text-[14px] font-semibold text-[#B31B38]
            border border-[#B31B38] hover:bg-red-50 transition-colors cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// ── Seed card skeleton ────────────────────────────────────────────────────────

function SeedSkeleton() {
  return (
    <div className="bg-white rounded-[14px] border border-[#EBEBEB] overflow-hidden flex flex-col animate-pulse">
      <div className="w-full aspect-square bg-[#F2F2F2]" />
      <div className="p-3 flex flex-col gap-2">
        <div>
          <div className="h-4 bg-[#F2F2F2] rounded w-3/4 mb-1.5" />
          <div className="h-3 bg-[#F2F2F2] rounded w-1/2" />
        </div>
        <div className="flex gap-1">
          <div className="h-5 bg-[#F2F2F2] rounded-full w-14" />
          <div className="h-5 bg-[#F2F2F2] rounded-full w-14" />
          <div className="h-5 bg-[#F2F2F2] rounded-full w-14" />
        </div>
        <div className="h-[34px] bg-[#F2F2F2] rounded-[8px] mt-1" />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SeededPage() {
  const { toast } = useToast();
  const [users, setUsers]             = useState<SeedUser[]>([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [showForm, setShowForm]       = useState(false);
  const [pendingDelete, setPendingDelete] = useState<SeedUser | null>(null);
  const [deleting, setDeleting]       = useState(false);

  const fetchUsers = useCallback(async (pg: number, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);
    setError(null);
    try {
      const data = await listSeedUsers(pg);
      setUsers((prev) => append ? [...prev, ...data.users] : data.users);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      if (append) setLoadingMore(false); else setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(1, false); }, [fetchUsers]);

  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchUsers(next, true);
  }, [loading, loadingMore, hasMore, page, fetchUsers]);

  const sentinelRef = useInfiniteScroll(handleLoadMore, hasMore && !loading && !loadingMore);

  function handleCreated() {
    setShowForm(false);
    setPage(1);
    fetchUsers(1, false);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const name = pendingDelete.name;
      await deleteSeedUser(pendingDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== pendingDelete.id));
      setPendingDelete(null);
      toast({ type: "success", title: "Profile deleted", message: `${name} has been removed.` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed.";
      setError(msg);
      setPendingDelete(null);
      toast({ type: "error", title: "Delete failed", message: msg });
    } finally {
      setDeleting(false);
    }
  }

  const GRID = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3";

  return (
    <div className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-0 sm:py-0">

        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-[20px] sm:text-[22px] font-bold text-[#0A0A0A]">
              Profiles
            </h1>
            <p className="text-[12px] text-[#AAAAAA] mt-1">
              {users.length} profile{users.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="h-[40px] px-5 rounded-[12px] bg-[#B31B38] text-white text-[14px] font-semibold
              hover:bg-[#9A1730] active:scale-[0.99] transition-all cursor-pointer shrink-0
              shadow-[0_4px_16px_rgba(179,27,56,0.22)]"
          >
            {showForm ? "Close Form" : "+ Add Profile"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6">
            <CreateForm onCreated={handleCreated} />
          </div>
        )}

        {error && (
          <div className="mb-4 px-4 py-3 rounded-[10px] bg-red-50 border border-red-200 text-[12px] text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className={GRID}>
            {Array.from({ length: 10 }).map((_, i) => <SeedSkeleton key={i} />)}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#CCCCCC]">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
                <line x1="19" y1="8" x2="19" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="22" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[16px] font-semibold text-[#0A0A0A]">No profiles yet</p>
            <p className="text-[14px] text-[#AAAAAA] mt-1 max-w-[280px]">
              Add profiles by clicking the +Add Profile button.
            </p>
          </div>
        ) : (
          <div className={GRID}>
            {users.map((u) => (
              <SeedCard key={u.id} user={u} onDelete={setPendingDelete} />
            ))}
            {loadingMore && Array.from({ length: 4 }).map((_, i) => <SeedSkeleton key={`sk-${i}`} />)}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-1" />

        {!hasMore && users.length > 0 && (
          <p className="text-center text-[14px] md:text-[16px] text-[#CCCCCC] mt-4">All profiles loaded 🎉</p>
        )}
      </div>

      <Popup
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title={`Delete ${pendingDelete?.name ?? "this profile"}?`}
        subtitle="This permanently removes the profile, photo, and all related data. Cannot be undone."
        buttons={[
          { label: "Cancel", onClick: () => setPendingDelete(null), variant: "secondary" },
          {
            label: deleting ? "Deleting…" : "Delete permanently",
            onClick: confirmDelete,
            variant: "danger",
          },
        ]}
      />
    </div>
  );
}
// end-removal ────────────────────────────────────────────────────────────────
