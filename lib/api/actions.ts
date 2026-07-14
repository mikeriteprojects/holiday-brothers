import { apiGet, apiPost } from "./client";
import type {
  Account,
  Booking,
  BookingStatus,
  ChatMessage,
  ChatThread,
  ContentBlock,
  Currency,
  IncidentRow,
  Job,
  NotificationRow,
  OpenJobListing,
  PermissionFlagRow,
  PointsLedgerRow,
  PricingRow,
  QuestionRow,
  RedemptionRow,
  RewardRow,
  ReviewRow,
  RoleRow,
  SettingRow,
  TaskRow,
  TestimonialRow,
  Vendor,
} from "./types";

/** Shared with every call that identifies the caller for permission checks. */
interface Actor {
  account_id: string;
}

// ===================================================================
// PUBLIC READS — no account/session required
// ===================================================================

export const getContent = () => apiGet<{ rows: ContentBlock[] }>("content");

export const getPricing = () => apiGet<{ rows: PricingRow[] }>("pricing");

export const getQuestions = () => apiGet<{ rows: QuestionRow[] }>("questions");

export const getVendors = () => apiGet<{ rows: Vendor[] }>("admin_vendors");

export const getRewards = () => apiGet<{ rows: RewardRow[] }>("admin_rewards");

export const getNotifications = (params: { audience?: string; target?: string } = {}) =>
  apiGet<{ rows: NotificationRow[] }>("notifications", params);

export const getBookingStatus = (params: { code: string; phone?: string }) =>
  apiGet<{ booking: Booking; job?: Job }>("booking_status", params);

export const getChatMessages = (params: {
  chat_code?: string;
  thread_id?: string;
  account_id?: string;
  since?: string;
}) => apiGet<{ rows: ChatMessage[] }>("chat_messages", params);

export const getWorkerOpenJobs = (params: { account_id?: string } = {}) =>
  apiGet<{ rows: OpenJobListing[] }>("worker_open_jobs", params);

export const getWorkerDashboard = (params: { worker_id?: string; account_id?: string }) =>
  apiGet<{
    worker: Account;
    balances: Record<Currency, number>;
    current_jobs: Job[];
    past_jobs: Job[];
    rewards: RewardRow[];
    redemptions: RedemptionRow[];
  }>("worker_dashboard", params);

// ===================================================================
// AUTH
// ===================================================================

export const identify = (identifier: string) =>
  apiPost<{ method: "password" | "email_code"; has_password: boolean; account_id: string; roles: string }>(
    "workerIdentify",
    { identifier }
  );

export const verifyCode = (params: { account_id: string; code: string }) =>
  apiPost<{ account_id: string; token: string }>("workerVerifyCode", params);

export const loginPassword = (params: { identifier?: string; account_id?: string; password: string }) =>
  apiPost<{ account_id: string; token: string; roles: string }>("workerLoginPassword", params);

export const setPassword = (params: { account_id: string; password: string }) =>
  apiPost<{ account_id: string; token: string }>("workerSetPassword", params);

export const adminLogin = (params: { username: string; password: string }) =>
  apiPost<{ account_id: string; token: string; permissions: Record<string, boolean> }>(
    "adminLogin",
    params
  );

// ===================================================================
// BOOKINGS
// ===================================================================

export interface BookingAnswers {
  account_id?: string;
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  guest_ticket?: boolean;
  has_supplies?: "TRUE" | "FALSE";
  size?: "Small" | "Medium" | "Large";
  sukkah_type?: "Canvas" | "Modular" | "Construction";
  speed_tier?: "Patient" | "Regular" | "Express";
  self_delivery?: "TRUE" | "FALSE";
  worker_pickup?: "TRUE" | "FALSE";
  address?: string;
  verification_method?: string;
  notes?: string;
}

export const submitBooking = (answers: BookingAnswers) =>
  apiPost<{ booking_code: string; price: { base: number; size_mod: number; speed_mod: number; type_mod: number; total: number }; account_id: string }>(
    "submitBooking",
    { answers }
  );

export const updateBookingStatus = (
  actor: Actor & { table: string; key_value: string; status: BookingStatus | string }
) => apiPost("updateStatus", actor);

export const deleteLead = (actor: Actor & { booking_code: string }) => apiPost("deleteLead", actor);

export const confirmClientConfirms = (params: { booking_code: string }) =>
  apiPost("confirmClientConfirms", params);

export const confirmCrewConfirms = (actor: Actor & { booking_code: string }) =>
  apiPost("confirmCrewConfirms", actor);

export const confirmAdminApproves = (actor: Actor & { booking_code: string }) =>
  apiPost("confirmAdminApproves", actor);

export const cancelBooking = (params: { booking_code: string; hours_until_job?: number }) =>
  apiPost<{ fee_charged: number }>("cancelBooking", params);

export const triggerWeatherHold = (actor: Actor & { booking_code: string }) =>
  apiPost("triggerWeatherHold", actor);

// ===================================================================
// CREW APPLICATIONS
// ===================================================================

