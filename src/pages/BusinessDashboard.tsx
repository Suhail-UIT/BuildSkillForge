import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { Project } from '../types/index.js';

interface BusinessDashboardProps {
  onNavigateToProject: (projectId: string) => void;
  onNavigateToWorkspace: (projectId: string) => void;
  onNavigateToTalent: () => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  onNavigateToProject,
  onNavigateToWorkspace,
  onNavigateToTalent,
}) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // New Project Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Full Stack');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('React, Node.js, Tailwind CSS');
  const [budget, setBudget] = useState('15000');
  const [deadline, setDeadline] = useState('2026-11-30');
  const [location, setLocation] = useState('Bengaluru (Hybrid)');
  const [projectType, setProjectType] = useState<'REMOTE' | 'HYBRID' | 'ONSITE'>('HYBRID');
  const [isCreating, setIsCreating] = useState(false);

  const fetchBusinessProjects = async () => {
    try {
      const res = await api.getProjects({});
      if (res.success && user) {
        const mine = res.projects.filter((p: Project) => p.businessId === user._id);
        setProjects(mine);
      }
    } catch (err) {
      console.warn('Failed to load business projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessProjects();
  }, [user]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.createProject({
        title,
        category,
        description,
        requiredSkills: skillsArray,
        budget: Number(budget),
        deadline,
        location,
        projectType,
      });

      if (res.success) {
        setModalOpen(false);
        setTitle('');
        setDescription('');
        await fetchBusinessProjects();
        onNavigateToProject(res.project._id);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create project.');
    } finally {
      setIsCreating(false);
    }
  };

  const activeProjectsCount = projects.filter(p => p.status === 'ACTIVE').length;
  const completedProjectsCount = projects.filter(p => p.status === 'COMPLETED').length;
  const totalSpent = projects
    .filter(p => p.status === 'ACTIVE' || p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.budget, 0);
  const totalApplicants = projects.reduce((sum, p) => sum + (p.applicationsCount || 0), 0);

  const numericBudget = Number(budget) || 0;
  const calculatedFee = Math.round(numericBudget * 0.10);
  const calculatedStudentPayout = numericBudget - calculatedFee;

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-400">
        Loading Business Dashboard...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Welcome & Post Action */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent p-6 dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Business Console
            </h1>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              VERIFIED ENTERPRISE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Post contracts, review verified collegiate Skill Passports, and release payments upon approved milestones.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-500 flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Post New Project
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Projects Posted</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {projects.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Total across account</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Workspaces</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {activeProjectsCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Students currently building</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Committed</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">100% Escrow protected</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Applications</div>
          <div className="text-2xl font-extrabold text-orange-500 mt-1">
            {totalApplicants}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Verified collegiate candidates</div>
        </div>
      </div>

      {/* Projects List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-orange-500" />
            Your Posted Contracts
          </h2>
          <button
            onClick={onNavigateToTalent}
            className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
          >
            <Search className="h-3 w-3" />
            Discover Talent
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-3">
            <div>You haven&apos;t posted any projects yet.</div>
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500"
            >
              Post Your First Tech Project
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj._id}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {proj.title}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        proj.status === 'ACTIVE'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                          : proj.status === 'COMPLETED'
                          ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    <span>Budget: ₹{proj.budget.toLocaleString('en-IN')}</span>
                    <span>·</span>
                    <span>Deadline: {proj.deadline}</span>
                    <span>·</span>
                    <span>{proj.applicationsCount || 0} Applicants</span>
                    {proj.selectedStudentName && (
                      <>
                        <span>·</span>
                        <span className="text-orange-600 dark:text-orange-400 font-semibold">
                          Assigned: {proj.selectedStudentName}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => onNavigateToProject(proj._id)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    View Details
                  </button>

                  {proj.status === 'ACTIVE' && (
                    <button
                      onClick={() => onNavigateToWorkspace(proj._id)}
                      className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-500 flex items-center gap-1"
                    >
                      Workspace <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Post a New Project Requirement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Specify your project goals and budget. High-ranking verified college students will apply with their Skill Passports.
            </p>

            <form onSubmit={handleCreateProject} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern POS & Tablet Ordering System"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Web App">Web App</option>
                    <option value="UI/UX & Web">UI/UX & Web</option>
                    <option value="AI">AI & Machine Learning</option>
                    <option value="Mobile">Mobile Application</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Work Location
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ONSITE">On-Site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                  placeholder="React, TypeScript, Node.js, Express"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="15000"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Real-time 10% fee breakdown */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-850 space-y-1">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Transparent 10% Platform Fee Model:
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Platform Fee (10%):</span>
                  <span>₹{calculatedFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Student Net Payout:</span>
                  <span>₹{calculatedStudentPayout.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Description & Specifications
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your business problem, specific pages/features needed, and any existing tools to integrate with..."
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-semibold text-white hover:bg-orange-500 disabled:opacity-50"
                >
                  {isCreating ? 'Publishing...' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
