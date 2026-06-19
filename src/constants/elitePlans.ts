// Elite plan config — edit prices and features here

export interface BankDetail {
  label: string;
  displayValue: string;
  copyValue: string;
}

export const BANK_DETAILS: BankDetail[] = [
  { label: "Account name",   displayValue: "Ahken Nexus Pvt Ltd", copyValue: "Ahken Nexus Pvt Ltd" },
  { label: "Bank",           displayValue: "Sampath Bank PLC",     copyValue: "Sampath Bank PLC" },
  { label: "Account number", displayValue: "0148 1100 4426",       copyValue: "014811004426" },
  { label: "Branch",         displayValue: "Kilinochchi",          copyValue: "Kilinochchi" },
];

export type PlanKey = "basic" | "pro" | "max";

export interface PlanPricing {
  symbol: string;
  perMonth: string;
  total: string;
}

export interface ElitePlan {
  key: PlanKey;
  label: string;
  months: number;
  tagLine?: string;
  lkr: PlanPricing;
  gbp: PlanPricing;
  features: string[];
}

export const ELITE_PLANS: ElitePlan[] = [
  {
    key: "basic",
    label: "Elite basic",
    months: 3,
    lkr: { symbol: "Rs", perMonth: "1,967", total: "5,900" },
    gbp: { symbol: "£",  perMonth: "13",    total: "39" },
    features: [
      "Unlimited profiles",
      "Unlimited interest requests",
      "Connect with up to **20 verified profiles** total",
      "1-week ad profile boost per month **(for 3 months)**",
    ],
  },
  {
    key: "pro",
    label: "Elite pro",
    months: 6,
    tagLine: "Save 16%",
    lkr: { symbol: "Rs", perMonth: "1,650", total: "9,900" },
    gbp: { symbol: "£",  perMonth: "11.50", total: "69" },
    features: [
      "Unlimited profiles",
      "Unlimited interest requests",
      "Connect with up to **50 verified profiles** total",
      "1-week ad profile boost per month **(for 6 months)**",
      "Hand-curated matches sent to your WhatsApp **twice a month.**",
    ],
  },
  {
    key: "max",
    label: "Elite VIP",
    months: 10,
    tagLine: "Full-service matchmaking.",
    lkr: { symbol: "Rs", perMonth: "2,490", total: "24,900" },
    gbp: { symbol: "£",  perMonth: "17.90", total: "179" },
    features: [
      "Unlimited profiles",
      "Unlimited interest requests",
      "Connect with up to **120 verified profiles** total",
      "1-week ad profile boost per month **(for 10 months)**",
      "**Weekly** hand-curated matches sent to your WhatsApp.",
      "Priority customer service",
      "Personalized dedicated matchmaker",
    ],
  },
];

export function getPlanByKey(key: string): ElitePlan | undefined {
  return ELITE_PLANS.find((p) => p.key === key);
}

export function isSriLanka(countryCode?: string | null): boolean {
  return (countryCode ?? "").replace(/\s/g, "") === "+94";
}

export function getPricing(plan: ElitePlan, countryCode?: string | null): PlanPricing {
  return isSriLanka(countryCode) ? plan.lkr : plan.gbp;
}
