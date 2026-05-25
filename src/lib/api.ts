const BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://tamilinai-api.onrender.com";


export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type PendingPhoto = {
  reviewId: string;
  userId: string;
  userName: string;
  displayId: string;
  photoUrl: string;
  submittedAt: string;
};

export type AdminListUser = {
  id: string;
  displayId: string;
  name: string;
  gender: string;
  isElite: boolean;
  isBlocked: boolean;
  isClosed: boolean;
  isProfileComplete: boolean;
  trustBadge: boolean;
  profileCompletionScore: number;
  createdAt: string;
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}/api/admin${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
  });

  if (res.status === 401) {
    // On auth endpoints, 401 = wrong credentials — just throw so the form shows the error.
    // On protected endpoints, 401 = session expired — redirect to login.
    if (!path.startsWith("/auth/")) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      window.location.href = "/login";
    }
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? "Invalid credentials");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? "Request failed");
  }

  return res.json() as Promise<T>;
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ accessToken: string; admin: AdminUser }> {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function listPendingPhotos(): Promise<{ reviews: PendingPhoto[] }> {
  return apiFetch("/photos/pending");
}

export async function reviewPhoto(
  reviewId: string,
  action: "approve" | "deny"
): Promise<{ message: string }> {
  return apiFetch(`/photos/${reviewId}`, {
    method: "PATCH",
    body: JSON.stringify({ action }),
  });
}

export async function listUsers(
  page: number,
  search?: string
): Promise<{ users: AdminListUser[]; page: number; hasMore: boolean }> {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("search", search);
  return apiFetch(`/users?${params}`);
}

export async function blockUser(userId: string): Promise<{ message: string }> {
  return apiFetch(`/users/${userId}/block`, { method: "POST" });
}

export async function unblockUser(userId: string): Promise<{ message: string }> {
  return apiFetch(`/users/${userId}/unblock`, { method: "POST" });
}

export async function toggleElite(
  userId: string,
  elite: boolean,
  planKey?: string,
): Promise<{ message: string; isElite: boolean; planKey: string | null }> {
  return apiFetch(`/users/${userId}/elite`, {
    method: "PATCH",
    body: JSON.stringify({ elite, planKey }),
  });
}

// ── Billing ──────────────────────────────────────────────────────────────────

export type AdminSubscription = {
  id: string;
  userId: string;
  userName: string;
  displayId: string;
  planKey: string;
  months: number;
  amountCents: number;
  currency: string;
  status: string;
  autoRenew: boolean;
  periodEnd: string | null;
  cancelledAt: string | null;
  eliteGrantedAt: string | null;
  createdAt: string;
};

export async function listAdminSubscriptions(
  page: number,
): Promise<{ subscriptions: AdminSubscription[]; hasMore: boolean }> {
  return apiFetch(`/billing/subscriptions?page=${page}`);
}

export type AdminRefundRequest = {
  id: string;
  userId: string;
  userName: string;
  displayId: string;
  subscriptionId: string;
  planKey: string;
  amountCents: number;
  currency: string;
  reason: string;
  otherText: string | null;
  status: "pending" | "approved" | "rejected";
  adminNote: string | null;
  createdAt: string;
  eliteGrantedAt: string | null;
};

export async function listAdminRefundRequests(
  status?: string,
): Promise<{ requests: AdminRefundRequest[] }> {
  const q = status ? `?status=${status}` : "";
  return apiFetch(`/billing/refund-requests${q}`);
}

export async function reviewAdminRefundRequest(
  id: string,
  action: "approved" | "rejected",
  adminNote?: string,
): Promise<{ message: string }> {
  return apiFetch(`/billing/refund-requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ action, adminNote }),
  });
}

export type AdminPromoCode = {
  id: string;
  code: string;
  discountLkr: number;
  discountUsdCents: number;
  isActive: boolean;
  expiresAt: string | null;
  maxUses: number | null;
  usedCount: number;
  createdAt: string;
};

export async function listAdminPromoCodes(): Promise<{ promoCodes: AdminPromoCode[] }> {
  return apiFetch("/billing/promo-codes");
}

export async function createAdminPromoCode(data: {
  code: string;
  discountLkr: number;
  discountUsdCents: number;
  maxUses?: number;
  expiresAt?: string;
}): Promise<{ promoCode: AdminPromoCode }> {
  return apiFetch("/billing/promo-codes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAdminPromoCode(
  id: string,
  data: { isActive?: boolean; maxUses?: number | null },
): Promise<{ message: string }> {
  return apiFetch(`/billing/promo-codes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteAdminPromoCode(id: string): Promise<{ message: string }> {
  return apiFetch(`/billing/promo-codes/${id}`, { method: "DELETE" });
}

export type ClosedUser = {
  id: string;
  displayId: string;
  name: string;
  gender: string;
  email: string;
  phone: string | null;
  closeReason: string | null;
  closedAt: string;
  daysRemaining: number;
};

export async function listClosedAccounts(
  page: number
): Promise<{ users: ClosedUser[]; page: number; hasMore: boolean }> {
  return apiFetch(`/users/closed?page=${page}`);
}

export async function getAdminStats(): Promise<{
  totalUsers: number;
  blockedUsers: number;
  eliteUsers: number;
  closedUsers: number;
  pendingPhotos: number;
  trustBadgeUsers: number;
}> {
  return apiFetch("/stats");
}
