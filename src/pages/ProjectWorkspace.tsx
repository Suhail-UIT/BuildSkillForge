import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Send,
  CheckCircle2,
  Clock,
  DollarSign,
  Star,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Layers,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { MilestoneTracker } from '../components/MilestoneTracker.js';

interface ProjectWorkspaceProps {
  projectId: string;
  onBack: () => void;
  onNavigateToPassport: (studentId: string) => void;
}

export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  projectId,
  onBack,
  onNavigateToPassport,
}) => {
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'MILESTONES' | 'CHAT' | 'PAYMENTS'>('MILESTONES');

  // Chat message input
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Rate & Complete modal
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [comm, setComm] = useState(5);
  const [qual, setQual] = useState(5);
  const [deliv, setDeliv] = useState(5);
  const [prof, setProf] = useState(5);
  const [prob, setProb] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  const fetchWorkspace = async () => {
    try {
      const res = await api.getWorkspace(projectId);
      if (res.success) {
        setWorkspace(res.workspace);
      }
    } catch (err) {
      console.error('Failed to load workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
    const interval = setInterval(fetchWorkspace, 10000); // Poll messages & milestone updates every 10s
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    if (activeTab === 'CHAT') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [workspace?.messages, activeTab]);

  const handleUpdateMilestone = async (milestoneId: string, action: string, data?: any) => {
    try {
      await api.updateMilestone(projectId, milestoneId, {
        action,
        ...data,
      });
      await fetchWorkspace();
    } catch (err: any) {
      alert(err.message || 'Milestone update failed.');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMsg) return;

    setSendingMsg(true);
    try {
      await api.sendWorkspaceMessage(projectId, newMessage.trim());
      setNewMessage('');
      await fetchWorkspace();
    } catch (err: any) {
      alert(err.message || 'Failed to send message.');
    } finally {
      setSendingMsg(false);
    }
  };

  const handleCompleteAndRate = async (e: React.FormEvent) => {
    e.preventDefault();
    setRatingSubmitting(true);
    try {
      const res = await api.completeAndRate(projectId, {
        communication: comm,
        quality: qual,
        delivery: deliv,
        professionalism: prof,
        problemSolving: prob,
        comment: reviewComment,
      });

      if (res.success) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
        setRateModalOpen(false);
        await fetchWorkspace();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to complete project and submit rating.');
    } finally {
      setRatingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-400">
        Loading Project Workspace...
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Workspace Unavailable</h2>
        <button
          onClick={onBack}
          className="mt-4 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  const { project, business, student, milestones, messages, payments, review, currentUserRole } = workspace;
  const allMilestonesApproved = milestones.every((m: any) => m.status === 'APPROVED');
  const isBusiness = currentUserRole === 'BUSINESS' || user?.role === 'ADMIN';

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          {project.status === 'COMPLETED' ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              CONTRACT COMPLETED & RATED
            </span>
          ) : (
            isBusiness && allMilestonesApproved && (
              <button
                onClick={() => setRateModalOpen(true)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-500 flex items-center gap-1.5 transition-all"
              >
                <Star className="h-4 w-4 fill-white" />
                Finalize Project & Rate Student
              </button>
            )
          )}
        </div>
      </div>

      {/* Header Hub Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Project title & Business */}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{business.name}</span>
              <span>·</span>
              <span className="text-orange-600 dark:text-orange-400 font-bold">{project.category}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {project.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Contract Value: ₹{project.budget.toLocaleString('en-IN')} (Net Student: ₹{project.studentAmount.toLocaleString('en-IN')})
            </p>
          </div>

          {/* Right: Assigned Student card */}
          {student && (
            <div className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-850">
              <img
                src={student.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                alt={student.name}
                className="h-11 w-11 rounded-xl object-cover border"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{student.name}</span>
                  <span className="rounded bg-orange-500/10 px-1.5 py-0.2 text-[10px] font-bold text-orange-600 dark:text-orange-400">
                    Score {student.passportScore}/100
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{student.college}</div>
                <button
                  onClick={() => onNavigateToPassport(student.id)}
                  className="mt-1 text-[10.5px] font-semibold text-orange-600 dark:text-orange-400 hover:underline inline-flex items-center gap-1"
                >
                  Inspect Verified Passport <ExternalLink className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex border-b border-slate-100 dark:border-slate-800 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('MILESTONES')}
            className={`pb-3 transition-colors ${
              activeTab === 'MILESTONES'
                ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Milestone Roadmap ({milestones.length})
          </button>

          <button
            onClick={() => setActiveTab('CHAT')}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              activeTab === 'CHAT'
                ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Workspace Chat ({messages.length})
          </button>

          <button
            onClick={() => setActiveTab('PAYMENTS')}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              activeTab === 'PAYMENTS'
                ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            Escrow Releases ({payments.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Milestones */}
      {activeTab === 'MILESTONES' && (
        <div className="space-y-6">
          <MilestoneTracker
            milestones={milestones}
            currentUserRole={currentUserRole}
            onUpdateMilestone={handleUpdateMilestone}
          />

          {/* If reviewed, show rating summary */}
          {review && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/20 p-5 dark:border-emerald-500/10 dark:bg-emerald-950/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                  Client Review & Rating Recorded
                </span>
                <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                  {review.rating} / 5.0
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                &quot;{review.comment}&quot;
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-slate-600 dark:text-slate-400 border-t border-emerald-500/10 pt-2">
                <span>Communication: <strong>{review.communication}/5</strong></span>
                <span>Quality: <strong>{review.quality}/5</strong></span>
                <span>Delivery: <strong>{review.delivery}/5</strong></span>
                <span>Professionalism: <strong>{review.professionalism}/5</strong></span>
                <span>Problem Solving: <strong>{review.problemSolving}/5</strong></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Live Chat */}
      {activeTab === 'CHAT' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col h-[500px]">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-850 text-xs font-semibold text-slate-600 dark:text-slate-400">
            Encrypted Workspace Communication
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">
                No messages yet. Send a greeting to kickstart collaboration!
              </div>
            ) : (
              messages.map((m: any) => {
                const isMe = m.senderId === user?._id;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-slate-400 mb-0.5">
                      {m.senderName} ({m.senderRole})
                    </div>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-orange-600 text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {m.message}
                    </div>
                    <div className="text-[9.5px] text-slate-400 mt-0.5">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message to project partner..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sendingMsg}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white hover:bg-orange-500 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Payments */}
      {activeTab === 'PAYMENTS' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Escrow Payment Ledger
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Transparent release log. 10% platform fee is automatically deducted at release.
          </p>

          <div className="space-y-3">
            {payments.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No payments released yet. Approving a milestone automatically executes an escrow payout.
              </div>
            ) : (
              payments.map((p: any) => (
                <div
                  key={p._id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{p.transactionId}</span>
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        SUCCESSFUL
                      </span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      {p.paymentMethod} · Released {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      ₹{p.studentAmount.toLocaleString('en-IN')} (Student Net)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Gross: ₹{p.amount.toLocaleString('en-IN')} · Fee (10%): ₹{p.platformFee.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Complete and Rate Modal */}
      {rateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              Complete Project & Rate Student
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your feedback directly updates {student.name}&apos;s verified Skill Passport.
            </p>

            <form onSubmit={handleCompleteAndRate} className="mt-4 space-y-3.5 text-xs">
              {[
                { label: 'Communication & Responsiveness', val: comm, setVal: setComm },
                { label: 'Quality of Technical Execution', val: qual, setVal: setQual },
                { label: 'On-Time Milestone Delivery', val: deliv, setVal: setDeliv },
                { label: 'Professionalism & Code Standards', val: prof, setVal: setProf },
                { label: 'Problem Solving & Initiative', val: prob, setVal: setProb },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => item.setVal(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            star <= item.val
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-1 font-bold text-slate-900 dark:text-white w-4 text-center">
                      {item.val}
                    </span>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Public Client Testimonial
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share how the student performed, their technical strengths, and impact on your business..."
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setRateModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ratingSubmitting}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md disabled:opacity-50"
                >
                  {ratingSubmitting ? 'Finalizing...' : 'Submit Rating & Finalize'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
