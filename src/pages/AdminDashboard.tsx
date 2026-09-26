import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Briefcase,
  DollarSign,
  Trophy,
  LifeBuoy,
  CheckCircle,
  AlertTriangle,
  Send,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

interface AdminDashboardProps {
  onNavigateToProject: (projectId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToProject }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Ticket reply state
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [ticketResponse, setTicketResponse] = useState('');
  const [ticketStatus, setTicketStatus] = useState('Resolved');
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [statsRes, ticketsRes] = await Promise.all([
        api.getAdminStats(),
        api.getSupportTickets(),
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
        setRecentUsers(statsRes.recentUsers || []);
      }

      if (ticketsRes.success) {
        setSupportTickets(ticketsRes.tickets || []);
      }
    } catch (err) {
      console.warn('Failed to load admin telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await api.toggleUserStatus(userId);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle user status.');
    }
  };

  const handleReplyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setSubmittingReply(true);
    try {
      await api.updateSupportTicket(selectedTicket._id, {
        status: ticketStatus,
        adminResponse: ticketResponse,
      });
      setSelectedTicket(null);
      setTicketResponse('');
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update support ticket.');
    } finally {
      setSubmittingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-400">
        Loading Platform Admin Console...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-6 dark:border-indigo-900/50 dark:bg-indigo-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              BuildSkillForge Platform Admin
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supervisory oversight for project moderation, user verifications, support tickets, and 10% fee telemetry.
          </p>
        </div>
        <div className="rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-indigo-700 shadow-sm dark:bg-slate-900 dark:text-indigo-300">
          Admin Authenticated
        </div>
      </div>

      {/* Platform Telemetry Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Users</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats?.totalUsers || 0}
          </div>
          <div className="text-[10.5px] text-slate-400 mt-0.5">
            {stats?.totalStudents} Students · {stats?.totalBusinesses} Businesses
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Workspaces</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {stats?.activeProjects || 0}
          </div>
          <div className="text-[10.5px] text-slate-400 mt-0.5">
            {stats?.openProjects} Open · {stats?.completedProjects} Completed
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Gross Platform Volume</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{(stats?.totalGrossRevenue || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[10.5px] text-slate-400 mt-0.5">Escrow processed transactions</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">10% Platform Revenue</div>
          <div className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 mt-1">
            ₹{(stats?.platformFeeRevenue || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[10.5px] text-slate-400 mt-0.5">Earned from completed projects</div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="h-4 w-4 text-orange-500" />
          Registered Users & Verification Controls
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-2">User</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentUsers.map((u) => (
                <tr key={u._id} className="py-2.5">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                        alt={u.name}
                        className="h-8 w-8 rounded-full border"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5">
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10.5px] font-semibold text-slate-700 dark:text-slate-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`rounded px-2 py-0.5 text-[10.5px] font-semibold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => handleToggleUserStatus(u._id)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        u.status === 'ACTIVE'
                          ? 'border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/30'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Support Tickets Resolution Console */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <LifeBuoy className="h-4 w-4 text-indigo-500" />
          Support & Dispute Resolution Queue ({supportTickets.length})
        </h3>

        <div className="space-y-3">
          {supportTickets.map((t) => (
            <div
              key={t._id}
              className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-2.5 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{t.category}</span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9.5px] font-bold ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    User: {t.userName} ({t.userRole}) · Priority: {t.priority}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTicket(t)}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 self-start sm:self-auto"
                >
                  Respond
                </button>
              </div>

              <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                {t.description}
              </p>

              {t.adminResponse && (
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  Admin Note: &quot;{t.adminResponse}&quot;
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Response Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Respond to Support Ticket
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Category: {selectedTicket.category} (Submitted by {selectedTicket.userName})
            </p>

            <form onSubmit={handleReplyTicket} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ticket Status
                </label>
                <select
                  value={ticketStatus}
                  onChange={(e) => setTicketStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Resolved">Resolved</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Waiting for User">Waiting for User</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official Administrative Response
                </label>
                <textarea
                  rows={4}
                  value={ticketResponse}
                  onChange={(e) => setTicketResponse(e.target.value)}
                  placeholder="Explain resolution steps or arbitration decision..."
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {submittingReply ? 'Saving...' : 'Send Response'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
