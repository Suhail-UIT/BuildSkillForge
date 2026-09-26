export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'BUSINESS' | 'ADMIN';
  avatar: string;
  phone?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  emailVerified: boolean;
  createdAt: string;
}

export interface StudentProfile {
  _id: string;
  userId: string;
  college: string;
  degree: string;
  graduationYear: number;
  bio: string;
  skills: string[];
  skillScores: Record<string, number>;
  portfolio: { title: string; url: string; description: string }[];
  resumeUrl?: string;
  availability: 'FULL_TIME' | 'PART_TIME' | 'WEEKENDS';
  location: string;
}

export interface BusinessProfile {
  _id: string;
  userId: string;
  businessName: string;
  businessType: string;
  description: string;
  logo: string;
  location: string;
  website: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

export interface SkillPassport {
  _id: string;
  studentId: string;
  studentName?: string;
  avatar?: string;
  college?: string;
  overallScore: number;
  skills: { name: string; score: number; verifiedProjectsCount: number; category: string }[];
  competitionHistory: {
    competitionId: string;
    competitionTitle: string;
    rank: number;
    score: number;
    date: string;
  }[];
  projects: {
    projectId: string;
    title: string;
    clientName: string;
    rating: number;
    completedAt: string;
    skillsUsed: string[];
  }[];
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }[];
  ratings: {
    average: number;
    communication: number;
    quality: number;
    delivery: number;
    professionalism: number;
    problemSolving: number;
    reviewCount: number;
  };
  workHistory: {
    role: string;
    company: string;
    period: string;
    description: string;
  }[];
  bio?: string;
  portfolio?: { title: string; url: string; description: string }[];
  resumeUrl?: string;
  availability?: string;
  location?: string;
  degree?: string;
  graduationYear?: number;
  recentReviews?: any[];
  userEmail?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REVISION_REQUESTED';
  submissionNotes?: string;
  deliverableUrl?: string;
  submittedAt?: string;
  reviewedAt?: string;
  feedback?: string;
}

export interface WorkspaceMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'STUDENT' | 'BUSINESS' | 'ADMIN';
  message: string;
  timestamp: string;
}

export interface Project {
  _id: string;
  businessId: string;
  businessName: string;
  businessLogo: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  budget: number;
  platformFee: number;
  studentAmount: number;
  deadline: string;
  location: string;
  projectType: 'REMOTE' | 'HYBRID' | 'ONSITE';
  status: 'OPEN' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  selectedStudentId?: string;
  selectedStudentName?: string;
  milestones: Milestone[];
  messages?: WorkspaceMessage[];
  applicationsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  projectId: string;
  projectTitle: string;
  businessId: string;
  businessName: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentCollege: string;
  studentOverallScore: number;
  proposal: string;
  expectedCompletion: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  skillPassport?: SkillPassport;
  studentProfile?: StudentProfile;
}

export interface Competition {
  _id: string;
  title: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  description: string;
  rules: string[];
  duration: string;
  deadline: string;
  prize: string;
  evaluationCriteria: { criteria: string; weight: number }[];
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
  participantsCount: number;
  userParticipation?: any;
}

export interface Payment {
  _id: string;
  projectId: string;
  projectTitle: string;
  payerId: string;
  payerName: string;
  receiverId: string;
  receiverName: string;
  amount: number;
  platformFee: number;
  studentAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionId: string;
  paymentMethod: string;
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface SupportTicket {
  _id: string;
  userId: string;
  userName: string;
  userRole: string;
  category: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'Open' | 'In Progress' | 'Waiting for User' | 'Resolved' | 'Closed';
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}
