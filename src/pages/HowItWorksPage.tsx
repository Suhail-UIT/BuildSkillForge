import React from 'react';
import {
  ShieldCheck,
  DollarSign,
  Trophy,
  CheckCircle2,
  Users,
  Briefcase,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigateToProjects: () => void;
  onNavigateToRegister: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onNavigateToProjects,
  onNavigateToRegister,
}) => {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-600 dark:text-orange-400 mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          The BuildSkillForge Operating Model
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How BuildSkillForge Works
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Bridging the chasm between college curriculum and real-world commercial software engineering through audited skill verification and milestone escrow.
        </p>
      </div>

      {/* Transparent 10% Model Card */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-orange-50/20 p-8 sm:p-10 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-orange-950/20 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
            Fair Platform Economics
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Flat 10% Platform Fee on Completed Projects
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            BuildSkillForge charges zero upfront listing fees to businesses and zero charges for students to build an audited Skill Passport or participate in competitions. We only monetize when genuine economic value is delivered.
          </p>
        </div>

        {/* Example graphic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-850">
            <div className="text-xs text-slate-400 font-medium">1. Project Agreement</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹15,000</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Business deposits contract budget into escrow before student begins coding.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-850">
            <div className="text-xs text-slate-400 font-medium">2. Platform Operations Cut</div>
            <div className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">₹1,500 (10%)</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Covers automated code auditing, infrastructure, and dispute mediation.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/40 p-5 dark:border-emerald-500/10 dark:bg-emerald-950/30">
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">3. Student Direct Payout</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">₹13,500</div>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 mt-1 leading-snug">
              Credited directly to the student builder upon milestone approval.
            </p>
          </div>
        </div>
      </div>

      {/* Dual Journeys */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Student Flow */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 font-bold">
              🎓
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              The Student Journey
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Learn → Compete → Prove → Build → Earn → Get Hired
          </p>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { title: '1. Register & Sync Profile', desc: 'Detail your college, degrees, and preferred tech stack.' },
              { title: '2. Compete in National Challenges', desc: 'Submit real repos to our automated scoring engine.' },
              { title: '3. Build Tamper-Proof Skill Passport', desc: 'Rankings, code scores, and badges are minted to your passport.' },
              { title: '4. Apply with 1-Click Passport', desc: 'Businesses select candidates based on proven capability.' },
              { title: '5. Deliver Milestones in Workspace', desc: 'Submit deliverables, collaborate in chat, and get paid upon approval.' },
              { title: '6. Earn 5-Star Reputation', desc: 'Client ratings directly update your passport for future hiring.' },
            ].map((s, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-500 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{s.title}</div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Flow */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 font-bold">
              💼
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              The Business Journey
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Post → Discover → Verify → Select → Manage → Approve → Rate
          </p>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { title: '1. Post Tech Requirement', desc: 'Define goals, budget, and structured milestone stages.' },
              { title: '2. Review Verified Skill Passports', desc: 'Inspect applicants\' audited code, hackathon ranks, and prior ratings.' },
              { title: '3. One-Click Candidate Engagement', desc: 'Select candidate to launch your shared Project Workspace.' },
              { title: '4. Milestone Deliverable Review', desc: 'Test live links and code before approving payments.' },
              { title: '5. Instant Escrow Release', desc: 'Funds are unlocked per verified milestone.' },
              { title: '6. Rate Builder & Build Talent Pipeline', desc: 'Provide 5-star ratings and re-engage for future sprints.' },
            ].map((s, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{s.title}</div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Escrow Guarantee */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/30 p-6 sm:p-8 dark:border-emerald-500/10 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <Lock className="h-4 w-4" />
            100% Milestone-Based Escrow Protection
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Zero Unpaid Work. Zero Incomplete Deliverables.
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
            Funds are securely locked in escrow before a project starts. Students are guaranteed payment upon approved delivery, and businesses only release funds when deliverables match specifications.
          </p>
        </div>

        <button
          onClick={onNavigateToProjects}
          className="rounded-xl bg-orange-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-orange-500 shrink-0 self-start sm:self-auto"
        >
          Explore Projects Now
        </button>
      </div>
    </div>
  );
};
