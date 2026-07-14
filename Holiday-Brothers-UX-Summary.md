# Holiday Brothers — Full UX & Systems Summary

*Compiled reference covering everything mapped in this conversation, organized by user journey and by the cross-cutting systems that connect them. This document is now complete end-to-end — see §9 for the handful of items deliberately deferred to a later numbers/details pass, and §10 for the final Legal Research checklist.*

---

## 1. Account & Role Model

- **One account per person, multiple roles layered on top.** A person is a Client, Crew (Builder/Driver/Both), Vendor, or Admin by default — but can hold more than one role (a vendor can also be a client; a builder can also drive). Multi-role accounts get a **role switcher** between dashboards rather than one blended UI.
- **Signup requires:** Username, First Name, Last Name, Email, Phone (at least one of Email/Phone required), Password *or* PIN.
- **System-issued:** Account ID (internal), Account Referral ID (one universal shareable code per person, used across all referral types).
- **Login:** identify via username / email / Account ID / phone number, authenticate via password / PIN / one-time code (SMS or email) / FaceID / fingerprint / passkey.
- **Passkeys:** schema-ready (credential ID + public key fields), but real WebAuthn implementation is deferred as its own later build — not needed for MVP functionality.
- **Recovery:** self-serve reset via email or SMS code. If someone is truly locked out (lost their only contact method), it falls back to a **manual, admin-verified recovery** — same pattern used for the no-smartphone accessibility fallback elsewhere in the system.
- **Guest ticket (clients only):** a lighter path that coexists with full accounts — phone number + order number + optional PIN, no full signup required. Can later be converted into a full account, merging booking history.
- **Every account gets a persistent 1:1 chat thread with Admin/CS**, regardless of role — Client, Crew, and Vendor all have one. This is a genuine, personally-staffed line, deliberately **not an AI chatbot** — the goal is for people to feel personally taken care of, not routed to a bot. Push notifications are scoped to **active job** threads only; the general 1:1 lines are checked, not pinged constantly.
- **Default bundle on every account**: Client, Referral, Chat, and Shop/merch access (universal, regardless of role) — plus the ability to Apply to Join the Crew, which is reachable even before a full account exists (see below).
- **How each role is actually obtained** (full detail in §5):
  - **Builder / Driver / Customer Service** — apply via the "Join the Crew" form (multi-select), reviewed and approved by Manager or Admin. Submitting this application is what creates the account in the first place if one doesn't exist yet — there's no separate signup-then-apply sequence.
  - **Vendor** — not available via normal signup. Obtained by submitting a Vendor Referral naming yourself, reviewed and approved by Manager or Admin. (No special-case blocking is needed for this self-referral — since all referral point payouts already require manual confirmation, a self-referral simply never gets points awarded, without any extra validation logic.)
  - **Manager** — invite-only, assigned directly by Admin. No self-application path exists.
  - **Admin** — a customizable role that can be handed to trusted sub-admins with a tailored (full or scoped) permission set.
  - **Owner** — a hardcoded backend constant, not a role assignable through any UI. Currently Herman's account only; any change requires an actual code edit, the same way the 2-person crew minimum does.
- **Referral pages** exist for every role, regardless of account type.
- **Four (really five) point systems** sit at the top of every dashboard: Priority Points (client), Incentive Points (crew), Referral Points (universal), Vendor Points (vendor), and Shop Points (universal redemption currency). Full detail in §7.

---

## 2. Client Journey

**Discovery → Booking**
- Finds Holiday Brothers via flyer, WhatsApp, Facebook group, billboard, or referral.
- Homepage has no nav menu — logo always returns home. Three CTAs: Sukkah Booking, Sign Up to Build, Admin View.
- Booking is a **collapsing stepper** — answered questions stay visible as dimmed rows above the active question.

**Stepper flow**
1. Already have supplies? (Yes/No — branches the rest of the flow; if Yes, self-delivery question is skipped entirely since it no longer applies)
2. Size: Small / Medium / Large
3. Type: Canvas / Modular / Construction
4. Speed tier: Patient / Regular / Express
5. If supplies are needed: self-delivery toggle, framed as **"self-deliver & save $X"** (delivery is included by default, self-delivery is a discount, not a surcharge). A separate discount also exists for clients who pick up the **workers** themselves.
6. Full address (always required)
7. Account creation (full account or guest ticket)

