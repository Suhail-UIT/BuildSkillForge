import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as authCtrl from '../controllers/authController.js';
import * as projCtrl from '../controllers/projectController.js';
import * as wsCtrl from '../controllers/workspaceController.js';
import * as compCtrl from '../controllers/competitionController.js';
import * as passCtrl from '../controllers/passportController.js';
import * as miscCtrl from '../controllers/miscController.js';

export const apiRouter = Router();

// 1. AUTH
apiRouter.post('/auth/register', authCtrl.register);
apiRouter.post('/auth/login', authCtrl.login);
apiRouter.post('/auth/demo-login', authCtrl.demoLogin);
apiRouter.get('/auth/me', protect, authCtrl.getMe);

// 2. PROJECTS & APPLICATIONS
apiRouter.get('/projects', projCtrl.getProjects);
apiRouter.get('/projects/:id', projCtrl.getProjectById);
apiRouter.post('/projects', protect, authorize('BUSINESS', 'ADMIN'), projCtrl.createProject);
apiRouter.post('/projects/:id/apply', protect, authorize('STUDENT'), projCtrl.applyToProject);
apiRouter.get('/projects/:id/applications', protect, projCtrl.getProjectApplications);
apiRouter.post('/projects/:id/select-student', protect, authorize('BUSINESS', 'ADMIN'), projCtrl.selectStudent);

// 3. WORKSPACE
apiRouter.get('/workspace/:projectId', protect, wsCtrl.getWorkspace);
apiRouter.post('/workspace/:projectId/milestones/:milestoneId', protect, wsCtrl.updateMilestoneStatus);
apiRouter.post('/workspace/:projectId/messages', protect, wsCtrl.sendWorkspaceMessage);
apiRouter.post('/workspace/:projectId/complete-and-rate', protect, authorize('BUSINESS', 'ADMIN'), wsCtrl.completeAndRateProject);

// 4. COMPETITIONS & LEADERBOARD
apiRouter.get('/competitions', compCtrl.getCompetitions);
apiRouter.get('/competitions/leaderboard', compCtrl.getGlobalLeaderboard);
apiRouter.get('/competitions/:id', compCtrl.getCompetitionById);
apiRouter.post('/competitions/:id/submit', protect, authorize('STUDENT'), compCtrl.submitCompetitionWork);

// 5. SKILL PASSPORTS & TALENT
apiRouter.get('/skill-passports/:studentId', passCtrl.getSkillPassport);
apiRouter.get('/talent', passCtrl.searchTalent);
apiRouter.put('/talent/profile', protect, authorize('STUDENT'), passCtrl.updateStudentProfile);

// 6. PAYMENTS
apiRouter.get('/payments/history', protect, miscCtrl.getPaymentHistory);
apiRouter.post('/payments/create-order', protect, miscCtrl.createPaymentOrder);

// 7. NOTIFICATIONS
apiRouter.get('/notifications', protect, miscCtrl.getNotifications);
apiRouter.patch('/notifications/:id/read', protect, miscCtrl.markNotificationRead);
apiRouter.post('/notifications/mark-all-read', protect, miscCtrl.markAllNotificationsRead);

// 8. SUPPORT TICKETS
apiRouter.get('/support', protect, miscCtrl.getSupportTickets);
apiRouter.post('/support', protect, miscCtrl.createSupportTicket);
apiRouter.patch('/support/:id', protect, authorize('ADMIN'), miscCtrl.updateSupportTicket);

// 9. FORGE AI ASSISTANT
apiRouter.post('/ai/ask', miscCtrl.askAI);

// 10. ADMIN DASHBOARD
apiRouter.get('/admin/stats', protect, authorize('ADMIN'), miscCtrl.getAdminStats);
apiRouter.patch('/admin/users/:id/status', protect, authorize('ADMIN'), miscCtrl.toggleUserStatus);
