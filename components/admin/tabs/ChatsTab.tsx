"use client";

import { useEffect, useState } from "react";
import { getChatsList, getChatMessages, sendMessage, isOk, type ChatThread, type ChatMessage } from "@/lib/api";

export default function ChatsTab({ accountId }: { accountId: string }) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    getChatsList({ account_id: accountId }).then((res) => {
      if (isOk(res)) setThreads(res.threads);
      else setError(res.error);
      setLoading(false);
    });
  }, [accountId]);

  async function openThread(threadId: string) {
    setActiveThread(threadId);
    const res = await getChatMessages({ thread_id: threadId, account_id: accountId });
    if (isOk(res)) setMessages(res.rows);
  }

  async function handleSend() {
    if (!activeThread || !text.trim()) return;
    const res = await sendMessage({ thread_id: activeThread, sender: accountId, account_id: accountId, text });
    if (isOk(res)) {
      setText("");
      openThread(activeThread);
    }
  }

  if (loading) return <p style={{ color: "var(--text-faint)" }}>Loading…</p>;

  return (
    <div>
      <h2 className="mb-4">Chats</h2>
      {error && (
        <p className="mb-3 text-[13.5px]" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-[240px_1fr]">
        <div className="space-y-2">
          {threads.map((t) => (
            <button
              key={t.thread_id}
              type="button"
              className={`step-row w-full text-left ${activeThread === t.thread_id ? "" : ""}`}
              onClick={() => openThread(t.thread_id)}
            >
              <span>{t.thread_type === "persistent_1on1" ? "1:1" : "Job group"}</span>
              <span className="step-value">{t.thread_id}</span>
            </button>
          ))}
        </div>
        <div className="glass p-4">
          {!activeThread && <p style={{ color: "var(--text-faint)" }}>Select a thread.</p>}
          {activeThread && (
            <>
              <div className="mb-3 max-h-72 space-y-2 overflow-y-auto">
                {messages.map((m) => (
                  <div key={m.message_id} className={`text-[13.5px] ${m.visibility === "aside" ? "italic" : ""}`}>
                    <span style={{ color: "var(--text-faint)" }}>{m.sender_account_id}: </span>
                    <span style={{ color: "var(--text-cream)" }}>{m.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input className="input" placeholder="Message" value={text} onChange={(e) => setText(e.target.value)} />
                <button type="button" className="btn" onClick={handleSend}>
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
