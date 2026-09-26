import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  AlertCircle,
  Clock,
  Sparkles,
  Send,
} from 'lucide-react';
import { Project, Application } from '../types/index.js';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { SkillPassportCard } from '../components/SkillPassportCard.js';

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
  onNavigateToWorkspace: (projectId: string) => void;
  onNavigateToLogin: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  projectId,
  onBack,
  onNavigateToWorkspace,
  onNavigateToLogin,
}) => {
  const { user, role } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Apply modal
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [proposal, setProposal] = useState('');
  const [expectedCompletion, setExpectedCompletion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Selected candidate preview
  const [previewPassport, setPreviewPassport] = useState<any | null>(null);

  useEffect(() => {
    async function loadProject() {
      setLoading(true);
      try {
        const res = await api.getProjectById(projectId);
        if (res.success) {
          setProject(res.project);
          if (res.project.deadline) {
            setExpectedCompletion(res.project.deadline);
          }
        }

        // If current user is project owner or admin, load applications
        if (user && (user._id === res.project.businessId || user.role === 'ADMIN')) {
          const appRes = await api.getProjectApplications(projectId);
          if (appRes.success) {
            setApplications(appRes.applications);
          }
        }
      } catch (err) {
        console.error('Failed to load project detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [projectId, user]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onNavigateToLogin();
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.applyToProject(projectId, {
        proposal,
        expectedCompletion,
      });
      if (res.success) {
        setApplySuccess(true);
        setProject((prev: any) => ({
          ...prev,
          hasApplied: true,
          userApplication: res.application,
          applicationsCount: (prev.applicationsCount || 0) + 1,
        }));
        setTimeout(() => setApplyModalOpen(false), 1500);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to select this candidate? This will transition the project to ACTIVE and open your shared workspace.')) {
      return;
    }

    try {
      const res = await api.selectStudent(projectId, studentId);
      if (res.success) {
        setProject((prev: any) => ({
          ...prev,
          status: 'ACTIVE',
          selectedStudentId: studentId,
        }));
        onNavigateToWorkspace(projectId);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to select student.');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-400">
        Loading contract details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Contract Not Found</h2>
        <button
          onClick={onBack}
          className="mt-4 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const isOwner = user && (user._id === project.businessId || user.role === 'ADMIN');
  const isAssignedStudent = user && user._id === project.selectedStudentId;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </button>

      {/* Main Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={project.businessLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${project.businessName}`}
              alt={project.businessName}
              className="h-14 w-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {project.businessName}
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <ShieldCheck className="h-3 w-3" />
                  VERIFIED LOCAL BUSINESS
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {project.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {project.location} ({project.projectType})
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Deadline: {project.deadline}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {project.applicationsCount || 0} applicants
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA Box */}
          <div className="sm:text-right shrink-0">
            {project.status === 'ACTIVE' ? (
              <div className="space-y-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 inline-block">
                  PROJECT ACTIVE
                </span>
                {(isOwner || isAssignedStudent) && (
                  <div>
                    <button
                      onClick={() => onNavigateToWorkspace(project._id)}
                      className="rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-500 transition-all flex items-center gap-1.5"
                    >
                      <Briefcase className="h-4 w-4" />
                      Enter Project Workspace
                    </button>
                  </div>
                )}
              </div>
            ) : project.hasApplied ? (
              <div className="rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30 text-xs text-emerald-800 dark:text-emerald-300">
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Application Submitted
                </div>
                <div className="text-[11px] mt-0.5">Status: {project.userApplication?.status || 'PENDING'}</div>
              </div>
            ) : role === 'STUDENT' ? (
              <button
                onClick={() => setApplyModalOpen(true)}
                className="w-full sm:w-auto rounded-xl bg-orange-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-500 active:scale-98 transition-all"
              >
                Apply with Skill Passport
              </button>
            ) : !user ? (
              <button
                onClick={onNavigateToLogin}
                className="w-full sm:w-auto rounded-xl bg-orange-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-orange-500"
              >
                Sign In to Apply
              </button>
            ) : null}
          </div>
        </div>

        {/* Budget Escrow Breakdown Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
              Total Business Budget
            </span>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
              ₹{project.budget.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400">Escrow deposited prior to start</div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
              Platform Fee (10%)
            </span>
            <div className="text-lg font-extrabold text-orange-600 dark:text-orange-400 mt-0.5">
              ₹{project.platformFee.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400">BuildSkillForge operational fee</div>
          </div>

          <div className="rounded-xl bg-emerald-50/50 p-3 dark:bg-emerald-950/20 border border-emerald-500/20">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Net Student Payout
            </span>
            <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              ₹{project.studentAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">Direct milestone release to student</div>
          </div>
        </div>
      </div>

      {/* Description & Technical Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Project Brief & Requirements
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                Required Technical Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.requiredSkills.map((sk: string, i: number) => (
                  <span
                    key={i}
                    className="rounded-lg bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Milestones Roadmap */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Milestone Breakdown ({project.milestones.length} Stages)
            </h3>
            <div className="space-y-3">
              {project.milestones.map((m: any, idx: number) => (
                <div
                  key={m.id || idx}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-850 flex items-center justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-orange-500/10 text-xs font-bold text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{m.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{m.description}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      ₹{m.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400">Due {m.deadline}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Owner Section: Received Applications */}
          {isOwner && (
            <div className="rounded-2xl border border-orange-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Received Applications ({applications.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Review candidate Skill Passports and click &quot;Select Student&quot; to initialize project workspace.
                  </p>
                </div>
              </div>

              {applications.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No student applications received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app._id}
                      className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.studentAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${app.studentName}`}
                            alt={app.studentName}
                            className="h-10 w-10 rounded-xl object-cover border"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {app.studentName}
                              </span>
                              <span className="rounded bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-600 dark:text-orange-400">
                                Score: {app.studentOverallScore}/100
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {app.studentCollege} · Applied {new Date(app.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {app.skillPassport && (
                            <button
                              onClick={() => setPreviewPassport(app.skillPassport)}
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              Inspect Passport
                            </button>
                          )}

                          {project.status === 'OPEN' && (
                            <button
                              onClick={() => handleSelectStudent(app.studentId)}
                              className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500 shadow-sm"
                            >
                              Select Candidate
                            </button>
                          )}

                          {app.status === 'ACCEPTED' && (
                            <span className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                              Selected Candidate
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Proposal text */}
                      <div className="rounded-lg bg-white p-3 dark:bg-slate-900 text-xs border border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Proposal:</span>
                        <p className="mt-1 text-slate-600 dark:text-slate-400">{app.proposal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar: Business Profile Details */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              About the Business
            </h3>
            <div className="flex items-center gap-3">
              <img
                src={project.businessLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${project.businessName}`}
                alt={project.businessName}
                className="h-12 w-12 rounded-xl object-cover border"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {project.businessName}
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {project.businessProfile?.businessType || 'Retail / Enterprise'}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {project.businessProfile?.description ||
                'Verified local business partnering with collegiate technical talent for digital systems.'}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Location:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{project.location}</span>
              </div>
              {project.businessProfile?.website && (
                <div className="flex items-center justify-between">
                  <span>Website:</span>
                  <a
                    href={project.businessProfile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-600 dark:text-orange-400 font-medium hover:underline inline-flex items-center gap-1"
                  >
                    Visit <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Verification:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">KYB Audited</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Apply to &quot;{project.title}&quot;
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your verified Skill Passport will automatically be attached to this application.
            </p>

            {applySuccess ? (
              <div className="py-8 text-center text-emerald-600 space-y-2">
                <CheckCircle2 className="h-10 w-10 mx-auto" />
                <div className="font-bold text-sm">Application Submitted Successfully!</div>
                <p className="text-xs text-slate-500">The business has been notified.</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Tailored Proposal
                  </label>
                  <textarea
                    rows={4}
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Describe how your skills and relevant projects qualify you for this project..."
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Delivery Date
                  </label>
                  <input
                    type="date"
                    value={expectedCompletion}
                    onChange={(e) => setExpectedCompletion(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="rounded-lg bg-orange-50 p-2.5 dark:bg-orange-950/20 text-[11px] text-orange-800 dark:text-orange-300">
                  ⚡ <strong>Student Payout:</strong> You will receive <strong>₹{project.studentAmount.toLocaleString('en-IN')}</strong> directly upon milestone approvals.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-semibold text-white hover:bg-orange-500 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Candidate Passport Preview Modal */}
      {previewPassport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl my-8">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setPreviewPassport(null)}
                className="rounded-full bg-slate-800 px-3 py-1 text-xs text-white hover:bg-slate-700"
              >
                Close Preview ✕
              </button>
            </div>
            <SkillPassportCard passport={previewPassport} />
          </div>
        </div>
      )}
    </div>
  );
};
