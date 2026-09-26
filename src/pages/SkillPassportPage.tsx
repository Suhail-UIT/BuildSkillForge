import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Edit3,
  MapPin,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Plus,
  CheckCircle,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { SkillPassport } from '../types/index.js';
import { SkillPassportCard } from '../components/SkillPassportCard.js';

interface SkillPassportPageProps {
  studentId: string;
  onBack: () => void;
}

export const SkillPassportPage: React.FC<SkillPassportPageProps> = ({ studentId, onBack }) => {
  const { user } = useAuth();
  const [passport, setPassport] = useState<SkillPassport | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [bio, setBio] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [graduationYear, setGraduationYear] = useState(2026);
  const [location, setLocation] = useState('');
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchPassport = async () => {
    try {
      const res = await api.getSkillPassport(studentId);
      if (res.success) {
        setPassport(res.passport);
        setBio(res.passport.bio || '');
        setCollege(res.passport.college || '');
        setDegree(res.passport.degree || '');
        setGraduationYear(res.passport.graduationYear || 2026);
        setLocation(res.passport.location || '');
      }
    } catch (err) {
      console.warn('Failed to load passport:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassport();
  }, [studentId]);

  const isOwner = user && user._id === studentId;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const currentPortfolio = passport?.portfolio || [];
      const updatedPortfolio = [...currentPortfolio];

      if (portfolioTitle.trim() && portfolioUrl.trim()) {
        updatedPortfolio.push({
          title: portfolioTitle.trim(),
          url: portfolioUrl.trim(),
          description: 'Verified student showcase project.',
        });
      }

      await api.updateStudentProfile({
        bio,
        college,
        degree,
        graduationYear,
        location,
        portfolio: updatedPortfolio,
      });

      setEditModalOpen(false);
      setPortfolioTitle('');
      setPortfolioUrl('');
      await fetchPassport();
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-400">
        Loading verified Skill Passport...
      </div>
    );
  }

  if (!passport) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Skill Passport Not Found</h2>
        <button
          onClick={onBack}
          className="mt-4 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500"
        >
          Return Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {isOwner && (
          <button
            onClick={() => setEditModalOpen(true)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit Builder Profile
          </button>
        )}
      </div>

      {/* Primary Audited Skill Passport Presentation */}
      <SkillPassportCard passport={passport} />

      {/* Bio, Portfolio, and Work History Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* About & Credentials */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Builder Background
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {passport.bio || 'Verified collegiate engineering talent specializing in real-world software architecture.'}
          </p>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-orange-500" />
                Degree:
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {passport.degree || 'B.Tech in Computer Science'} ({passport.graduationYear || 2026})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-orange-500" />
                Location:
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {passport.location || 'India'}
              </span>
            </div>
          </div>
        </div>

        {/* Portfolio Showcases */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Public Repositories & Portfolio
            </h3>
          </div>

          {passport.portfolio && passport.portfolio.length > 0 ? (
            <div className="space-y-2.5">
              {passport.portfolio.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-850 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.description}</div>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-orange-500 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No public portfolio items attached yet.
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Edit Builder Profile
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Keep your collegiate background and portfolio current.
            </p>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bio / Technical Summary
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Degree & Major
                  </label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New Delhi, India"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Add New Portfolio Item */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-850 space-y-2">
                <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add Project Showcase Link
                </div>
                <input
                  type="text"
                  value={portfolioTitle}
                  onChange={(e) => setPortfolioTitle(e.target.value)}
                  placeholder="Project Name (e.g. ArtisanCraft E-Commerce)"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="GitHub / Live Demo Link (https://github.com/...)"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-semibold text-white hover:bg-orange-500 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
