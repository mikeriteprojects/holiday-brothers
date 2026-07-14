# Holiday Brothers — Handoff

*Written after a full product/UX planning session. No implementation happened in this session — everything below is design work, captured in full detail in `Holiday-Brothers-UX-Summary.md`, which should be read alongside this handoff.*

---

## 1) Goal

Build out **Holiday Brothers**, a sukkah-building and Jewish holiday services business serving Rockland County (founder: Menachem Kurkus), into a multi-role web application serving four kinds of users — **Client, Crew (Builder/Driver), Vendor, and Admin** (itself split into **Customer Service, Manager, Admin, and Owner** tiers) — through one coherent, tightly-connected system rather than a set of disconnected forms.

Long-term vision (explicitly stated, not incidental): this becomes a **full standalone app with real accounts**, comparable to Uber — eventual passkey/OTP auth, possibly migrated off the current stack entirely. The current architecture (GitHub Pages + Google Apps Script + Google Sheets) is an **intentional, lightweight MVP** chosen for fast iteration and feedback, not the final target. Every schema and design decision in this session was made with that migration in mind — nothing should be built in a way that locks the system into Sheets-specific assumptions.

This handoff session's specific purpose: take a fully-scoped product/UX plan (built conversationally, journey by journey) and hand it off cleanly for implementation.

---

## 2) Current State

**What exists in the deployed code** (see §3) is an early, much simpler version of this system — a basic booking stepper, a basic crew application form, a basic worker portal, and a single-tier admin panel with no role separation. It does **not** yet reflect most of what's described in the planning document: no size/type/speed pricing model, no Priority/Incentive/Referral/Vendor/Shop points economy, no dual-role driver/builder logic, no CS/Manager/Admin/Owner permission split, no page-overlay editing, no cancellation/rescheduling policy, no incident/safety reporting, no ratings/reviews system, and so on.

**What exists as design** is now complete and exhaustive: every user journey (Client, Crew, Vendor, Admin/Manager/CS/Owner) and every cross-cutting system (points economy, ratings/reviews, referrals, notifications, incident response, account recovery, vendor management) has been mapped in detail, along with the pricing model's resolved formula structure and a full Legal Research checklist. This is all captured in `Holiday-Brothers-UX-Summary.md`.

**Backend**: a single consolidated Apps Script file (`HolidayBrothersBackend.gs`) and an 11-tab Google Sheets workbook are referenced as already existing (per prior sessions), but were not part of this conversation's working files and were not reviewed or modified here.

---

## 3) Active Files

Files available in this project during this session:

- `index.html` — homepage
- `booking.html` — client booking stepper
- `join-crew.html` — crew application form
- `worker-login.html` — crew login
- `worker-portal.html` — crew dashboard (jobs, points, rewards)
- `index.html` (admin variant) — admin panel (tabs: Leads, Crew, Chats, Jobs, Notify, Content, Pricing, Questions, Testimonials, Rewards)
- `api.js` — shared fetch helpers, content-loading, banner/notification rendering
- `style.css` — shared design system (dark amber-glass aesthetic)
- `README.md` — placeholder only
- `HolidayBrothersBrandDeck.pdf`, `logo.png` — brand reference material

**Not included in this session's project files, but referenced as existing** (per longer-term memory, not verified here): `HolidayBrothersBackend.gs`, the live Google Sheets workbook, and the Google Drive image folder.

**Produced this session**:
- `Holiday-Brothers-UX-Summary.md` — the complete product/UX specification (in `/mnt/user-data/outputs/`)
- `handoff.md` — this document

---

## 4) Changes Made

**No code was written or modified in this session.** This was entirely a design/planning conversation, conducted journey-by-journey (Client → Crew → Vendor → Admin) and system-by-system (points, reviews, referrals, notifications, incidents, account recovery, vendor management), followed by compiling everything into `Holiday-Brothers-UX-Summary.md`.

That summary document itself went through several rounds of revision during this session, notably:
- Reworked the booking status tracker so Client Confirms/Crew Confirms/Admin Approves render as one visual "Job Confirmed" step with progress fill, not three separate stages.
- Made the persistent 1:1 Admin/CS chat thread universal across all account types (not client-only), with explicit no-AI-chatbot and admin-notification-scoping notes.
- Resolved the sukkah pricing model from a flat lookup-table assumption into a `Base + Size + Speed + Type` additive formula, grounded in actual crew-pay cost-plus logic rather than arbitrary markups.
- Replaced a brief "Admin preview" section with a full Admin View section covering the Owner/Admin/Manager/CS permission hierarchy, role acquisition paths, per-role task lists, the Follow-Ups escalation ladder, and the broadcast-messaging tiering.
- Compiled and finalized a 17-item, four-theme Legal Research checklist.

