"use client";

import { useState } from "react";
import { clearSession } from "@/lib/api";
import LeadsTab from "./tabs/LeadsTab";
import CrewTab from "./tabs/CrewTab";
import JobsTab from "./tabs/JobsTab";
import VendorsTab from "./tabs/VendorsTab";
import RewardsTab from "./tabs/RewardsTab";
import SettingsTab from "./tabs/SettingsTab";
import ContentTab from "./tabs/ContentTab";
import QuestionsTab from "./tabs/QuestionsTab";
import TestimonialsTab from "./tabs/TestimonialsTab";
import TasksTab from "./tabs/TasksTab";
import RolesTab from "./tabs/RolesTab";
import ChatsTab from "./tabs/ChatsTab";

const TABS = [
  { id: "leads", label: "Leads", Component: LeadsTab },
  { id: "crew", label: "Crew", Component: CrewTab },
  { id: "jobs", label: "Jobs", Component: JobsTab },
  { id: "vendors", label: "Vendors", Component: VendorsTab },
  { id: "chats", label: "Chats", Component: ChatsTab },
  { id: "tasks", label: "Follow-ups", Component: TasksTab },
  { id: "rewards", label: "Rewards", Component: RewardsTab },
  { id: "settings", label: "Pricing & Settings", Component: SettingsTab },
  { id: "content", label: "Content", Component: ContentTab },
  { id: "questions", label: "Questions", Component: QuestionsTab },
  { id: "testimonials", label: "Testimonials", Component: TestimonialsTab },
  { id: "roles", label: "Roles", Component: RolesTab },
] as const;

export default function AdminDashboard({ accountId }: { accountId: string }) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("leads");

  function handleLogout() {
    clearSession();
    window.location.reload();
  }

  const Active = TABS.find((t) => t.id === activeTab)?.Component ?? LeadsTab;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className="btn"
              style={activeTab === t.id ? { borderColor: "var(--amber-bright)" } : undefined}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button type="button" className="btn" onClick={handleLogout}>
          Sign out
        </button>
      </div>

      <div className="glass p-6">
        <Active accountId={accountId} />
      </div>
    </div>
  );
}
