import React, { useState } from 'react';
import {
  ShieldCheck,
  Trophy,
  Star,
  CheckCircle2,
  ExternalLink,
  Award,
  Sparkles,
  Share2,
  GraduationCap,
  MapPin,
  Briefcase,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import { SkillPassport } from '../types/index.js';

interface SkillPassportCardProps {
  passport: SkillPassport;
  onNavigateToProject?: (projectId: string) => void;
  onNavigateToCompetition?: (compId: string) => void;
  interactive?: boolean;
}

export const SkillPassportCard: React.FC<SkillPassportCardProps> = ({
  passport,
  onNavigateToProject,
  onNavigateToCompetition,
  interactive = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/skill-passport/${passport.studentId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 80) return 'text-amber-500 border-amber-500/30 bg-amber-500/10';
    return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 relative overflow-hidden transition-all">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-indigo-600"></div>

      {/* Header Profile Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={passport.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${passport.studentName || 'Student'}`}
              alt={passport.studentName}
              className="h-14 w-14 rounded-2xl object-cover border-2 border-orange-500/20 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-0.5 text-white" title="Verified by BuildSkillForge">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {passport.studentName || 'Verified Builder'}
              </h3>
              <span className="inline-flex items-center gap-1 rounded bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                <ShieldCheck className="h-3 w-3" />
                VERIFIED PASSPORT
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5" />
                {passport.college || 'Tier-1 Engineering College'}
              </span>
              {passport.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {passport.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Overall Skill Score</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Audited via real code & reviews</div>
          </div>
          <div className={`flex h-13 w-13 items-center justify-center rounded-2xl border text-xl font-extrabold shadow-inner ${getScoreColor(passport.overallScore)}`}>
            {passport.overallScore}
          </div>
          <button
            onClick={handleCopyLink}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Share verified passport"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Grid: Skills, Client Reputation, and Badges */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Col 1: Verified Skills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            <span className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-orange-500" />
              Verified Skills
            </span>
            <span className="text-[10px] text-slate-400">Score / 100</span>
          </div>
          <div className="space-y-2.5">
            {passport.skills.slice(0, 5).map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{s.name}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{s.score}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                    style={{ width: `${s.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: Client Rating Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              Client Ratings ({passport.ratings.reviewCount} Reviews)
            </span>
            <span className="text-xs font-bold text-amber-500">
              {passport.ratings.average.toFixed(1)} / 5.0
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            {[
              { label: 'Communication', val: passport.ratings.communication },
              { label: 'Quality of Code', val: passport.ratings.quality },
              { label: 'On-Time Delivery', val: passport.ratings.delivery },
              { label: 'Professionalism', val: passport.ratings.professionalism },
              { label: 'Problem Solving', val: passport.ratings.problemSolving },
            ].map((crit, i) => (
              <div key={i} className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-0.5">
                <span className="text-[11px]">{crit.label}</span>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= Math.round(crit.val)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white ml-1">
                    {crit.val.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Earned Badges & Competition History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            <span className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-indigo-500" />
              Badges & Podiums
            </span>
            <span className="text-[10px] text-slate-400">{passport.badges.length} Unlocked</span>
          </div>

          <div className="space-y-2">
            {passport.badges.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2 dark:border-slate-800 dark:bg-slate-850"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{b.name}</div>
                  <div className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-1">{b.description}</div>
                </div>
              </div>
            ))}

            {passport.competitionHistory.length > 0 && (
              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  National Hackathon Podiums:
                </div>
                {passport.competitionHistory.slice(0, 2).map((comp, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[180px]">
                      {comp.competitionTitle}
                    </span>
                    <span className="shrink-0 rounded bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      Rank #{comp.rank} ({comp.score} pts)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verified Project Deliveries History */}
      {passport.projects && passport.projects.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2.5 flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-orange-500" />
            Verified Delivered Contracts
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {passport.projects.map((proj, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{proj.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Client: {proj.clientName} · Delivered {proj.completedAt}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.skillsUsed.map((sk, idx) => (
                      <span key={idx} className="rounded bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.2 text-[9.5px] text-slate-700 dark:text-slate-300">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  <span>{proj.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