---

## 5) Failed Attempts / Reversed Decisions

Design directions that were proposed, then explicitly corrected or abandoned during the conversation — worth knowing so they aren't accidentally reintroduced:

- **Points as a literal cross-currency swap system.** Early framing treated Priority/Incentive/Referral/Vendor/Shop points as convertible into each other via exchange rates. Corrected: points **never transfer between wallets**. Only shared redemption items (e.g. Shop merch) are priced differently depending on which currency is spent — no swap mechanism exists.
- **Parental consent tied to school status.** Initially modeled as "school-flagged crew, regardless of age, need parental consent for daytime jobs." Corrected: parental consent is **strictly age-based** (under 16 only), with no school-status dependency.
- **Uniform Small/Medium/Large sizing assumed from the start.** The three-tier bucket model was assumed to apply identically across all sukkah types. This conflicted with real historical data (Canvas/Modular used a binary Small/Big split; Construction pricing varied continuously). Resolved by normalizing the old binary split into new Small/Large endpoints and introducing Medium as a genuinely new middle tier, applied uniformly.
- **Automatic point penalties for late cancellations/backouts.** Considered making crew backout point deductions fire automatically on a fixed schedule. Reversed: **all penalties route through manual admin review** — the system only ever suggests a consequence, never applies one unilaterally.
- **SMS OTP / native "critical alert" notifications assumed feasible on the current stack.** For emergency alerts, a native-app-only capability (OS-level critical alerts bypassing Do Not Disturb) was initially treated as achievable. Corrected: this requires a native app; an **automated phone call** was adopted as the actual MVP-feasible equivalent.
- **Passkeys dismissed as infeasible on Apps Script.** Initially conflated with SMS OTP's third-party-service requirement. Corrected: passkeys don't require a paid third-party service the way SMS does — real implementation is still deferred, but not for infeasibility reasons; the schema was designed to be passkey-ready regardless.
- **Admin permissions assumed as a fixed three-tier hierarchy.** CS/Manager/Admin were initially treated as hardcoded permission tiers. Corrected: they're **default presets** built from a fully granular, individually-toggleable permission system (Discord-style custom roles), with the hierarchy being the default configuration, not an architectural constraint.

---

## 6) Next Steps

1. **Read `Holiday-Brothers-UX-Summary.md` in full** before writing any code — it is the source of truth for this system's intended behavior, and is significantly more detailed than what's currently deployed.
2. **Design the updated data schema** (new/revised Sheets tabs, or a migration-ready equivalent) to support: expanded booking fields (size/type/speed + resolved pricing formula), expanded crew fields (birthday-based age, role + driving sub-type, opt-out availability calendar, medical/waiver fields), a new Vendor tab, a 5-currency points ledger, a Roles/Permissions table (Owner/Admin/Manager/CS + custom roles), a generic Tasks/Follow-Ups table, and the two chat thread types (persistent 1:1 + per-job group with the crew/admin-only aside layer).
3. **Significantly expand the Apps Script backend** to cover the much larger endpoint surface implied by the plan — keeping to the established single-consolidated-file preference, but expect substantial growth from the current version.
4. **Rebuild the frontend flows** to match the new booking stepper logic, crew signup flow, worker portal (dual-check-in verification, separate driving timer), and — the largest net-new UI concept — the CS/Manager/Admin experience, including the **page-overlay live-editing pattern**, which has no existing precedent in the current codebase and should probably be prototyped in isolation before being wired into the rest of the admin experience.
5. **Fill in the deliberately-deferred numbers pass**: actual dollar values for the pricing Base/modifiers, Vendor Tier names/thresholds, the full Rewards catalog, and the various default admin-configurable thresholds (time-discrepancy window, default deposit %, driving pay rate, escalation timings).
6. **Begin the Legal Research checklist** (§10 of the summary doc, 17 items). A few of these — home improvement/contractor licensing and client deposit-handling rules in particular — could materially change how the booking/payment flow needs to work, and are worth resolving early rather than after that part is built.
7. **Confirm the two explicitly-unconfirmed items** flagged in the summary doc's Open Items: the existing-admin-tab-to-new-role mapping, and the full enumerated permission flag list.
8. Given the stated long-term "real app" direction, periodically sanity-check that schema and architecture decisions remain migration-friendly rather than accumulating Sheets-specific shortcuts under implementation time pressure.