**Pricing**
- Labor/service cost is fairly firm (driven by type + speed tier).
- Materials cost is shown as a **range** by default, narrowing once real measurements or vendor data are available (Vendor pricing data is still being built out — see §9).
- A future **rental option** (for clients without storage or long-term need) is flagged but has no pricing model yet.
- If self-reporting measurements, the client must verify via **video submission, live FaceTime, or an in-person visit** before the quote is finalized.

**Status lifecycle (full chain):**
`Submitted Booking → Price Pending → Quote Sent → Job Confirmed → Scheduled → In Progress → Paid (Deposit Paid / Paid in Full) → Pending Completion → Completed`

- **Price Pending**: waiting on measurement verification.
- **Quote Sent**: admin has verified and locked the price.
- **Job Confirmed**: appears as **one single visual step** in the status tracker, backed by three underlying sub-stages shown as a progress fill *within* that one step, not as three separate stages:
  - **40%** — Client Confirms: client accepts the quote. This is the exact moment the **Job listing becomes visible to crew** (limited info only — neighborhood, type, lowest-tier pay).
  - **70%** — Crew Confirms: crew request/accept; admin manually appoints (see §3 for ranking logic).
  - **100%** — Admin Approves: final logistics checklist (§8) — the only stage with a true hard block (2-person minimum). Hitting 100% here is what advances the booking to Scheduled.
- **Paid**: flexible — client can choose a custom deposit (percentage or flat dollar) or pay in full. Deposit size (and full-prepay) quietly feeds Priority Points (§7), which can outrank even a paid Express tier.
- **Pending Completion**: both client and crew tap "job done," but true `Completed` requires admin's own judgment that the client is actually satisfied — not just both buttons pressed.

**Contact & Communication**
- Persistent, always-on **private Client–Admin chat thread** — spans the whole relationship, not tied to any one job.
- A fresh **Job Group Thread** is created per job (Client + assigned Crew + Admin) once Scheduled. One visible channel to everyone, plus a greyed-italic "aside" layer visible only to crew/admin, invisible to the client.
- No direct Client–Crew private channel ever exists in-app — only the shared group thread, or off-app once contact info is exchanged.
- "Provide personal contact info": one side offers unilaterally, the other must actively consent to view before it unlocks. On desktop, multiple chat windows can be open concurrently.

**Day of the job**
- One shared confirmation code is texted to both client and all assigned crew.
- Dual verification: client shows crew the code (crew inputs it), crew shows client the code (client inputs it). Both directions confirmed = job unlocked to begin.
- Accessibility fallback: for those without smartphone/app access, confirmation happens by texting the admin directly, who manually marks it confirmed.
- Personal contact info restriction (crew under 16 blocked from sharing) auto-lifts day-of — direct calling info shared automatically with client, crew, admin, and guardians as applicable.
- Client logs their own independent `began / break began / break ended / ended` timestamps in parallel with crew's — the system auto-flags any discrepancy beyond an admin-configurable threshold for manual review.
- **Emergency access**: entering the confirmation code unlocks access to crew's emergency contact info, available from job start through 30 minutes after admin confirms completion. Actually opening that info (not just having it available) triggers an automated phone call to admin and auto-spawns a 24–48hr follow-up task.

**Payment**
- Zelle, PayPal, Venmo, CashApp (standard digital).
- Cash or check — shown on the stepper, clearly labeled as requiring a confirmation call and personal pickup by admin.
- Physical card reader — considered, tabled for a future season.

