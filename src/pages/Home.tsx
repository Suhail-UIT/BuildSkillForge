import React, { useState, useEffect } from 'react';
import {
  Flame,
  ArrowRight,
  ShieldCheck,
  Trophy,
  Briefcase,
  Star,
  Users,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Zap,
  DollarSign,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { Project, SkillPassport } from '../types/index.js';
import { api } from '../services/api.js';
import { ProjectCard } from '../components/ProjectCard.js';
import { SkillPassportCard } from '../components/SkillPassportCard.js';

interface HomeProps {
  onNavigate: (path: string) => void;
  onSelectProject: (projectId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onSelectProject }) => {
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'BUSINESS'>('STUDENT');
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [topTalent, setTopTalent] = useState<SkillPassport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, talentRes] = await Promise.all([
          api.getProjects({ status: 'OPEN' }),
          api.searchTalent({ minScore: '85' }),
        ]);

        if (projRes.success) {
          setFeaturedProjects(projRes.projects.slice(0, 3));
        }

        // Fetch passport for top students
        const aaravPassport = await api.getSkillPassport('usr_student_aarav');
        if (aaravPassport.success) {
          setTopTalent([aaravPassport.passport]);
        }
      } catch (err) {
        console.warn('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Empowering India&apos;s Next Generation of Tech Builders
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Build Skills. Build Projects.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-indigo-600">
              Build Your Future.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The verified platform connecting ambitious college students with local businesses for real-world digital and technology contracts. No fake resumes — only audited code and real client ratings.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/projects')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-500 active:scale-98 transition-all"
            >
              Explore Paid Projects
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('/talent')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 transition-all"
            >
              Discover Verified Talent
            </button>
          </div>

          {/* Platform Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
            <div className="p-3">
              <div className="text-2xl font-black text-slate-900 dark:text-white">₹4.8M+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Paid to College Builders</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-black text-slate-900 dark:text-white">1,200+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Audited Skill Passports</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-black text-slate-900 dark:text-white">450+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Verified Indian Businesses</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Milestone Escrow Protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works: Interactive Dual Persona Pipeline */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            How BuildSkillForge Operates
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            A transparent, performance-driven marketplace designed specifically for student skill-proof and local business modernization.
          </p>

          {/* Role Tab Selector */}
          <div className="mt-6 inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setActiveTab('STUDENT')}
              className={`rounded-lg px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'STUDENT'
                  ? 'bg-white text-orange-600 shadow-sm dark:bg-slate-900 dark:text-orange-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              For College Students
            </button>
            <button
              onClick={() => setActiveTab('BUSINESS')}
              className={`rounded-lg px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'BUSINESS'
                  ? 'bg-white text-orange-600 shadow-sm dark:bg-slate-900 dark:text-orange-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              For Local Businesses
            </button>
          </div>
        </div>

        {/* Pipeline Steps */}
        <div className="mt-10">
          {activeTab === 'STUDENT' ? (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
              {[
                { step: '1', title: 'Learn', desc: 'Sharpen hands-on technical skills', icon: Code2 },
                { step: '2', title: 'Compete', desc: 'Enter national verified challenges', icon: Trophy },
                { step: '3', title: 'Prove', desc: 'Build an audited Skill Passport', icon: ShieldCheck },
                { step: '4', title: 'Build', desc: 'Get selected for business contracts', icon: Briefcase },
                { step: '5', title: 'Earn', desc: 'Receive milestone escrow payouts', icon: DollarSign },
                { step: '6', title: 'Get Hired', desc: 'Showcase real verified ratings', icon: TrendingUp },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center justify-between"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 font-bold mb-3">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-1">
                    Step {item.step}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
              {[
                { step: '1', title: 'Post Requirement', desc: 'Define goals, budget & timeline' },
                { step: '2', title: 'Discover Talent', desc: 'Browse audited student skills' },
                { step: '3', title: 'Verify Skills', desc: 'Review Skill Passports & hackathon code' },
                { step: '4', title: 'Select Student', desc: 'One-click candidate engagement' },
                { step: '5', title: 'Manage Project', desc: 'Track milestone deliverables' },
                { step: '6', title: 'Approve Work', desc: 'Verify code & release escrow payment' },
                { step: '7', title: 'Rate Student', desc: 'Award verified reputation badge' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center justify-between"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 mb-2">
                    {item.step}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                  <p className="mt-1 text-[10.5px] text-slate-500 dark:text-slate-400 leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Open Projects */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-500">
              <Flame className="h-4 w-4" />
              Verified Local Contracts
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Featured Tech Projects
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Local retail, gyms, coaching institutes, and restaurants ready to hire student builders.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/projects')}
            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
          >
            Browse All Projects <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onSelect={onSelectProject}
            />
          ))}
        </div>
      </section>

      {/* Skill Passport Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 p-6 sm:p-10 dark:border-slate-800 dark:from-slate-900/90 dark:via-slate-900 dark:to-orange-950/20 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-600 dark:text-orange-400">
                <ShieldCheck className="h-4 w-4" />
                The Currency of Verified Capability
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                No Resumes Needed. Just Your Verified Skill Passport.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Traditional CVs can be inflated. BuildSkillForge Skill Passports automatically compile real evidence from verified competition rankings, audited code quality scores, and authentic local business ratings.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Tamper-evident score compiled across real deliveries
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  5-criteria business ratings with verified testimonials
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  National hackathon podiums & code repos attached
                </div>
              </div>
              <div className="pt-3">
                <button
                  onClick={() => onNavigate('/talent')}
                  className="rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-500 shadow-md shadow-orange-500/20 transition-all"
                >
                  Browse Audited Talent Directory
                </button>
              </div>
            </div>

            {/* Passport Card Preview */}
            <div className="lg:col-span-7">
              {topTalent[0] && (
                <SkillPassportCard
                  passport={topTalent[0]}
                  interactive={false}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Transparent 10% Platform Fee Model */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Fair & Transparent Economics
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Flat 10% Platform Fee on Completed Projects
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              We never charge students to create an account, build a passport, or enter competitions. BuildSkillForge earns only when a project is successfully completed and approved by the business.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-850">
              <div className="text-xs text-slate-500 dark:text-slate-400">Total Project Value</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">₹15,000</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Budget deposited in secure escrow</div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-850">
              <div className="text-xs text-slate-500 dark:text-slate-400">BuildSkillForge Fee (10%)</div>
              <div className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 mt-1">₹1,500</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Platform maintenance & dispute mediation</div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/30 p-4 dark:border-emerald-500/20 dark:bg-emerald-950/20">
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Student Payout (Net)</div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">₹13,500</div>
              <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">Direct release upon milestone approval</div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitions Callout */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-700 p-8 sm:p-12 text-white overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white mb-4">
              <Trophy className="h-3.5 w-3.5" />
              National Challenge League
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Prove Your Technical Mettle. Win Cash & Direct Contracts.
            </h2>
            <p className="mt-3 text-sm text-orange-100 leading-relaxed">
              Competitions are the skill-verification and talent-discovery engine of BuildSkillForge. Submit your code, get ranked, and unlock premium local business offers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('/competitions')}
                className="rounded-xl bg-white px-5 py-3 text-xs font-bold text-orange-600 hover:bg-orange-50 shadow-md active:scale-95 transition-all"
              >
                View Active Competitions
              </button>
              <button
                onClick={() => onNavigate('/leaderboard')}
                className="rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-xs font-bold text-white hover:bg-white/20 transition-all"
              >
                Inspect National Leaderboard
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