export interface CrewApplicationAnswers {
  name?: string;
  email?: string;
  phone?: string;
  birthday: string;
  crew_role: "Builder Only" | "Builder + Driver" | "Driver Only";
  driving_subtype?: "Supplies only" | "Crew only" | "Both";
  school?: string;
  prior_work?: "TRUE" | "FALSE";
  address?: string;
  transport_guaranteed?: "TRUE" | "FALSE";
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  guardian_contact_name?: string;
  guardian_contact_phone?: string;
  medical_experience?: "TRUE" | "FALSE";
  medical_cert_url?: string;
  waiver_accepted?: "TRUE" | "FALSE";
}

export const submitCrewApplication = (answers: CrewApplicationAnswers) =>
  apiPost<{ account_id: string; age: number; requires_parental_consent: boolean }>(
    "submitCrewApplication",
    { answers }
  );

export const hireWorker = (actor: Actor & { applicant_id: string; email?: string }) =>
  apiPost("hireWorker", actor);

// ===================================================================
// JOBS
// ===================================================================

export const createJob = (
  actor: Actor & {
    booking_code: string;
    job_type: string;
    date: string;
    tier: string;
    total_cost: number;
    crew_pickup_needed?: "TRUE" | "FALSE";
    supply_pickup_needed?: "TRUE" | "FALSE";
    assignments?: { account_id: string }[];
    mode?: string;
  }
) => apiPost<{ job_id: string }>("createJob", actor);

export const claimJob = (params: { job_id: string; worker_id?: string; account_id?: string }) =>
  apiPost("claimJob", params);

export const markJobDone = (params: { job_id: string; role: "client" | "crew" }) =>
  apiPost("markJobDone", params);

export const crewButtonTap = (params: { job_id: string }) =>
  apiPost<{ next_label: string | null; status?: string }>("crewButtonTap", params);

export const setPayoutPreference = (params: { account_id: string; batch: boolean }) =>
  apiPost("setPayoutPreference", params);

export const completeJob = (actor: Actor & { job_id: string; booking_code: string }) =>
  apiPost("completeJob", actor);

export const notifyClientJobDone = (params: { booking_code: string }) =>
  apiPost("notifyClientJobDone", params);

export const logTimestamp = (params: {
  job_id: string;
  actor: "client" | "crew";
  event: "began" | "break_began" | "break_ended" | "ended";
}) => apiPost("logTimestamp", params);

export const confirmDayOfCode = (params: { job_id: string; code: string }) =>
  apiPost<{ unlocked: boolean }>("confirmDayOfCode", params);

export const openEmergencyInfo = (params: { job_id: string; account_id: string }) =>
  apiPost<{ acknowledged: boolean }>("openEmergencyInfo", params);

// ===================================================================
// VENDORS
// ===================================================================

export const submitVendorReferral = (params: {
  referrer_account_id: string;
  category?: string;
  pricing_json?: string;
  stock_status?: string;
  service_area?: string;
  rental_availability?: "TRUE" | "FALSE";
  photos_csv?: string;
  delivery_capability?: "TRUE" | "FALSE";
  legitimacy_info?: string;
}) => apiPost<{ vendor_id: string }>("submitVendorReferral", params);

export const approveVendor = (actor: Actor & { vendor_id: string }) => apiPost("approveVendor", actor);

export const decideVendorTier = (actor: Actor & { vendor_id: string; tier: string }) =>
  apiPost("decideVendorTier", actor);

// ===================================================================
// CHAT
// ===================================================================

export const startChat = (params: { booking_code: string }) =>
  apiPost<{ chat_code: string }>("startChat", params);

export const sendMessage = (params: {
  chat_code?: string;
  thread_id?: string;
  sender?: string;
  account_id?: string;
  text: string;
  visibility?: "public" | "aside";
}) => apiPost("sendMessage", params);

export const createGroupChat = (actor: Actor & { account_ids: string[]; job_id?: string }) =>
  apiPost<{ thread_id: string }>("createGroupChat", actor);

export const getChatsList = (actor: Actor) => apiGet<{ threads: ChatThread[] }>("admin_chats", actor);

// ===================================================================
// REVIEWS & SOCIAL
// ===================================================================

export const submitReview = (params: {
  job_id?: string;
  reviewer_account_id: string;
  reviewed_account_id?: string;
  review_type: string;
  stars: number;
  bonus_stars?: number;
  category_scores?: Record<string, number>;
  text?: string;
}) => apiPost<{ review_id: string }>("submitReview", params);

export const addFriendRequest = (params: { requester_account_id: string; target_account_id: string }) =>
  apiPost("addFriendRequest", params);

export const respondFriendRequest = (params: { request_id: string; accept: boolean }) =>
  apiPost("respondFriendRequest", params);

// ===================================================================
// TASKS / FOLLOW-UPS
// ===================================================================

export const getTasks = (actor: Actor & { tier: "CS" | "Manager" | "Admin" }) =>
  apiGet<{ rows: TaskRow[] }>("admin_tasks", actor);

export const takeoverTask = (actor: Actor & { task_id: string; new_tier: string }) =>
  apiPost("takeoverTask", actor);

