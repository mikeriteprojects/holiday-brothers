/**
 * Row shapes mirror the Sheets tabs read/written by HolidayBrothersBackend.gs
 * (see SHEETS constant + appendRow_/getRows_ call sites there). Every row
 * carries whatever columns actually exist in that sheet — the index
 * signature covers columns a given action doesn't touch but the sheet may
 * still have (this backend is expected to grow, per handoff.md §6).
 */
type Row = {
  _row?: number;
  [key: string]: unknown;
};

export type Currency = "Priority" | "Incentive" | "Referral" | "Vendor" | "Shop";

export type BookingStatus =
  | "Submitted Booking"
  | "Price Pending"
  | "Quote Sent"
  | "Job Confirmed"
  | "Scheduled"
  | "In Progress"
  | "Paid"
  | "Pending Completion"
  | "Completed"
  | "Cancelled"
  | "Weather Hold";

export interface Account extends Row {
  account_id: string;
  account_referral_id?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  roles_csv?: string;
  status?: string;
  crew_subtype?: "builder" | "builder_driver" | "driver_only" | "";
  driving_subtype?: string;
  birthday?: string;
  school_yeshiva?: string;
  prior_work?: string;
  address?: string;
  transport_guaranteed?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  guardian_contact_name?: string;
  guardian_contact_phone?: string;
  medical_experience?: string;
  medical_cert_url?: string;
  waiver_accepted?: string;
  batch_payout_pref?: string;
  password_hash?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Booking extends Row {
  booking_code: string;
  account_id: string;
  has_supplies?: string;
  size?: "Small" | "Medium" | "Large" | "";
  sukkah_type?: "Canvas" | "Modular" | "Construction" | "";
  speed_tier?: "Patient" | "Regular" | "Express" | "";
  self_delivery_discount?: string;
  worker_pickup_discount?: string;
  address?: string;
  price_base?: number;
  price_size_mod?: number;
  price_speed_mod?: number;
  price_type_mod?: number;
  price_total?: number;
  measurement_verification_method?: string;
  status?: BookingStatus;
  job_confirmed_pct?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Job extends Row {
  job_id: string;
  booking_code: string;
  job_type?: string;
  date?: string;
  tier?: string;
  total_cost?: number;
  crew_pickup_needed?: string;
  supply_pickup_needed?: string;
  assignments_json?: string;
  staffing_mode?: string;
  status?: string;
  confirmation_code?: string;
  time_discrepancy_flag?: string;
  drive_start_at?: string;
  drive_end_at?: string;
  crew_began_at?: string;
  crew_ended_at?: string;
  client_began_at?: string;
  client_ended_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface JobAssignment {
  account_id: string;
  status: "requested" | "assigned";
  requested_at: string;
}

export interface OpenJobListing extends Row {
  job_id: string;
  job_type?: string;
  date?: string;
  tier?: string;
  neighborhood?: string;
  pay_amount?: number;
}

export interface Vendor extends Row {
  vendor_id: string;
  category?: string;
  pricing_json?: string;
  stock_status?: string;
  service_area?: string;
  rental_availability?: string;
  photos_csv?: string;
  delivery_capability?: string;
  status?: string;
  vendor_points?: number;
  tier?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PricingRow extends Row {
  formula_component: string;
  sukkah_type_or_tier: string;
  value: number | string;
  draft_value?: string;
  has_pending_draft?: string;
  last_updated_by?: string;
  last_updated_at?: string;
}

export interface ContentBlock extends Row {
  block_id: string;
  value: string;
}

export interface QuestionRow extends Row {
  question_id: string;
  label?: string;
  type?: string;
  options_csv?: string;
  order?: number;
  required?: string;
  active?: string;
  conditional_rule?: string;
  has_pending_draft?: string;
}

export interface TestimonialRow extends Row {
  testimonial_id: string;
  customer_name?: string;
  quote?: string;
  source_review_id?: string;
  featured?: string;
  published?: string;
  created_at?: string;
}

export interface SettingRow extends Row {
  key: string;
  value: string | number;
  draft_value?: string;
  has_pending_draft?: string;
  is_placeholder?: string;
  last_updated_by?: string;
  last_updated_at?: string;
}

export interface RewardRow extends Row {
  reward_id: string;
  label?: string;
  active?: string;
  cost_shop_points?: number;
  cost_priority_points?: number;
  cost_incentive_points?: number;
  cost_referral_points?: number;
  cost_vendor_points?: number;
  is_placeholder?: string;
}

export interface RedemptionRow extends Row {
  redemption_id: string;
  account_id: string;
  reward_id: string;
  currency_used: Currency;
  cost_paid: number;
  status: "Pending" | "Fulfilled";
  created_at?: string;
  fulfilled_by?: string;
  fulfilled_at?: string;
}

export interface ReviewRow extends Row {
  review_id: string;
  job_id?: string;
  reviewer_account_id: string;
  reviewed_account_id?: string;
  review_type: string;
  stars: number;
  bonus_stars?: number;
  category_scores_json?: string;
  text?: string;
  is_testimonial_candidate?: string;
  published?: string;
  created_at?: string;
}

export interface ChatThread extends Row {
  thread_id: string;
  thread_type: "persistent_1on1" | "job_group";
  account_ids_csv: string;
  job_id?: string;
  created_at?: string;
}

export interface ChatMessage extends Row {
  message_id: string;
  thread_id: string;
  sender_account_id: string;
  text: string;
  visibility: "public" | "aside";
  timestamp: string;
}

export interface TaskRow extends Row {
  task_id: string;
  category: string;
  related_id: string;
  current_tier: "CS" | "Manager" | "Admin";
  status: "Open" | "Resolved";
  assigned_to?: string;
  crew_shortage_mode?: string;
  notes?: string;
  created_at?: string;
  escalated_at?: string;
}

export interface IncidentRow extends Row {
  incident_id: string;
  type: string;
  related_id: string;
  triggered_by: string;
  details?: string;
  admin_phone_call_made?: string;
  created_at?: string;
}

export interface PointsLedgerRow extends Row {
  ledger_id: string;
  account_id: string;
  currency: Currency;
  delta: number;
  reason?: string;
  related_id?: string;
  awarded_by?: string;
  timestamp?: string;
}

export interface RoleRow extends Row {
  role_id: string;
  role_name?: string;
  is_preset?: string;
  based_on_preset?: string;
  permissions_json: string;
  created_by?: string;
  created_at?: string;
}

export interface PermissionFlagRow extends Row {
  flag_id: string;
  [presetColumn: string]: unknown;
}

export interface NotificationRow extends Row {
  notification_id: string;
  audience: string;
  target?: string;
  message: string;
  channel_csv?: string;
  created_at?: string;
}

export interface CalculatedPrice {
  base: number;
  size_mod: number;
  speed_mod: number;
  type_mod: number;
  total: number;
}
