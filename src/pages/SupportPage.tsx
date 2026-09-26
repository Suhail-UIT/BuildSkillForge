import React, { useState, useEffect } from 'react';
import { LifeBuoy, Plus, CheckCircle, Clock, Send, MessageSquare, AlertCircle } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { SupportTicket } from '../types/index.js';

export const SupportPage: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // New ticket state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [category, setCategory] = useState('Skill Passport Verification');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await api.getSupportTickets();
      if (res.success) {
        setTickets(res.tickets);
      }
    } catch (err) {
      console.warn('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const res = await api.createSupportTicket({
        category,
        description,
        priority,
      });

      if (res.success) {
        setCreateModalOpen(false);
        setDescription('');
        await fetchTickets();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Help & Support Desk
            </h1>
            <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-bold text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
              Escrow & Account Assistance
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Have questions about project arbitration, Skill Passport score audits, or payments? File a support ticket with our engineering team.
          </p>
        </div>

        {user && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-500 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            File New Ticket
          </button>
        )}
      </div>

      {/* Ticket List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Your Support Inquiries
        </h2>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No support tickets on record. Everything is running smoothly!
          </div>
        ) : (
          <div className="space-y-3.5">
            {tickets.map((t) => (
              <div
                key={t._id}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{t.category}</span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="text-[10.5px] text-slate-400">
                    Priority: {t.priority} · Submitted {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  {t.description}
                </p>

                {t.adminResponse && (
                  <div className="rounded-lg bg-orange-50/70 p-3 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/30 text-[11.5px] text-orange-900 dark:text-orange-200">
                    <div className="font-bold text-orange-700 dark:text-orange-400 mb-0.5">
                      Support Team Response:
                    </div>
                    {t.adminResponse}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create Support Ticket
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Provide details regarding your inquiry or dispute for prompt investigation.
            </p>

            <form onSubmit={handleCreateTicket} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Skill Passport Verification">Skill Passport Verification</option>
                  <option value="Escrow Payment & Payouts">Escrow Payment & Payouts</option>
                  <option value="Milestone Deliverable Dispute">Milestone Deliverable Dispute</option>
                  <option value="Competition Scoring Question">Competition Scoring Question</option>
                  <option value="Account & Security">Account & Security</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High (Active Project Affected)</option>
                  <option value="URGENT">Urgent (Payment / Security Issue)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description of Issue
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue, include transaction IDs or project titles..."
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-semibold text-white hover:bg-orange-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Filing...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
