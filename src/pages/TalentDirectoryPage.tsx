import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, Star, GraduationCap, MapPin, ExternalLink, Award } from 'lucide-react';
import { api } from '../services/api.js';

interface TalentDirectoryPageProps {
  onNavigateToPassport: (studentId: string) => void;
}

export const TalentDirectoryPage: React.FC<TalentDirectoryPageProps> = ({ onNavigateToPassport }) => {
  const [talent, setTalent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [minScore, setMinScore] = useState('');

  const skillsList = ['All', 'React', 'Python', 'Node.js', 'FastAPI', 'TypeScript', 'Tailwind CSS', 'Docker'];

  useEffect(() => {
    async function fetchTalent() {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (skillFilter !== 'All') params.skill = skillFilter;
        if (minScore) params.minScore = minScore;
        if (searchTerm.trim()) params.query = searchTerm.trim();

        const res = await api.searchTalent(params);
        if (res.success) {
          setTalent(res.talent);
        }
      } catch (err) {
        console.warn('Failed to load talent directory:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchTalent, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, skillFilter, minScore]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Discover Verified Talent
          </h1>
          <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-bold text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
            {talent.length} Collegiate Builders
          </span>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Search students by audited Skill Passport score, specific tech stack, and proven competition results.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, college, or expertise..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 mr-2">Skill Filter:</label>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {skillsList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 mr-2">Min Passport Score:</label>
            <input
              type="number"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              placeholder="e.g. 80"
              className="w-24 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Talent Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading verified talent...</div>
      ) : talent.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400">No students matched criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talent.map((t) => (
            <div
              key={t.userId}
              onClick={() => onNavigateToPassport(t.userId)}
              className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:border-orange-400 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${t.name}`}
                      alt={t.name}
                      className="h-12 w-12 rounded-xl object-cover border"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                          {t.name}
                        </span>
                        <ShieldCheck className="h-3.5 w-3.5 text-orange-500" />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        {t.college}
                      </div>
                    </div>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 font-extrabold text-sm dark:bg-orange-500/20 dark:text-orange-400">
                    {t.overallScore}
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {t.bio}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.skills.slice(0, 4).map((sk: string, i: number) => (
                    <span
                      key={i}
                      className="rounded bg-slate-100 px-2 py-0.5 text-[10.5px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.projectsDelivered} Verified Contracts Delivered
                </div>
                <span className="font-semibold text-orange-600 dark:text-orange-400 group-hover:underline flex items-center gap-1">
                  View Passport <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
