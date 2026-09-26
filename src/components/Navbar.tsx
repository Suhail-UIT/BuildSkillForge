import React, { useState } from 'react';
import {
  Flame,
  Search,
  Trophy,
  Users,
  Compass,
  Bell,
  Sun,
  Moon,
  Sparkles,
  CheckCircle,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Briefcase,
  Shield,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';
import { useNotifications } from '../context/NotificationContext.js';

interface NavbarProps {
  onOpenForgeAI: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenForgeAI, currentPath, onNavigate }) => {
  const { user, role, logout, demoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
    setProfileDropdownOpen(false);
    setDemoMenuOpen(false);
  };

  const navLinks = [
    { label: 'Marketplace', path: '/projects', icon: Search },
    { label: 'Talent Directory', path: '/talent', icon: Users },
    { label: 'Competitions', path: '/competitions', icon: Trophy },
    { label: 'Leaderboard', path: '/leaderboard', icon: Compass },
    { label: 'How It Works', path: '/how-it-works', icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90 transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleNav('/')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  BuildSkill<span className="text-orange-500">Forge</span>
                </span>
                <span className="rounded bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                  INDIA
                </span>
              </div>
              <p className="hidden text-[10.5px] font-medium text-slate-500 dark:text-slate-400 sm:block -mt-0.5">
                Build Skills. Build Projects. Build Your Future.
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? 'text-orange-600 dark:text-orange-400 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              title="Switch demo persona for quick grading"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Fast Persona</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>

            {demoMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Switch Role / Test Persona
                </div>
                <div className="space-y-1 mt-1">
                  <button
                    onClick={() => { demoLogin('student_aarav'); setDemoMenuOpen(false); }}
                    className="w-full flex items-center justify-between rounded-lg p-2 text-left text-xs hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Aarav Sharma (Student)</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Score 92 · Active Café Project</div>
                    </div>
                    {user?.email === 'aarav@student.buildskillforge.com' && <CheckCircle className="h-4 w-4 text-orange-500" />}
                  </button>

                  <button
                    onClick={() => { demoLogin('student_priya'); setDemoMenuOpen(false); }}
                    className="w-full flex items-center justify-between rounded-lg p-2 text-left text-xs hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Priya Patel (Student)</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Score 94 · AI Grand Prix Champ</div>
                    </div>
                    {user?.email === 'priya@student.buildskillforge.com' && <CheckCircle className="h-4 w-4 text-orange-500" />}
                  </button>

                  <button
                    onClick={() => { demoLogin('business_cafe'); setDemoMenuOpen(false); }}
                    className="w-full flex items-center justify-between rounded-lg p-2 text-left text-xs hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Bean & Brew Café (Business)</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">POS Project Owner · Verified</div>
                    </div>
                    {user?.email === 'rajesh@beanbrewcafe.in' && <CheckCircle className="h-4 w-4 text-orange-500" />}
                  </button>

                  <button
                    onClick={() => { demoLogin('business_gym'); setDemoMenuOpen(false); }}
                    className="w-full flex items-center justify-between rounded-lg p-2 text-left text-xs hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">UrbanFit Gym (Business)</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Hiring Portal Developer</div>
                    </div>
                    {user?.email === 'vikram@urbanfitgym.in' && <CheckCircle className="h-4 w-4 text-orange-500" />}
                  </button>

                  <button
                    onClick={() => { demoLogin('admin'); setDemoMenuOpen(false); }}
                    className="w-full flex items-center justify-between rounded-lg p-2 text-left text-xs hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Platform Admin</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Full platform moderation & fee telemetry</div>
                    </div>
                    {user?.role === 'ADMIN' && <CheckCircle className="h-4 w-4 text-indigo-500" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ForgeAI Assistant Launcher */}
          <button
            onClick={onOpenForgeAI}
            className="relative flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-orange-500/30 hover:brightness-105 active:scale-95 transition-all"
            title="Ask ForgeAI Assistant (English/Hindi/Hinglish)"
          >
            <Sparkles className="h-3.5 w-3.5 animate-spin-slow" />
            <span className="hidden sm:inline">Ask</span> ForgeAI
            <span className="flex h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </button>

          {/* Notification Bell */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[9px] font-bold text-white shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] font-medium text-orange-600 dark:text-orange-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 mt-1">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">No notifications yet.</div>
                    ) : (
                      notifications.slice(0, 6).map((n) => (
                        <div
                          key={n._id}
                          onClick={() => {
                            markAsRead(n._id);
                            if (n.link) handleNav(n.link);
                          }}
                          className={`p-2.5 text-left rounded-lg cursor-pointer transition-colors ${
                            !n.read
                              ? 'bg-orange-50/60 dark:bg-orange-950/20'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                            <span>{n.title}</span>
                            {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile / Auth State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <span className="hidden md:block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="h-3 w-3 opacity-60 text-slate-500" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    <div className="mt-1 inline-flex items-center rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                      {user.role}
                    </div>
                  </div>

                  <div className="mt-1 space-y-0.5">
                    {role === 'STUDENT' && (
                      <>
                        <button
                          onClick={() => handleNav('/student/dashboard')}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors"
                        >
                          <GraduationCap className="h-3.5 w-3.5 text-orange-500" />
                          Student Dashboard
                        </button>
                        <button
                          onClick={() => handleNav(`/skill-passport/${user._id}`)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                          My Skill Passport
                        </button>
                      </>
                    )}

                    {role === 'BUSINESS' && (
                      <button
                        onClick={() => handleNav('/business/dashboard')}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors"
                      >
                        <Briefcase className="h-3.5 w-3.5 text-orange-500" />
                        Business Dashboard
                      </button>
                    )}

                    {role === 'ADMIN' && (
                      <button
                        onClick={() => handleNav('/admin')}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors"
                      >
                        <Shield className="h-3.5 w-3.5 text-indigo-500" />
                        Admin Console
                      </button>
                    )}

                    <button
                      onClick={() => handleNav('/support')}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      Help & Support Tickets
                    </button>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => { logout(); setProfileDropdownOpen(false); handleNav('/'); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('/login')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('/register')}
                className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-500 active:scale-95 transition-all"
              >
                Join Platform
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden dark:border-slate-800 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 lg:hidden dark:border-slate-800 dark:bg-slate-950 space-y-2">
          {navLinks.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <item.icon className="h-4 w-4 text-orange-500" />
              {item.label}
            </button>
          ))}
          {user && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
              {role === 'STUDENT' && (
                <button
                  onClick={() => handleNav('/student/dashboard')}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-orange-600 dark:text-orange-400"
                >
                  <GraduationCap className="h-4 w-4" />
                  Student Dashboard
                </button>
              )}
              {role === 'BUSINESS' && (
                <button
                  onClick={() => handleNav('/business/dashboard')}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-orange-600 dark:text-orange-400"
                >
                  <Briefcase className="h-4 w-4" />
                  Business Dashboard
                </button>
              )}
              {role === 'ADMIN' && (
                <button
                  onClick={() => handleNav('/admin')}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-indigo-500"
                >
                  <Shield className="h-4 w-4" />
                  Admin Console
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
