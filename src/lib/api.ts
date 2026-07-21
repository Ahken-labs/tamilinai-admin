const BASE = process.env.NEXT_PUBLIC_API_URL;

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
  elitePlanKey?: string | null;
  isBlocked: boolean;
  isClosed: boolean;
  isOnBreak: boolean;
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
  search?: string,
  filter?: "blocked" | "elite" | "on_break" | "seeded",
): Promise<{ users: AdminListUser[]; page: number; hasMore: boolean }> {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("search", search);
  if (filter) params.set("filter", filter);
  return apiFetch(`/users?${params}`);
}

export async function blockUser(userId: string): Promise<{ message: string }> {
  return apiFetch(`/users/${userId}/block`, { method: "POST" });
}

export async function unblockUser(userId: string): Promise<{ message: string }> {
  return apiFetch(`/users/${userId}/unblock`, { method: "POST" });
}

export async function clearAboutMe(userId: string): Promise<{ message: string }> {
  return apiFetch(`/users/${userId}/clear-about-me`, { method: "POST" });
}

export async function toggleElite(
  userId: string,
  elite: boolean,
  planKey?: string,
  amountPaid?: number,
): Promise<{ message: string; isElite: boolean; planKey: string | null }> {
  return apiFetch(`/users/${userId}/elite`, {
    method: "PATCH",
    body: JSON.stringify({ elite, planKey, amountPaid }),
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
): Promise<{ refundRequests: AdminRefundRequest[]; hasMore: boolean }> {
  const q = status ? `?status=${status}` : "";
  return apiFetch(`/billing/refund-requests${q}`);
}

export async function reviewAdminRefundRequest(
  id: string,
  action: "approve" | "reject",
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
  discountGbpCents: number;
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
  discountGbpCents: number;
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

// ── SEED USERS ────────────────────────────────────────────────────────────────
// remove this section once website gets real profile traffic

export type SeedUser = {
  id: string;
  displayId: string;
  name: string;
  gender: string;
  profileType: string;
  trustBadge: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  photoUrl: string | null;
};

export async function listSeedUsers(page = 1): Promise<{ users: SeedUser[]; page: number; hasMore: boolean }> {
  return apiFetch(`/users/seeded?page=${page}`);
}

export async function createSeedUser(formData: FormData): Promise<{ user: SeedUser; warning?: string }> {
  const token = getToken();
  const res = await fetch(`${BASE}/api/admin/users/seed`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    window.location.href = "/";
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? "Failed to create seed user");
  }
  return res.json();
}

export async function deleteSeedUser(userId: string): Promise<{ success: boolean }> {
  return apiFetch(`/users/seed/${userId}`, { method: "DELETE" });
}

// end-removal ─────────────────────────────────────────────────────────────────

export type AdminUserDetail = {
  id: string;
  displayId: string;
  name: string;
  email: string;
  phone: string | null;
  countryCode: string;
  gender: string;
  profileType: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isProfileComplete: boolean;
  isElite: boolean;
  elitePlanKey?: string | null;
  eliteExpiresAt: string | null;
  isBlocked: boolean;
  isOnBreak: boolean;
  breakEndsAt: string | null;
  isClosed: boolean;
  closedAt: string | null;
  closeReason: string | null;
  trustBadge: boolean;
  profileCompletionScore: number;
  contactViewLimitOverride: number | null;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string | null;
  profile: {
    dateOfBirth: string | null;
    maritalStatus: string | null;
    heightCm: number | null;
    weightKg: number | null;
    education: string | null;
    occupation: string | null;
    religion: string | null;
    caste: string | null;
    country: string | null;
    city: string | null;
    aboutMe: string | null;
    monthlyIncome: number | null;
    incomeCurrency: string | null;
    fatherOccupation: string | null;
    motherOccupation: string | null;
    brotherCount: number | null;
    brothersMarried: number | null;
    sisterCount: number | null;
    sistersMarried: number | null;
    dietHabit: string | null;
    smokingHabit: string | null;
    drinkingHabit: string | null;
    physicalBuild: string | null;
    residentStatus: string | null;
    sector: string | null;
    educationDetail: string | null;
    languagesSpoken: string[] | null;
    hobbies: string[] | null;
    photoVisibility: string;
    photoStatus: string;
    hasPhoto: boolean;
  } | null;
};

export async function getAdminUser(userId: string): Promise<AdminUserDetail> {
  return apiFetch(`/users/${userId}`);
}

export async function getUserPhoto(userId: string): Promise<{ photoUrl: string }> {
  return apiFetch(`/users/${userId}/photo`);
}

export async function editUserName(userId: string, name: string): Promise<{ message: string; name: string }> {
  return apiFetch(`/users/${userId}/name`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export async function setContactLimit(
  userId: string,
  limit: number | null,
): Promise<{ message: string; contactViewLimitOverride: number | null }> {
  return apiFetch(`/users/${userId}/contact-limit`, {
    method: "PATCH",
    body: JSON.stringify({ limit }),
  });
}

export type AdminNotification = {
  id: string;
  type: string;
  userId: string | null;
  userName: string | null;
  displayId: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export async function sendAdminNotification(data: {
  broadcast?: boolean;
  userId?: string;
  title: string;
  message?: string;
}): Promise<{ message: string; count?: number }> {
  return apiFetch("/notifications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAdminNotifications(
  page = 1,
): Promise<{ notifications: AdminNotification[]; page: number; hasMore: boolean; unreadCount: number }> {
  return apiFetch(`/notifications?page=${page}`);
}

export type NotificationHistoryEntry = {
  batchId: string;
  title: string | null;
  message: string | null;
  sentAt: string;
  mode: 'broadcast' | 'specific';
  recipientCount: number;
  targetUser: { id: string | null; name: string | null; displayId: string | null } | null;
};

export async function getNotificationHistory(
  page = 1,
): Promise<{ history: NotificationHistoryEntry[] }> {
  return apiFetch(`/notifications/history?page=${page}`);
}

export async function deleteNotificationBatch(batchId: string): Promise<{ message: string }> {
  return apiFetch(`/notifications/history/${batchId}`, { method: "DELETE" });
}

export type AdminStats = {
  totalUsers: number;
  blockedUsers: number;
  eliteUsers: number;
  closedUsers: number;
  onBreakUsers: number;
  pendingPhotos: number;
  trustBadgeUsers: number;
  usersLast7Days: number;
  usersLast30Days: number;
  eliteLast7Days: number;
  eliteLast30Days: number;
  activeUsersLive: number;
  inactiveUsers45d: number;
  inactiveUsers7d: number;
  dailyActiveHistory: { date: string; count: number }[];
};

export async function getAdminStats(): Promise<AdminStats> {
  return apiFetch("/stats");
}

export type InactiveUser = {
  id: string;
  displayId: string;
  name: string;
  gender: string;
  countryCode: string;
  phone: string | null;
  lastActiveAt: string;
  inactiveDays: number;
  inactivityWarningSentAt: string | null;
  calledAt: string | null;
  callNote: string | null;
};

export async function listInactiveUsers(days = 45): Promise<{ users: InactiveUser[] }> {
  return apiFetch(`/users/inactive?days=${days}`);
}

export async function markUserCalled(
  userId: string,
  callNote?: string,
): Promise<{ success: boolean }> {
  return apiFetch(`/users/${userId}/called`, {
    method: "PATCH",
    body: JSON.stringify({ callNote }),
  });
}

export type AdminBankTransferOrder = {
  id: string;
  planKey: string;
  months: number;
  amountCents: number;
  currency: string;
  promoCode: string | null;
  discountCents: number;
  receiptUrl: string | null;
  receiptPresignedUrl: string | null;
  status: "pending" | "approved" | "rejected";
  adminNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
  userName: string | null;
  userDisplayId: string | null;
  userGender: string | null;
  userEmail: string | null;
  userPhone: string | null;
  userCountryCode: string;
};

export async function getBankTransfer(orderId: string): Promise<AdminBankTransferOrder> {
  return apiFetch(`/billing/bank-transfers/${orderId}`);
}

export async function listBankTransfers(
  status = "pending",
  page = 1,
): Promise<{ orders: AdminBankTransferOrder[]; page: number; hasMore: boolean }> {
  return apiFetch(`/billing/bank-transfers?status=${status}&page=${page}`);
}

export async function reviewBankTransfer(
  orderId: string,
  payload: {
    action: "approve" | "reject";
    newPlanKey?: string;
    adminNote?: string;
    adminPassword?: string;
  },
): Promise<{ success: boolean; message: string }> {
  return apiFetch(`/billing/bank-transfers/${orderId}/review`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function downloadBankReceiptBlob(orderId: string): Promise<{ blob: Blob; filename: string }> {
  const token = getToken();
  const res = await fetch(`${BASE}/api/admin/billing/bank-transfers/${orderId}/download-receipt`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to download receipt");
  const cd = res.headers.get("Content-Disposition") ?? "";
  const match = cd.match(/filename="([^"]+)"/);
  const shortId = orderId.slice(0, 8).toUpperCase();
  const date = new Date().toISOString().slice(0, 10);
  const filename = match?.[1] ?? `${shortId}-receipt-${date}`;
  const blob = await res.blob();
  return { blob, filename };
}

export async function adminUploadBankReceipt(
  orderId: string,
  file: File,
): Promise<{ success: boolean; receiptPresignedUrl: string }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const formData = new FormData();
  formData.append("receipt", file);
  const res = await fetch(`${BASE}/api/admin/billing/bank-transfers/${orderId}/upload-receipt`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? "Upload failed");
  }
  return res.json();
}

// ─── Business vendor ───────────────────────────────────────────────────────────

export type AdminBusinessSummary = {
  id: string;
  username: string;
  businessName: string;
  category: string;
  district: string;
  createdAt: string;
  isApproved: boolean;
  isRejected: boolean;
};

export type AdminBizServicePhoto = { id: string; url: string; displayOrder: number };
export type AdminBizService = {
  id: string;
  title: string;
  price: number;
  description: string;
  displayOrder: number;
  photos: AdminBizServicePhoto[];
};

export type AdminBusinessDetail = AdminBusinessSummary & {
  specify?: string;
  bio?: string;
  experience: string;
  qualifications?: string;
  careerHighlight?: string;
  village: string;
  streetAddress?: string;
  countryCode: string;
  serviceDistricts: string[];
  islandWide: boolean;
  coverPhotoUrl: string | null;
  logoUrl: string | null;
  rejectionReason?: string;
  approvedAt?: string;
  services: AdminBizService[];
};

export async function listAdminBusinesses(
  status: "pending" | "approved" | "rejected",
  page = 1,
): Promise<{ businesses: AdminBusinessSummary[]; page: number; hasMore: boolean }> {
  return apiFetch(`/businesses?status=${status}&page=${page}`);
}

export async function getAdminBusiness(id: string): Promise<AdminBusinessDetail> {
  return apiFetch(`/businesses/${id}`);
}

export async function reviewAdminBusiness(
  id: string,
  payload: { action: "approve" | "reject"; rejectionReason?: string },
): Promise<{ ok: boolean }> {
  return apiFetch(`/businesses/${id}/review`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
