const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('bsf_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
}

export const api = {
  // Auth
  register: (payload: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  demoLogin: (demoKey: string) => request<any>('/auth/demo-login', { method: 'POST', body: JSON.stringify({ demoKey }) }),
  getMe: () => request<any>('/auth/me'),

  // Projects
  getProjects: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ success: boolean; count: number; projects: any[] }>(`/projects${qs ? `?${qs}` : ''}`);
  },
  getProjectById: (id: string) => request<{ success: boolean; project: any }>(`/projects/${id}`),
  createProject: (payload: any) => request<{ success: boolean; project: any }>('/projects', { method: 'POST', body: JSON.stringify(payload) }),
  applyToProject: (id: string, payload: any) => request<{ success: boolean; application: any }>(`/projects/${id}/apply`, { method: 'POST', body: JSON.stringify(payload) }),
  getProjectApplications: (id: string) => request<{ success: boolean; applications: any[] }>(`/projects/${id}/applications`),
  selectStudent: (id: string, studentId: string) => request<{ success: boolean; project: any }>(`/projects/${id}/select-student`, { method: 'POST', body: JSON.stringify({ studentId }) }),

  // Workspace
  getWorkspace: (projectId: string) => request<{ success: boolean; workspace: any }>(`/workspace/${projectId}`),
  updateMilestone: (projectId: string, milestoneId: string, payload: any) => request<{ success: boolean; milestone: any; project: any }>(`/workspace/${projectId}/milestones/${milestoneId}`, { method: 'POST', body: JSON.stringify(payload) }),
  sendWorkspaceMessage: (projectId: string, message: string) => request<{ success: boolean; message: any }>(`/workspace/${projectId}/messages`, { method: 'POST', body: JSON.stringify({ message }) }),
  completeAndRate: (projectId: string, payload: any) => request<{ success: boolean; project: any; review: any }>(`/workspace/${projectId}/complete-and-rate`, { method: 'POST', body: JSON.stringify(payload) }),

  // Competitions
  getCompetitions: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ success: boolean; competitions: any[] }>(`/competitions${qs ? `?${qs}` : ''}`);
  },
  getCompetitionById: (id: string) => request<{ success: boolean; competition: any; leaderboard: any[]; userParticipation: any }>(`/competitions/${id}`),
  submitCompetition: (id: string, payload: any) => request<{ success: boolean; participation: any; passport: any }>(`/competitions/${id}/submit`, { method: 'POST', body: JSON.stringify(payload) }),
  getLeaderboard: (category?: string) => request<{ success: boolean; category: string; leaderboard: any[] }>(`/competitions/leaderboard${category ? `?category=${encodeURIComponent(category)}` : ''}`),

  // Skill Passport & Talent
  getSkillPassport: (studentId: string) => request<{ success: boolean; passport: any }>(`/skill-passports/${studentId}`),
  searchTalent: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ success: boolean; count: number; talent: any[] }>(`/talent${qs ? `?${qs}` : ''}`);
  },
  updateStudentProfile: (payload: any) => request<{ success: boolean; profile: any }>('/talent/profile', { method: 'PUT', body: JSON.stringify(payload) }),

  // Payments
  getPaymentHistory: () => request<{ success: boolean; payments: any[]; summary: any }>('/payments/history'),
  createPaymentOrder: (projectId: string, amount: number) => request<{ success: boolean; order: any }>('/payments/create-order', { method: 'POST', body: JSON.stringify({ projectId, amount }) }),

  // Notifications
  getNotifications: () => request<{ success: boolean; notifications: any[]; unreadCount: number }>('/notifications'),
  markNotificationRead: (id: string) => request<{ success: boolean }>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request<{ success: boolean }>('/notifications/mark-all-read', { method: 'POST' }),

  // Support
  getSupportTickets: () => request<{ success: boolean; tickets: any[] }>('/support'),
  createSupportTicket: (payload: any) => request<{ success: boolean; ticket: any }>('/support', { method: 'POST', body: JSON.stringify(payload) }),
  updateSupportTicket: (id: string, payload: any) => request<{ success: boolean; ticket: any }>(`/support/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),

  // AI Assistant
  askAI: (prompt: string, currentProjectId?: string) => request<{ success: boolean; answer: string; suggestSupport?: boolean }>('/ai/ask', { method: 'POST', body: JSON.stringify({ prompt, currentProjectId }) }),

  // Admin
  getAdminStats: () => request<{ success: boolean; stats: any; recentUsers: any[]; recentProjects: any[]; recentPayments: any[] }>('/admin/stats'),
  toggleUserStatus: (id: string) => request<{ success: boolean; user: any }>(`/admin/users/${id}/status`, { method: 'PATCH' }),
};