**Cancellation & Rescheduling**
- **Cancel**: free until 7:30 PM the night before the build day (fixed clock cutoff regardless of the job's own time). After that: tiered fee — smaller if more than 12 hours before job start, bigger if within 12 hours. Fee is deducted from whatever's paid, not a blanket forfeiture. Admin can waive/reduce for genuine emergencies.
- **Reschedule** (separate policy): free anytime until 1.5 hours before the job. Priority Points on that booking are forfeited if rescheduled within 3 hours of the job, even though the reschedule itself may still be fee-free between 1.5–3 hours out.
- **Weather Hold**: its own distinct, no-fault, admin-triggered status — no penalty to anyone.

**Follow-up**
- Marking a job Completed auto-schedules an internal admin reminder 2–3 business days out.
- The customer gets **no advance warning** — it's meant to feel like a genuine, unprompted check-in.
- May prompt a testimonial ask, and — for guest tickets — an offer to convert into a full account, merging history.

**Points earned as a client**
- Priority Points: flat amount per tier at booking (Patient 45 / Regular 75 / Express 100), booking also *costs* Priority Points (Patient 30 / Regular 60 / Express 90), plus 1 point per dollar deposited early.
- Referral Points: from referring crew/clients/vendors, gifting at merch checkout, and from reviews.
- Reviewing crew: client leaves both an aggregate job-level review and (optionally) individual per-crew-member ratings. Client earns Referral Points; the crew member reviewed earns Incentive Points. Job-level reviews are testimonial-eligible (see §6); individual ratings stay private.

---

## 3. Crew Journey (Builder / Driver)

**Sign-up & Registration**
- Fields: name, phone, **birthday** (not raw age — age is computed, and the system checks whether the applicant will turn 16 during the current admin-configured season).
- Role at signup (applicant's choice, not admin-assigned): **Builder Only / Builder + Driver / Driver Only** — any role that includes driving also picks a sub-type: Supplies only / Crew only / Both.
- Availability: opt-out model — default available everywhere, crew mark exceptions by recurring day-of-week and/or specific time slots. Shabbos (Friday, 2hrs pre-sunset, through Saturday, 2hrs post-sunset), Rosh Hashana, and Yom Kippur are auto-blocked using real zmanim (sunset/holiday time) data, not fixed clock hours. Yom Kippur night specifically requires 18+ or parental consent.
- School/Yeshiva: checkbox + free-text "where do you attend." Parental/guardian contact required **only if under 16**, regardless of context (this applies the same way to fast-day work).
- Prior work: simple checkbox, used as an admin-facing highlight flag.
- Address: full address required if no guaranteed transport; street only if transport is guaranteed. The form explicitly warns that selecting "guaranteed transport" means admin will **never** default to arranging pickup for them. Free-text notes field for edge cases.
- Emergency contact: **required for every applicant, any age.**
- Liability waiver: checkbox for now (legal upgrade path TBD — see §10).
- Medical experience: checkbox; if yes, a certification/proof upload is required. Explicitly covered by the same waiver — volunteering medical info creates no additional liability.

**Approval status**
`Submitted → [optional Interview/Call, admin-toggled per applicant] → Under Review → Approved / Denied`
- Denied carries a reason: **Not a Fit** (full lockout, tied to phone/email identity, not device) or **At Capacity** (behaves exactly like Pending).
- **Pending/At-Capacity crew** can: browse jobs (neighborhood, job type, lowest-tier pay only — never client cost), message admin, see their own approval stage, see the incentive program, and hit **"Request This Job"** (instead of Accept) to signal demand and bump queue priority.

**Getting a job**
- Role match (Builder/Driver as the job needs) is a **hard gate** — filter, not a ranking factor.
- Eligible requesters are ranked: **Incentive tier → Best Fit (proximity + availability) → First-come.** Inside 2 days of the job date, ranking collapses to pure first-come. Admin always manually appoints — the system never auto-assigns.
- Once **assigned** (not just requesting), full address and job data unlock immediately. Client contact info stays withheld until 3 business days prior. A notification fires every time crew gains a new tier of info.
- Crew also have the same persistent 1:1 Admin chat thread described in §1, independent of any specific job — plus the per-job Group Thread once assigned.

**Drivers vs. Builders**
- **Driver Only** never builds — strictly drop-off/pick-up — specifically so admin can rely on them being available for driving duty rather than tied up building.
- A job's driving requirement is auto-derived, not manually set: supply pickup ← client's self-delivery choice; crew pickup ← whether the *specific assigned builders* have guaranteed transport.
- Driving pay is separate and mileage/time-based, distinct from flat build pay.

**Button flow for a Builder+Driver on one job:**
`Begin Drive → (arrive) Begin Job [ends drive timer, starts build log] → (finish) Begin Drive [ends job, starts return-drive timer] → End Drive`
— reduces to 4 taps total, each middle tap doing double duty. Builder-only and Driver-only keep simpler standalone sequences.

**Admin Approval (final gate before Scheduled)**
- A pass/fail checklist: role composition + 2-person minimum, driving resolved, consent flags cleared (under-16, fast-day, school), date/time locked, client Confirmed.
- Failed items are tappable to fix inline. The Approve button is always clickable — incomplete items trigger a warning modal, overridable by admin **except the 2-person minimum, which is a true hard block, no override.** If unstaffed, admin reschedules with the client rather than approving.

**Time tracking (in progress)**
- Builders log their own `began/break/ended` individually — this feeds the **points/incentive system only**, since build pay is flat per job regardless of actual hours.
- Drivers have a separate, dedicated time-based timer for driving pay specifically.
- Rounding to a 5–10 minute buffer is expected and tolerated, not punitively tracked. Bonus incentive points are available if a crew member can *prove* (photo/video, or two-person testimony) they didn't tap Begin Drive until the car actually started.

**Crew backing out of an accepted job**
- Job reopens to other crew immediately.
- A graduated point-deduction scale applies based on how last-minute the backout is (12+ hrs: none, 6–12: small, 3–6: bigger, 1.5–3: even bigger, under 1.5: much bigger) — but this is **never automatic**, always routed through admin review first, since most backouts aren't the crew member's fault.

**Payment**
- Same digital apps as clients (Zelle/Venmo/CashApp/PayPal) + cash in person.
- Crew chooses per-job or batched payout — batching earns bonus incentive points.
- Under-18 payment currently goes direct to the crew member; legal question parked (§10).

**Reviews & social**
- Crew reviews client (no points — private intel for admin on whether they're a good repeat client) and teammates, per-job (no points — private intel + pairing compatibility).
- A separate **"add friend"** system (worker ID + request + mutual confirm) lets crew flag who they work well with, informing future pairing.
- Client reviews of crew earn the crew member Incentive Points (and the client Referral Points).

**Incentive Points**
- Closed-loop, unpurchasable — the one currency nothing can buy into. Earned via $1 paid = 1 point, plus hours worked vs. break time, proven drive-timer honesty, and choosing batched payout.
- Drives the #1 ranking factor for job requests. Spendable at a fixed rate for Shop rewards, or usable toward Referral-tier redemptions — but wallets don't literally convert into each other; the *same reward item* is simply priced differently depending which currency is spent (see §7).

---

## 4. Vendor Journey

- Can double as a Client (multi-role account model).
- Vendors also have the same persistent 1:1 Admin chat thread described in §1.
- Profile fields: category, per-category pricing, stock status, service area (an open/expandable location field — intentionally not hardcoded to Rockland County, to future-proof geographic expansion), rental availability, photos, delivery capability.
- Status: `Submitted → Under Review → Approved` — same pattern as crew.
- **Three-sided intake**: (1) users/clients tipping off a new vendor, (2) vendors self-reporting their own stock/info, (3) admin manual entry. All three feed the same underlying pipeline.
- **Vendor Referral** (from the Referral Program) uses this exact same intake form — submitting legitimacy info, costs, and photos. The referrer earns Referral Points once the vendor is verified Approved (delayed payout, not immediate).
- **Vendor Points**: earned via business volume/value actually closed through Holiday Brothers, keeping stock/pricing data accurate and current, referrals brought in, and admin discretion — anything that serves the underlying goal of fast, accurate pricing for clients.
- **Tiers**: 3 to start, expandable later (exact names/thresholds still undecided — see §9). Reaching a points threshold doesn't auto-upgrade a vendor's tier — it prompts admin with a suggestion, weighted with price-competitiveness (a cheaper vendor can tier up ahead of a pricier one at similar points). Admin always makes the final call.
- Higher tier is surfaced to clients as a trust signal ("reliable, trustworthy, good prices") in **both** the booking stepper's Sourcing step and when self-delivery is chosen (so the client knows exactly where to go).

---

## 5. Admin View — Roles, Permissions & Full Journey

**Core design principle**: not a single admin panel, but a **live UI-on-top-of-the-UI**. Beyond a certain permission level, staff can browse the exact pages a Client/Crew/Vendor sees and edit fields directly in place, rather than working through a separate abstracted form for each thing. Operational list data with no natural page to overlay onto (crew queue, jobs list, follow-ups, chat inbox) stays as traditional dashboard/table views — the two approaches coexist.

### Permission architecture

Four tiers, from least to most powerful:

- **Custom roles** — built from individually toggleable permission flags (view chats, approve crew, override checklist items, broadcast to X, edit content, etc.) — Discord-style. Anyone with sufficient permission can create and configure these.
- **Customer Service, Manager, Admin** — three **default presets** built from that same toggle system, not hardcoded tiers. Out of the box they behave as a hierarchy (CS ⊆ Manager ⊆ Admin — each has everything the one below it has, plus more), but that's just the default configuration, not an architectural constraint. Any individual permission can be customized per role once custom roles are in play.
- **Admin** specifically remains a powerful, still-customizable role — it can be handed to a trusted sub-admin with a full or intentionally scoped-down permission set.
- **Owner** — the true ceiling, sitting above all of this. Hardcoded in the backend, not reachable or editable through any UI, exactly like the 2-person crew minimum. Currently a single account (Herman's); granting or transferring Owner status requires an actual code change, never a settings toggle.

### Role task lists (default preset behavior)

**Customer Service**
1. Unified inbox: persistent 1:1 threads (Client/Crew/Vendor) + active per-job Group Threads
2. Job Group Thread view with the dual-visibility layer (public message bar + greyed-italic CS/crew-only aside)
3. Active-worker badge in thread headers
4. "+ reference job" button, scoped to that person's own jobs
5. Group chat creation (multi-crew + staff)
6. Response-time escalation handling (offering the client a call option after no reply)
7. Manual accessibility-fallback confirmation (matching codes via text for those without smartphone/app access)
8. Broadcast messaging — narrowest tier: limited to participants of an existing thread they're already in

**Manager** (includes everything CS has, by default)
1. Crew application review (interview-toggle, Approve/Deny + reason)
2. Vendor application review (same pattern)
3. Ranked job-request queue → manually appoint crew
4. Admin Approval checklist — including soft-item override with the warning modal (customizable per role, on by default for Manager)
5. Price verification/locking (Price Pending → Quote Sent) — Manager is not just an approval role, it can issue final costs directly
6. Completion judgment call (client actually happy → true Completed)
7. Cancellation/reschedule fee decisions, emergency waivers
8. Crew backout point-deduction review
9. Manual point awards/adjustments across all 5 currencies
10. Vendor tier-up decisions
11. Season dates, availability windows, and other admin-configurable thresholds
12. Rewards/redemption fulfillment
13. Triggering Weather Hold
14. Emergency-info-access alerts and incident log review
15. Post-completion refunds/disputes and Referral/Vendor program abuse suspension (always starts here — Admin can take over)
16. Follow-Ups: Crew Application (starts directly with Manager, skips CS) + escalated items from CS (see ladder below)
17. Broadcast messaging — mid tier: one role-type segment at a time (e.g. "all active crew," "all clients this season")

**Admin (Full)** (includes everything Manager has, by default)
- Live page-overlay editing of Content, Pricing, Questions, Testimonials — same underlying **draft → publish workflow** as the existing CMS, just accessed by clicking the actual rendered element on the live page instead of a separate tab. Nothing goes live until explicitly published, regardless of entry point.
- System-level configuration: point exchange rates, notification defaults, quiet-hour rules, escalation thresholds
- Assigning CS/Manager/Admin roles to other accounts, and building custom roles
- Broadcast messaging — top tier: no restriction, any size, any combination of role-types
- Broad override authority everywhere **except** the 2-person crew minimum and Owner status, both hardcoded and untouchable through any UI, by anyone

### Follow-Ups escalation ladder

Two ways a task moves to a higher tier: it ages past its threshold and auto-surfaces, or a higher tier manually takes it over at any time (Manager can pull from CS, Admin can pull from either) — takeover doesn't require waiting for the threshold. Visibility is **cumulative, not a handoff**: once escalated, the task stays visible to the lower tier too, it just now also shows up for whoever it escalated to.

| Category | CS | Manager | Admin |
|---|---|---|---|
| Unpaid Balance | 0–3 days | 3–7 days | 7+ days |
| Stalled Quotes | 0–5 days | 5–10 days | 10+ days |
| Post-Job Call | 0–4 days past the 2–3 day window | 4–8 days | 8+ days |
| Crew Application | — (starts directly at Manager, CS never sees it) | 0–10 days | 10+ days |

(Thresholds above are proposed starting defaults, not fixed — they'd live in the same admin-configurable settings table as everything else.)

### Existing admin panel → new role model (proposed, not yet confirmed)

| Existing built tab | Proposed new home |
|---|---|
| Leads, Jobs, Notify | Manager |
| Crew (applications) | Manager |
| Chats | CS (with Manager/Admin takeover) |
| Content, Pricing, Questions, Testimonials | Full Admin (page-overlay) |
| Rewards | Split — Manager (fulfillment) / Admin (catalog & pricing)? |

*This mapping is a first pass and still needs Herman's sign-off — flagged in §9.*

---

## 6. Ratings & Reviews

| Reviewer → Reviewed | Points awarded | Purpose |
|---|---|---|
| Client → Crew (per-job aggregate + optional individual) | Client earns Referral Points, Crew earns Incentive Points | Real consequence both ways |
| Crew → Client | None | Private intel for admin — is this a client worth prioritizing again |
| Crew → Crew (teammate, per-job) | None | Private intel + pairing, alongside the separate friend-graph |
| Client → Company (job-level review) | Feeds Testimonials | Only suggested to admin at 4★+, never auto-published; notify-and-manual-publish, with room to redact personal info first |

**Format**: 5 base stars with half-star increments, plus the ability to add 1–2 *bonus* stars for genuinely exceptional service (so 5 stars = excellent baseline, 6–7 reserved for standout). Optional structured categories underneath, optional free text.

---

## 7. Points Economy (5 currencies)

1. **Priority Points (Client)** — rewards commitment (booking tier + early/full deposit). Buys queue priority, can outrank a paid Express tier.
2. **Incentive Points (Crew)** — closed-loop, cannot be purchased with any other currency. Earned only through real paid work and good behavior. The #1 factor in crew job-ranking.
3. **Referral Points (Universal)** — low-stakes discount currency, earned via referrals and reviews.
4. **Vendor Points (Vendor)** — spent on Vendor Tiers, which affect visibility/recommendation.
5. **Shop Points (Universal)** — the common redemption sink for merch; 1 SP = 1% off.

**Important correction locked in late in this conversation**: points **do not literally convert or transfer between wallets.** There is no swap mechanism. What varies is that the *same reward item* (e.g. a piece of merch) can be priced differently depending on which currency is used to pay for it — and those cross-currency prices are intentionally, deliberately **asymmetric** in each direction (a "house edge" on every redemption path), to discourage gaming the system rather than genuinely earning and using points as intended. All exchange/pricing rates are admin-configurable.

A separate bonus mechanic rewards big *native* spends (e.g. spending 10 Priority Points on priority itself, not on merch) with a small bonus Shop Point — encouraging genuine use over hoarding.

**Guiding philosophy** (in Herman's words): the goal is to incentivize desired behavior without ever being punitive or automatically enforced — reflected throughout in patterns like "the system suggests, admin decides" and graduated-but-never-automatic point penalties.

---

## 8. Notifications, Follow-Ups, Cancellations

**Notifications**
- Channels: SMS, Push, In-app, Email — all individually toggleable per person. SMS + Push recommended as the default.
- **Shabbos/Yom Tov quiet hours apply universally, with zero exceptions** — even day-of confirmation codes and emergencies wait for a digital notification to fire. (Real emergencies are still handled by an actual phone call, which isn't part of the queued digital notification system.)

**Admin Follow-Ups**
- Built as a generic, extensible Tasks system — any event can spawn a follow-up, not a fixed list.
- Priority order: **Unpaid Balance → Stalled Quotes → Post-Job Call → Crew Application** — with a manual "Crew Shortage Mode" toggle that bumps Crew Application to #2 when workers are scarce.
- Within each category, sub-ranked by age/severity (oldest/most severe first).
- Shown both as a unified dashboard and inline within each relevant admin tab.

**Cancellations & Rescheduling** — see §2 (Client) and §3 (Crew backout) for the full tiered policies. Both sides ultimately route through admin discretion for genuine emergencies.

---

## 9. Open Items — Not Yet Decided

These surfaced during the conversation but were explicitly deferred or never fully resolved:

- Exact dollar amounts / thresholds for: Vendor Tier names and point thresholds, the full Rewards catalog, default admin-configurable settings (Shabbos notification handling edge cases, time-discrepancy threshold, default deposit percentages), driving pay rate.
- Rental pricing for sukkahs (flagged early as a real gap — no reference pricing exists yet).
- **Pricing model — structure resolved, exact dollar values still TBD.** Formula: `Price = Base + Size Modifier + Speed Modifier + Type Modifier`. **Base** = Small / Canvas / Regular (the simplest, cheapest anchor combo). **Type** has 3 tiers, increasing in cost: Canvas (easiest) → Modular (includes Puzzle-like Wooden as a same-priced sub-style — no separate modifier) → Construction (hardest, formerly called "nail-wood"). **Size** is normalized to Small/Medium/Large across all types uniformly — the old binary Small/Big split becomes the new Small/Large endpoints, with Medium introduced as the genuinely new middle tier. **Medium Modular Regular** serves as a calibration check: once real numbers are set, `Base + Medium-modifier + Modular-modifier` should land close to that known real-world price. Critically, **Base and every modifier should be derived bottom-up from actual crew pay for that specific job configuration plus admin margin** — consistent with the cost-plus pricing philosophy from the original brand deck — not picked as arbitrary top-down markups. Actual dollar figures for Base and each modifier are the one remaining open piece.
- Multi-holiday/product expansion (menorahs, matzah, wine, per the brand deck) — architecture should stay flexible for this, but it's explicitly not being solved now.
- Admin-facing analytics/reporting (season revenue, performance stats) — not discussed at all yet.
- Data retention/privacy specifics, especially for minors' data.
- **The existing admin panel → new role model mapping** (§5) is a first pass only — needs Herman's confirmation, not yet locked in.
- **The full enumerated permission list** (every individual toggle across CS/Manager/Admin) hasn't been spelled out — the architecture (granular, customizable, preset-based) is decided, but the exhaustive flag-by-flag list is its own later pass, same category of work as the pricing numbers and reward catalog.

---

## 10. Legal Research — Final Checklist

Compiled from everything flagged across this entire conversation, grouped by theme.

**Labor & Minors**
1. Liability waiver — is a checkbox legally sufficient, or does it need a real signature (and from whom, if the applicant is a minor)?
2. Worker classification — 1099 contractor vs. W2 employee, especially for minors, and how that affects tax withholding.
3. Minor labor law (NY / Rockland County specifically) — permitted work hours, night-work restrictions, and whether payment can go directly to a minor without guardian involvement.
4. Workers' comp / liability insurance requirements for physical labor involving minors.
5. Minors creating and holding their own login credentials — any restriction under applicable law?
6. Direct payment to minors — specific legal requirements by state/situation.

**Business Structure & Licensing**
7. Business name/trademark registration (flagged in the original brand deck as unresolved).
8. Home improvement / contractor licensing — does NY or Rockland County require a licensed contractor for structures like sukkahs, particularly the Construction type (wood, fasteners, more permanent build)?
9. General business liability insurance, separate from workers' comp — is Holiday Brothers adequately covered as a business, not just per-worker?

**Financial & Consumer Protection**
10. Driving liability — do crew members' personal auto policies cover business use, or does Holiday Brothers need its own commercial auto/liability coverage?
11. Client deposit handling — does NY regulate how contractors collect or hold client deposits before work is performed (home-improvement deposit/escrow rules are common and would directly affect the flexible deposit system in §2)?
12. Cancellation fee structure — does NY consumer protection law impose any limits or required disclosures on service cancellation fees, given the tiered fee structure in §2?
13. Points/rewards program — since points convert to cash-equivalent bonuses and merch discounts, does this brush up against gift-card or unclaimed-property regulations in any way?

**Data, Privacy & Communications**
14. Medical-experience waiver language — confirming "volunteering to help ≠ liability" actually holds up.
15. Privacy Policy & Terms of Service — required, to be drafted; will need a required checkbox at signup once ready.
16. Data retention/privacy specifics, especially for minors' data.
17. TCPA / automated communications compliance — confirmation codes, emergency alerts, and broadcast messaging (§5) all involve automated texts and calls, which may require specific consent/opt-in language under telemarketing and robocall regulations.

---

*This is the final section — the full UX and systems plan, across every user journey, is complete as documented above.*
