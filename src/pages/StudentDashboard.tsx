import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Briefcase,
  Trophy,
  DollarSign,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { Project, Application, SkillPassport } from '../types/index.js';

interface StudentDashboardProps {
  onNavigateToWorkspace: (projectId: string) => void;
  onNavigateToPassport: (studentId: string) => void;
  onNavigateToProject: (projectId: string) => void;
  onNavigateToCompetitions: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigateToWorkspace,
  onNavigateToPassport,
  onNavigateToProject,
  onNavigateToCompetitions,
}) => {
  const { user } = useAuth();
  const [passport, setPassport] = useState<SkillPassport | null>(null);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [earnings, setEarnings] = useState({ totalEarnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentData() {
      if (!user) return;
      try {
        const [passRes, projRes, payRes] = await Promise.all([
          api.getSkillPassport(user._id),
          api.getProjects({}),
          api.getPaymentHistory(),
        ]);

        if (passRes.success) setPassport(passRes.passport);
        if (payRes.success) setEarnings(payRes.summary);

        if (projRes.success) {
          // Projects where current student is selected
          const mine = projRes.projects.filter((p: Project) => p.selectedStudentId === user._id);
          setActiveProjects(mine);
        }
      } catch (err) {
        console.warn('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, [user]);

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-400">
        Loading Student Dashboard...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent p-6 dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Welcome back, {user?.name}! 👋
            </h1>
            <span className="rounded bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-600 dark:text-orange-400">
              COLLEGIATE BUILDER
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build real contracts, verify your code, and level up your tamper-evident Skill Passport.
          </p>
        </div>

        {user && (
          <button
            onClick={() => onNavigateToPassport(user._id)}
            className="rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-500 flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <ShieldCheck className="h-4 w-4" />
            View Public Skill Passport
          </button>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Skill Score</div>
          <div className="text-2xl font-extrabold text-orange-500 mt-1">
            {passport?.overallScore || 75}
            <span className="text-xs text-slate-400 font-normal">/100</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Top 10% on Platform</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Projects Completed</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {passport?.projects.length || 0}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Verified deliveries</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Top Competition Rank</div>
          <div className="text-2xl font-extrabold text-indigo-500 mt-1">
            {passport?.competitionHistory.length ? `#${passport.competitionHistory[0].rank}` : 'Unranked'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">National Hackathons</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Net Earnings</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{(earnings.totalEarnings || 4050).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">After 10% fee deduction</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Client Rating</div>
          <div className="text-2xl font-extrabold text-amber-500 mt-1 flex items-center gap-1">
            <Star className="h-5 w-5 fill-amber-500" />
            {passport?.ratings.average.toFixed(1) || '5.0'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Across {passport?.ratings.reviewCount || 1} Reviews</div>
        </div>
      </div>

      {/* Active Contracts / Project Workspace Quicklinks */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-orange-500" />
            Active Business Contracts
          </h2>
          <span className="text-xs text-slate-500">{activeProjects.length} Active</span>
        </div>

        {activeProjects.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No active contracts right now. Browse open projects to submit proposals!
          </div>
        ) : (
          <div className="space-y-3">
            {activeProjects.map((p) => (
              <div
                key={p._id}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{p.title}</span>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                      IN WORKSPACE
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Client: {p.businessName} · Due {p.deadline} · Budget: ₹{p.studentAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToWorkspace(p._id)}
                  className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500 shadow-sm flex items-center gap-1 self-start sm:self-auto"
                >
                  Open Workspace <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Competitions Callout */}
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-6 dark:border-indigo-900/50 dark:bg-indigo-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Trophy className="h-3.5 w-3.5" />
            National Competitions Live
          </span>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
            Boost your Skill Passport score by submitting code to open challenges
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Top scores earn verified badges, podium rewards, and priority matching for local business contracts.
          </p>
        </div>

        <button
          onClick={onNavigateToCompetitions}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-sm self-start sm:self-auto shrink-0"
        >
          View Open Challenges
        </button>
      </div>
    </div>
  );
};