export const resolveTask = (params: { task_id: string }) => apiPost("resolveTask", params);

// ===================================================================
// ADMIN CMS — draft/publish
// ===================================================================

export type DraftableTable = "Content" | "Pricing" | "Questions" | "Testimonials" | "Settings";

export const saveDraft = (actor: Actor & { table: DraftableTable; row_key: string; new_value: string }) =>
  apiPost("saveDraft", actor);

export const publishDraft = (actor: Actor & { table: DraftableTable; row_key: string }) =>
  apiPost("publishDraft", actor);

export const publishAll = (actor: Actor) => apiPost("publishAll", actor);

export const createQuestion = (
  actor: Actor & {
    label: string;
    type: string;
    options?: string;
    order?: number;
    required?: "TRUE" | "FALSE";
    conditional_rule?: string;
  }
) => apiPost("createQuestion", actor);

export const createTestimonial = (
  actor: Actor & { customer_name: string; quote: string; source_review_id?: string }
) => apiPost("createTestimonial", actor);

export const createReward = (
  actor: Actor & {
    label: string;
    cost_shop_points?: number;
    cost_priority_points?: number;
    cost_incentive_points?: number;
    cost_referral_points?: number;
    cost_vendor_points?: number;
  }
) => apiPost("createReward", actor);

export const updateReward = (actor: Actor & { reward_id: string; field: string; value: unknown }) =>
  apiPost("updateReward", actor);

export const requestRedemption = (params: {
  worker_id?: string;
  account_id?: string;
  reward_id: string;
  currency: Currency;
}) => apiPost("requestRedemption", params);

export const fulfillRedemption = (actor: Actor & { redemption_id: string }) =>
  apiPost("fulfillRedemption", actor);

export const sendNotification = (
  actor: Actor & { audience: string; target?: string; message: string; channel_csv?: string }
) => apiPost("sendNotification", actor);

export const sendBroadcastEmail = (actor: Actor & { audience: string; subject: string; body: string }) =>
  apiPost<{ sent: number }>("sendBroadcastEmail", actor);

export const adjustPointsManual = (
  actor: Actor & { target_account_id: string; currency: Currency; delta: number; reason?: string }
) => apiPost<{ balance: number }>("adjustPointsManual", actor);

export const createCustomRole = (actor: Actor & { role_name: string; based_on_preset?: string }) =>
  apiPost<{ role_id: string }>("createCustomRole", actor);

export const toggleRolePermission = (actor: Actor & { role_id: string; flag_id: string; enabled: boolean }) =>
  apiPost("toggleRolePermission", actor);

export const assignStaffRole = (actor: Actor & { target_account_id: string; role_id: string }) =>
  apiPost("assignStaffRole", actor);

// ===================================================================
// ADMIN LIST READS
// ===================================================================

export const getAdminLeads = (actor: Actor) => apiGet<{ rows: Booking[] }>("admin_leads", actor);
export const getAdminCrew = (actor: Actor) => apiGet<{ rows: Account[] }>("admin_crew", actor);
export const getAdminWorkers = (actor: Actor) => apiGet<{ rows: Account[] }>("admin_workers", actor);
export const getAdminJobs = (actor: Actor) => apiGet<{ rows: Job[] }>("admin_jobs", actor);
export const getAdminVendors = () => apiGet<{ rows: Vendor[] }>("admin_vendors");
export const getAdminQuestions = (actor: Actor) => apiGet<{ rows: QuestionRow[] }>("admin_questions", actor);
export const getAdminTestimonials = (actor: Actor) =>
  apiGet<{ rows: TestimonialRow[] }>("admin_testimonials", actor);
export const getAdminRewards = () => apiGet<{ rows: RewardRow[] }>("admin_rewards");
export const getAdminRedemptions = (actor: Actor) =>
  apiGet<{ rows: RedemptionRow[] }>("admin_redemptions", actor);
export const getAdminPointsLedger = (actor: Actor) =>
  apiGet<{ rows: PointsLedgerRow[] }>("admin_points_ledger", actor);
export const getAdminRoles = (actor: Actor) => apiGet<{ rows: RoleRow[] }>("admin_roles", actor);
export const getAdminPermissionFlags = (actor: Actor) =>
  apiGet<{ rows: PermissionFlagRow[] }>("admin_permission_flags", actor);
export const getAdminSettings = (actor: Actor) => apiGet<{ rows: SettingRow[] }>("admin_settings", actor);
export const getPrioritySettings = (actor: Actor) =>
  apiGet<{ rows: SettingRow[] }>("priority_settings", actor);
export const getAdminIncidents = (actor: Actor) =>
  apiGet<{ rows: IncidentRow[] }>("admin_incidents", actor);
export const getAdminReviews = (actor: Actor) => apiGet<{ rows: ReviewRow[] }>("admin_reviews", actor);
export const getAdminContentAll = (actor: Actor) =>
  apiGet<{ rows: ContentBlock[] }>("admin_content_all", actor);
export const getAdminDrafts = (actor: Actor) =>
  apiGet<{ rows: (Record<string, unknown> & { table: DraftableTable })[] }>("admin_drafts", actor);
