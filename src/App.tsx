import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { NotificationProvider } from './context/NotificationContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { ForgeAIModal } from './components/ForgeAIModal.js';

// Pages
import { Home } from './pages/Home.js';
import { ProjectsMarketplace } from './pages/ProjectsMarketplace.js';
import { ProjectDetail } from './pages/ProjectDetail.js';
import { ProjectWorkspace } from './pages/ProjectWorkspace.js';
import { StudentDashboard } from './pages/StudentDashboard.js';
import { BusinessDashboard } from './pages/BusinessDashboard.js';
import { SkillPassportPage } from './pages/SkillPassportPage.js';
import { CompetitionsPage } from './pages/CompetitionsPage.js';
import { LeaderboardPage } from './pages/LeaderboardPage.js';
import { TalentDirectoryPage } from './pages/TalentDirectoryPage.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { SupportPage } from './pages/SupportPage.js';
import { HowItWorksPage } from './pages/HowItWorksPage.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';

function MainApp() {
  const { user, role } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [forgeAIOpen, setForgeAIOpen] = useState(false);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route parser
  const renderRoute = () => {
    // 1. Project Detail (/projects/:id)
    if (currentPath.startsWith('/projects/') && currentPath !== '/projects') {
      const projectId = currentPath.split('/projects/')[1];
      return (
        <ProjectDetail
          projectId={projectId}
          onBack={() => navigate('/projects')}
          onNavigateToWorkspace={(id) => navigate(`/workspace/${id}`)}
          onNavigateToLogin={() => navigate('/login')}
        />
      );
    }

    // 2. Project Workspace (/workspace/:projectId)
    if (currentPath.startsWith('/workspace/')) {
      const projectId = currentPath.split('/workspace/')[1];
      return (
        <ProjectWorkspace
          projectId={projectId}
          onBack={() => navigate(role === 'BUSINESS' ? '/business/dashboard' : '/student/dashboard')}
          onNavigateToPassport={(studentId) => navigate(`/skill-passport/${studentId}`)}
        />
      );
    }

    // 3. Skill Passport Page (/skill-passport/:studentId)
    if (currentPath.startsWith('/skill-passport/')) {
      const studentId = currentPath.split('/skill-passport/')[1];
      return (
        <SkillPassportPage
          studentId={studentId}
          onBack={() => navigate('/talent')}
        />
      );
    }

    // 4. Exact routes
    switch (currentPath) {
      case '/projects':
        return (
          <ProjectsMarketplace
            onSelectProject={(id) => navigate(`/projects/${id}`)}
          />
        );

      case '/talent':
        return (
          <TalentDirectoryPage
            onNavigateToPassport={(studentId) => navigate(`/skill-passport/${studentId}`)}
          />
        );

      case '/competitions':
        return (
          <CompetitionsPage
            onNavigateToLeaderboard={() => navigate('/leaderboard')}
            onNavigateToLogin={() => navigate('/login')}
          />
        );

      case '/leaderboard':
        return (
          <LeaderboardPage
            onNavigateToPassport={(studentId) => navigate(`/skill-passport/${studentId}`)}
          />
        );

      case '/how-it-works':
        return (
          <HowItWorksPage
            onNavigateToProjects={() => navigate('/projects')}
            onNavigateToRegister={() => navigate('/register')}
          />
        );

      case '/student/dashboard':
        return (
          <StudentDashboard
            onNavigateToWorkspace={(id) => navigate(`/workspace/${id}`)}
            onNavigateToPassport={(studentId) => navigate(`/skill-passport/${studentId}`)}
            onNavigateToProject={(id) => navigate(`/projects/${id}`)}
            onNavigateToCompetitions={() => navigate('/competitions')}
          />
        );

      case '/business/dashboard':
        return (
          <BusinessDashboard
            onNavigateToProject={(id) => navigate(`/projects/${id}`)}
            onNavigateToWorkspace={(id) => navigate(`/workspace/${id}`)}
            onNavigateToTalent={() => navigate('/talent')}
          />
        );

      case '/admin':
        return (
          <AdminDashboard
            onNavigateToProject={(id) => navigate(`/projects/${id}`)}
          />
        );

      case '/support':
        return <SupportPage />;

      case '/login':
        return (
          <Login
            onNavigateToRegister={() => navigate('/register')}
            onSuccess={() => navigate(role === 'BUSINESS' ? '/business/dashboard' : '/student/dashboard')}
          />
        );

      case '/register':
        return (
          <Register
            onNavigateToLogin={() => navigate('/login')}
            onSuccess={() => navigate(role === 'BUSINESS' ? '/business/dashboard' : '/student/dashboard')}
          />
        );

      case '/':
      default:
        return (
          <Home
            onNavigate={navigate}
            onSelectProject={(id) => navigate(`/projects/${id}`)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-200">
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenForgeAI={() => setForgeAIOpen(true)}
      />

      <main className="flex-1">
        {renderRoute()}
      </main>

      <Footer onNavigate={navigate} />

      {/* Global ForgeAI Assistant Drawer */}
      <ForgeAIModal
        isOpen={forgeAIOpen}
        onClose={() => setForgeAIOpen(false)}
        onNavigateToSupport={() => navigate('/support')}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <MainApp />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
