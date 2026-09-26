import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, ExternalLink, ShieldCheck, Search, Users } from 'lucide-react';
import { api } from '../services/api.js';

interface LeaderboardPageProps {
  onNavigateToPassport: (studentId: string) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ onNavigateToPassport }) => {
  const [category, setCategory] = useState('Overall');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'Overall',
    'Full Stack',
    'AI',
    'Cybersecurity',
    'Data Science',
    'Data Engineering',
    'Cloud/DevOps',
    'UI/UX',
  ];

  useEffect(() => {
    async function fetchRankings() {
      setLoading(true);
      try {
        const res = await api.getLeaderboard(category === 'Overall' ? undefined : category);
        if (res.success) {
          setLeaderboard(res.leaderboard);
        }
      } catch (err) {
        console.warn('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRankings();
  }, [category]);

  const filtered = leaderboard.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.college.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            National Verified Leaderboard
          </h1>
          <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-bold text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
            Real Audited Scores
          </span>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Rankings computed from national competition submissions, code review scores, and verified business deliveries.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student or college..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">
            Calculating rankings...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No student scores recorded in this category yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((student) => {
              const isTop3 = student.rank <= 3;
              return (
                <div
                  key={student.studentId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-slate-50/60 dark:hover:bg-slate-850/50 transition-colors gap-3"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-black text-sm ${
                        student.rank === 1
                          ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-400/20'
                          : student.rank === 2
                          ? 'bg-slate-300 text-slate-900 dark:bg-slate-700 dark:text-white'
                          : student.rank === 3
                          ? 'bg-amber-700 text-amber-100'
                          : 'border border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {student.rank === 1 ? <Trophy className="h-4 w-4" /> : `#${student.rank}`}
                    </div>

                    {/* Student Info */}
                    <img
                      src={student.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                      alt={student.name}
                      className="h-10 w-10 rounded-xl object-cover border"
                    />

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {student.name}
                        </span>
                        <ShieldCheck className="h-3.5 w-3.5 text-orange-500" />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {student.college} · {student.projectsDelivered} Verified Contracts Delivered
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 pl-13 sm:pl-0">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Skill Score</div>
                      <div className="text-base font-black text-orange-600 dark:text-orange-400">
                        {student.overallScore} / 100
                      </div>
                    </div>

                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Client Rating</div>
                      <div className="text-xs font-bold text-amber-500 flex items-center justify-end gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        {student.rating?.toFixed(1) || '5.0'}
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateToPassport(student.studentId)}
                      className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center gap-1 transition-all shrink-0"
                    >
                      Passport <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
