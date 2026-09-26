import React from 'react';
import { Flame, Shield, ArrowUpRight, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50 text-slate-600 dark:border-slate-800/80 dark:bg-slate-950 dark:text-slate-400 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 text-white shadow-md">
                <Flame className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                BuildSkill<span className="text-orange-500">Forge</span>
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
              Connecting ambitious college students across India with local businesses for verified, high-impact digital and engineering projects.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                <Shield className="h-3 w-3" />
                100% Milestone-Based Escrow Protection
              </div>
            </div>
          </div>

          {/* Column 2: Students */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              For Students
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/projects')} className="hover:text-orange-500 transition-colors">
                  Browse Paid Projects
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/competitions')} className="hover:text-orange-500 transition-colors">
                  National Competitions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/leaderboard')} className="hover:text-orange-500 transition-colors">
                  Verified Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/how-it-works')} className="hover:text-orange-500 transition-colors">
                  Skill Passport System
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Businesses */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              For Businesses
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/talent')} className="hover:text-orange-500 transition-colors">
                  Discover Verified Talent
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/business/dashboard')} className="hover:text-orange-500 transition-colors">
                  Post a Tech Project
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/how-it-works')} className="hover:text-orange-500 transition-colors">
                  10% Platform Fee Model
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/support')} className="hover:text-orange-500 transition-colors">
                  Project Mediation & Help
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform Model Note */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              10% Transparent Fee
            </h3>
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60 text-[11px] leading-relaxed">
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Example: ₹15,000 Project
              </p>
              <div className="mt-1.5 flex justify-between text-slate-500 dark:text-slate-400">
                <span>Platform Fee (10%):</span>
                <span>₹1,500</span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Student Payout:</span>
                <span>₹13,500</span>
              </div>
              <p className="mt-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-1.5">
                No hidden costs. Zero upfront fees to apply or join competitions.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-slate-200/80 pt-6 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <div className="flex items-center gap-1">
            <span>© 2026 BuildSkillForge Technologies. Crafted for Indian Builders.</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('/how-it-works')} className="hover:underline">
              Terms & Platform Rules
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('/support')} className="hover:underline">
              Escrow Security
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('/support')} className="hover:underline">
              Support Desk
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
