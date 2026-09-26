import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Send,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Milestone } from '../types/index.js';

interface MilestoneTrackerProps {
  milestones: Milestone[];
  currentUserRole: 'STUDENT' | 'BUSINESS' | 'ADMIN';
  onUpdateMilestone: (milestoneId: string, action: string, data?: any) => Promise<void>;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({
  milestones,
  currentUserRole,
  onUpdateMilestone,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [actionType, setActionType] = useState<'SUBMIT' | 'REVISION' | null>(null);
  const [notes, setNotes] = useState('');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusBadge = (status: Milestone['status']) => {
    switch (status) {
      case 'PENDING':
        return <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-500">PENDING</span>;
      case 'IN_PROGRESS':
        return <span className="rounded bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">IN PROGRESS</span>;
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return <span className="rounded bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 animate-pulse">UNDER REVIEW</span>;
      case 'APPROVED':
        return <span className="rounded bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">APPROVED & PAID</span>;
      case 'REVISION_REQUESTED':
        return <span className="rounded bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400">REVISION REQUESTED</span>;
      default:
        return null;
    }
  };

  const handleStart = async (milestoneId: string) => {
    setIsSubmitting(true);
    try {
      await onUpdateMilestone(milestoneId, 'START');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (milestoneId: string) => {
    setIsSubmitting(true);
    try {
      await onUpdateMilestone(milestoneId, 'APPROVE');
      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone) return;

    setIsSubmitting(true);
    try {
      if (actionType === 'SUBMIT') {
        await onUpdateMilestone(selectedMilestone.id, 'SUBMIT', {
          submissionNotes: notes,
          deliverableUrl: url,
        });
      } else if (actionType === 'REVISION') {
        await onUpdateMilestone(selectedMilestone.id, 'REQUEST_REVISION', {
          feedback: notes,
        });
      }
      setSelectedMilestone(null);
      setActionType(null);
      setNotes('');
      setUrl('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Milestone Workflow</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Escrow release is unlocked as each milestone is verified and approved.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {milestones.filter(m => m.status === 'APPROVED').length} / {milestones.length} Completed
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {milestones.map((m, idx) => {
          const isStudent = currentUserRole === 'STUDENT';
          const isBusiness = currentUserRole === 'BUSINESS' || currentUserRole === 'ADMIN';

          return (
            <div
              key={m.id}
              className={`rounded-xl border p-4 transition-all ${
                m.status === 'APPROVED'
                  ? 'border-emerald-500/20 bg-emerald-50/20 dark:border-emerald-500/10 dark:bg-emerald-950/10'
                  : m.status === 'UNDER_REVIEW'
                  ? 'border-amber-500/30 bg-amber-50/20 dark:border-amber-500/20 dark:bg-amber-950/10'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-xs font-bold text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {m.title}
                      </h4>
                      {getStatusBadge(m.status)}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {m.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      ₹{m.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                      <Clock className="h-3 w-3" />
                      <span>{m.deadline}</span>
                    </div>
                  </div>

                  {/* Actions according to Role and Milestone Status */}
                  <div className="flex items-center gap-1.5">
                    {/* Student Start */}
                    {isStudent && (m.status === 'PENDING' || m.status === 'REVISION_REQUESTED') && (
                      <button
                        onClick={() => handleStart(m.id)}
                        disabled={isSubmitting}
                        className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-500 disabled:opacity-50"
                      >
                        Start Work
                      </button>
                    )}

                    {/* Student Submit Deliverable */}
                    {isStudent && (m.status === 'IN_PROGRESS' || m.status === 'REVISION_REQUESTED') && (
                      <button
                        onClick={() => {
                          setSelectedMilestone(m);
                          setActionType('SUBMIT');
                          setNotes(m.submissionNotes || '');
                          setUrl(m.deliverableUrl || '');
                        }}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                      >
                        Submit Deliverable
                      </button>
                    )}

                    {/* Business Review: Approve or Request Revision */}
                    {isBusiness && (m.status === 'UNDER_REVIEW' || m.status === 'SUBMITTED') && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedMilestone(m);
                            setActionType('REVISION');
                          }}
                          className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                        >
                          Request Tweaks
                        </button>
                        <button
                          onClick={() => handleApprove(m.id)}
                          disabled={isSubmitting}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approve & Pay
                        </button>
                      </>
                    )}

                    {m.status === 'APPROVED' && (
                      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Paid</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Deliverable details if submitted */}
              {m.submissionNotes && (
                <div className="mt-3 rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60 text-xs border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Deliverable Notes:</span>
                    {m.submittedAt && <span>Submitted {new Date(m.submittedAt).toLocaleDateString()}</span>}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{m.submissionNotes}</p>
                  {m.deliverableUrl && (
                    <div className="pt-1">
                      <a
                        href={m.deliverableUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400 hover:underline font-medium text-[11px]"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Deliverable URL ({m.deliverableUrl})
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback if revisions or approved */}
              {m.feedback && (
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 italic">
                  Client note: &quot;{m.feedback}&quot;
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for Submission or Revision */}
      {selectedMilestone && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {actionType === 'SUBMIT' ? 'Submit Milestone Deliverable' : 'Request Milestone Revisions'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Milestone: &quot;{selectedMilestone.title}&quot; (₹{selectedMilestone.amount.toLocaleString('en-IN')})
            </p>

            <form onSubmit={handleModalSubmit} className="mt-4 space-y-4">
              {actionType === 'SUBMIT' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deliverable URL (GitHub repo, PR, Figma, or deployed site)
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/your-username/project-milestone-1"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {actionType === 'SUBMIT' ? 'Summary of Work Completed' : 'Specific Changes / Revisions Needed'}
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    actionType === 'SUBMIT'
                      ? 'Describe the features implemented, test cases verified, and instructions for client testing...'
                      : 'Kindly adjust the font sizes on tablet view and fix the coupon code validation edge case...'
                  }
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMilestone(null);
                    setActionType(null);
                  }}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-semibold text-white hover:bg-orange-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : (actionType === 'SUBMIT' ? 'Submit for Review' : 'Send Revision Request')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
