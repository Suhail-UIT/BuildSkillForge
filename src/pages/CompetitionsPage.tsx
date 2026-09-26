import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { Competition } from '../types/index.js';

interface CompetitionsPageProps {
  onNavigateToLeaderboard: () => void;
  onNavigateToLogin: () => void;
}

export const CompetitionsPage: React.FC<CompetitionsPageProps> = ({
  onNavigateToLeaderboard,
  onNavigateToLogin,
}) => {
  const { user, role } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected competition for details or submission
  const [selectedComp, setSelectedComp] = useState<Competition | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);

  const fetchCompetitions = async () => {
    try {
      const res = await api.getCompetitions();
      if (res.success) {
        setCompetitions(res.competitions);
        if (res.competitions.length > 0 && !selectedComp) {
          setSelectedComp(res.competitions[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to load competitions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onNavigateToLogin();
      return;
    }
    if (!selectedComp) return;

    setIsSubmitting(true);
    try {
      const res = await api.submitCompetition(selectedComp._id, {
        githubUrl,
        liveDemoUrl,
        description,
      });

      if (res.success) {
        setSubmissionResult(res.participation);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        await fetchCompetitions();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit competition work.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-400">
        Loading National Challenges...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              National Engineering Challenges
            </h1>
            <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-bold text-orange-600 dark:text-orange-400">
              Verified Verification Layer
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Competitions on BuildSkillForge are the official skill-proofing layer. Submitting code unlocks audited Skill Passport scores and direct contracts.
          </p>
        </div>

        <button
          onClick={onNavigateToLeaderboard}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trophy className="h-4 w-4 text-orange-500" />
          View Category Leaderboard
        </button>
      </div>

      {/* Main Grid: Challenge List vs Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Challenges List */}
        <div className="lg:col-span-5 space-y-3.5">
          {competitions.map((comp) => {
            const isSelected = selectedComp?._id === comp._id;
            return (
              <div
                key={comp._id}
                onClick={() => {
                  setSelectedComp(comp);
                  setSubmissionResult(comp.userParticipation || null);
                }}
                className={`rounded-2xl border p-4.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/20 shadow-md dark:border-orange-500/80 dark:bg-orange-950/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {comp.category}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Due {comp.deadline}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2 line-clamp-1">
                  {comp.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {comp.description}
                </p>

                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="font-extrabold text-orange-600 dark:text-orange-400 text-[11.5px]">
                    {comp.prize}
                  </div>
                  <div className="text-[10.5px] text-slate-400 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {comp.participantsCount} Entries
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Challenge Detail & Submission Console */}
        {selectedComp && (
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <span className="rounded bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                  {selectedComp.category} · {selectedComp.difficulty}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1.5">
                  {selectedComp.title}
                </h2>
              </div>

              {selectedComp.userParticipation ? (
                <div className="rounded-xl bg-emerald-50 px-3.5 py-2 text-right dark:bg-emerald-950/30">
                  <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                    Your Score
                  </div>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    {selectedComp.userParticipation.score} / 100
                  </div>
                </div>
              ) : role === 'STUDENT' ? (
                <button
                  onClick={() => setSubmitModalOpen(true)}
                  className="rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-500 transition-all self-start sm:self-auto shrink-0"
                >
                  Enter & Submit Code
                </button>
              ) : !user ? (
                <button
                  onClick={onNavigateToLogin}
                  className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500"
                >
                  Sign in to Enter
                </button>
              ) : null}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Challenge Brief
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedComp.description}
              </p>
            </div>

            {/* Rules */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Technical Rules & Guidelines
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                {selectedComp.rules.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Evaluation Weights */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Evaluation Criteria
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {selectedComp.evaluationCriteria.map((c, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-850 text-center"
                  >
                    <div className="text-base font-extrabold text-orange-600 dark:text-orange-400">
                      {c.weight}%
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {c.criteria}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* If user submitted, show submission details */}
            {(submissionResult || selectedComp.userParticipation) && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/20 p-5 dark:border-emerald-500/10 dark:bg-emerald-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Verified Solution Evaluated
                  </div>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    Rank #{submissionResult?.rank || selectedComp.userParticipation?.rank}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {submissionResult?.feedback || selectedComp.userParticipation?.feedback}
                </p>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 pt-1 flex items-center gap-1 font-semibold">
                  <Sparkles className="h-3 w-3" />
                  Your Skill Passport has been updated with this challenge score and badge!
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit Solution Modal */}
      {submitModalOpen && selectedComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Submit Challenge Entry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Challenge: &quot;{selectedComp.title}&quot;
            </p>

            <form onSubmit={handleSubmitSolution} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Public GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/your-username/challenge-repo"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Live Deployed Preview URL (Optional)
                </label>
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="https://my-challenge-app.vercel.app"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Solution Architecture Summary
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain your approach, optimization decisions, and instructions to test..."
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-semibold text-white hover:bg-orange-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Evaluating Solution...' : 'Submit & Score'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
