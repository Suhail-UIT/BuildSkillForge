import bcrypt from 'bcryptjs';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'STUDENT' | 'BUSINESS' | 'ADMIN';
  avatar: string;
  phone?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IStudentProfile {
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

export interface IBusinessProfile {
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

export interface ISkillPassport {
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
}

export interface IMilestone {
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

export interface IWorkspaceMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'STUDENT' | 'BUSINESS' | 'ADMIN';
  message: string;
  timestamp: string;
}

export interface IProject {
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
  milestones: IMilestone[];
  messages: IWorkspaceMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface IApplication {
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
}

export interface ICompetition {
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
}

export interface ICompetitionParticipation {
  _id: string;
  competitionId: string;
  competitionTitle: string;
  studentId: string;
  studentName: string;
  submission: {
    githubUrl: string;
    liveDemoUrl?: string;
    description: string;
  };
  score: number;
  rank: number;
  feedback: string;
  submittedAt: string;
}

export interface IReview {
  _id: string;
  projectId: string;
  projectTitle: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  rating: number;
  communication: number;
  quality: number;
  delivery: number;
  professionalism: number;
  problemSolving: number;
  comment: string;
  createdAt: string;
}

export interface IPayment {
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

export interface INotification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface ISupportTicket {
  _id: string;
  userId: string;
  userName: string;
  userRole: string;
  category: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'Open' | 'In Progress' | 'Waiting for User' | 'Resolved' | 'Closed';
  adminResponse?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

class Store {
  users: IUser[] = [];
  studentProfiles: IStudentProfile[] = [];
  businessProfiles: IBusinessProfile[] = [];
  skillPassports: ISkillPassport[] = [];
  projects: IProject[] = [];
  applications: IApplication[] = [];
  competitions: ICompetition[] = [];
  competitionParticipations: ICompetitionParticipation[] = [];
  reviews: IReview[] = [];
  payments: IPayment[] = [];
  notifications: INotification[] = [];
  supportTickets: ISupportTicket[] = [];

  constructor() {
    this.seed();
  }

  seed() {
    const passwordHash = bcrypt.hashSync('demo1234', 10);
    const now = new Date().toISOString();

    // 1. Users
    this.users = [
      {
        _id: 'usr_student_aarav',
        name: 'Aarav Sharma',
        email: 'aarav@student.buildskillforge.com',
        passwordHash,
        role: 'STUDENT',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
        phone: '+91 98765 43210',
        status: 'ACTIVE',
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        _id: 'usr_student_priya',
        name: 'Priya Patel',
        email: 'priya@student.buildskillforge.com',
        passwordHash,
        role: 'STUDENT',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        phone: '+91 98765 43211',
        status: 'ACTIVE',
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        _id: 'usr_student_rohan',
        name: 'Rohan Verma',
        email: 'rohan@student.buildskillforge.com',
        passwordHash,
        role: 'STUDENT',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        phone: '+91 98765 43212',
        status: 'ACTIVE',
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        _id: 'usr_biz_cafe',
        name: 'Rajesh Gupta',
        email: 'rajesh@beanbrewcafe.in',
        passwordHash,
        role: 'BUSINESS',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
        phone: '+91 91234 56780',
        status: 'ACTIVE',
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        _id: 'usr_biz_gym',
        name: 'Vikram Malhotra',
        email: 'vikram@urbanfitgym.in',
        passwordHash,
        role: 'BUSINESS',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
        phone: '+91 91234 56781',
        status: 'ACTIVE',
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        _id: 'usr_admin',
        name: 'Admin Forge',
        email: 'admin@buildskillforge.com',
        passwordHash,
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
        phone: '+91 80000 12345',
        status: 'ACTIVE',
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      }
    ];

    // 2. Student Profiles
    this.studentProfiles = [
      {
        _id: 'sp_aarav',
        userId: 'usr_student_aarav',
        college: 'Indian Institute of Technology, Delhi',
        degree: 'B.Tech in Computer Science',
        graduationYear: 2026,
        bio: 'Full-stack developer with deep passion for building high-performance React applications, cloud backends, and local business digital tooling.',
        skills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Next.js'],
        skillScores: {
          'React': 94,
          'TypeScript': 91,
          'Node.js': 88,
          'Database Design': 85,
          'UI/UX Architecture': 89,
        },
        portfolio: [
          { title: 'ArtisanCraft - Local Pottery E-Commerce', url: 'https://github.com/aarav/artisancraft', description: 'Real-time ordering and inventory sync for artisanal potters.' },
          { title: 'CampusRide - Peer Pooling Network', url: 'https://github.com/aarav/campusride', description: 'Verified college campus carpooling app.' }
        ],
        resumeUrl: 'https://buildskillforge.com/resumes/aarav-sharma.pdf',
        availability: 'PART_TIME',
        location: 'New Delhi, India',
      },
      {
        _id: 'sp_priya',
        userId: 'usr_student_priya',
        college: 'Vellore Institute of Technology (VIT)',
        degree: 'B.Tech in Information Technology',
        graduationYear: 2026,
        bio: 'AI/ML Enthusiast and Python specialist. Certified TensorFlow developer building computer vision & NLP solutions for small businesses.',
        skills: ['Python', 'FastAPI', 'PyTorch', 'Gemini API', 'React', 'PostgreSQL'],
        skillScores: {
          'Python': 96,
          'Machine Learning': 92,
          'FastAPI': 89,
          'Data Analysis': 91,
        },
        portfolio: [
          { title: 'RetailVision - Shelf Stock AI', url: 'https://github.com/priya/retail-vision', description: 'YOLOv8 based stockout detector for grocery stores.' }
        ],
        resumeUrl: 'https://buildskillforge.com/resumes/priya-patel.pdf',
        availability: 'PART_TIME',
        location: 'Bengaluru, India',
      },
      {
        _id: 'sp_rohan',
        userId: 'usr_student_rohan',
        college: 'BITS Pilani',
        degree: 'B.E. in Computer Science',
        graduationYear: 2027,
        bio: 'Cybersecurity researcher & Backend engineer. Passionate about API security, rate limiting, OAuth 2.0, and cloud infrastructure.',
        skills: ['Go', 'Node.js', 'Docker', 'PostgreSQL', 'Kubernetes', 'Cybersecurity'],
        skillScores: {
          'Backend Security': 95,
          'Docker & DevOps': 90,
          'Node.js': 87,
        },
        portfolio: [
          { title: 'AuthShield - Zero-Trust Gateway', url: 'https://github.com/rohan/auth-shield', description: 'Lightweight reverse proxy with automated token rotation.' }
        ],
        availability: 'WEEKENDS',
        location: 'Hyderabad, India',
      }
    ];

    // 3. Business Profiles
    this.businessProfiles = [
      {
        _id: 'bp_cafe',
        userId: 'usr_biz_cafe',
        businessName: 'Bean & Brew Café',
        businessType: 'Food & Beverage',
        description: 'Specialty coffee roastery and café chain across Indiranagar & Koramangala with over 1,200 daily visitors.',
        logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=256&q=80',
        location: 'Bengaluru, Karnataka',
        website: 'https://beanandbrew.in',
        verificationStatus: 'VERIFIED',
      },
      {
        _id: 'bp_gym',
        userId: 'usr_biz_gym',
        businessName: 'UrbanFit Gym',
        businessType: 'Fitness & Wellness',
        description: 'Premium boutique fitness studio offering functional training, strength equipment, and yoga batches for 850 active members.',
        logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=256&q=80',
        location: 'South Mumbai, Maharashtra',
        website: 'https://urbanfitgym.in',
        verificationStatus: 'VERIFIED',
      }
    ];

    // 4. Skill Passports
    this.skillPassports = [
      {
        _id: 'pass_aarav',
        studentId: 'usr_student_aarav',
        studentName: 'Aarav Sharma',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
        college: 'IIT Delhi',
        overallScore: 92,
        skills: [
          { name: 'React & Frontend', score: 94, verifiedProjectsCount: 3, category: 'Frontend' },
          { name: 'Node.js & APIs', score: 89, verifiedProjectsCount: 2, category: 'Backend' },
          { name: 'Database Architecture', score: 86, verifiedProjectsCount: 2, category: 'Database' },
          { name: 'UI/UX Polish', score: 90, verifiedProjectsCount: 3, category: 'Design' },
          { name: 'System Performance', score: 92, verifiedProjectsCount: 1, category: 'Architecture' }
        ],
        competitionHistory: [
          {
            competitionId: 'comp_hack_01',
            competitionTitle: 'National Full-Stack Hackathon 2026',
            rank: 2,
            score: 96,
            date: '2026-03-15',
          },
          {
            competitionId: 'comp_ui_02',
            competitionTitle: 'FinTech Micro-Frontend Challenge',
            rank: 4,
            score: 88,
            date: '2026-01-20',
          }
        ],
        projects: [
          {
            projectId: 'proj_cafe_loyalty',
            title: 'QR Loyalty & Stamp Card Web App',
            clientName: 'Bean & Brew Café',
            rating: 5,
            completedAt: '2026-02-28',
            skillsUsed: ['React', 'TypeScript', 'Node.js', 'QR Code SDK']
          }
        ],
        badges: [
          {
            id: 'b_top_performer',
            name: 'Top 5% Performer',
            description: 'Ranked in top 5% among 20,000+ verified college developers',
            icon: 'Award',
            unlockedAt: '2026-03-16'
          },
          {
            id: 'b_verified_builder',
            name: 'Verified Project Finisher',
            description: 'Successfully delivered real business projects on-budget and on-time',
            icon: 'CheckCircle',
            unlockedAt: '2026-02-28'
          },
          {
            id: 'b_client_favorite',
            name: 'Client Favorite',
            description: 'Maintained 4.9+ star client rating across verified contracts',
            icon: 'Star',
            unlockedAt: '2026-02-28'
          }
        ],
        ratings: {
          average: 4.9,
          communication: 5.0,
          quality: 4.9,
          delivery: 5.0,
          professionalism: 4.9,
          problemSolving: 4.8,
          reviewCount: 3,
        },
        workHistory: [
          {
            role: 'Lead Digital Contractor',
            company: 'Bean & Brew Café',
            period: 'Jan 2026 - Feb 2026',
            description: 'Built contactless loyalty card app with zero hardware overhead.'
          }
        ]
      },
      {
        _id: 'pass_priya',
        studentId: 'usr_student_priya',
        studentName: 'Priya Patel',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        college: 'VIT Vellore',
        overallScore: 94,
        skills: [
          { name: 'Python & AI Engineering', score: 96, verifiedProjectsCount: 2, category: 'AI' },
          { name: 'FastAPI Backend', score: 91, verifiedProjectsCount: 2, category: 'Backend' },
          { name: 'Data Pipelines', score: 88, verifiedProjectsCount: 1, category: 'Data' },
        ],
        competitionHistory: [
          {
            competitionId: 'comp_ai_01',
            competitionTitle: 'Local Commerce AI Grand Prix',
            rank: 1,
            score: 98,
            date: '2026-02-10'
          }
        ],
        projects: [],
        badges: [
          {
            id: 'b_champion',
            name: 'Grand Prix Champion',
            description: '1st Place in National AI Commerce Challenge',
            icon: 'Trophy',
            unlockedAt: '2026-02-10'
          }
        ],
        ratings: {
          average: 5.0,
          communication: 5.0,
          quality: 5.0,
          delivery: 5.0,
          professionalism: 5.0,
          problemSolving: 5.0,
          reviewCount: 1,
        },
        workHistory: []
      }
    ];

    // 5. Projects
    this.projects = [
      {
        _id: 'proj_cafe_pos',
        businessId: 'usr_biz_cafe',
        businessName: 'Bean & Brew Café',
        businessLogo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=256&q=80',
        title: 'Modern POS & Digital Loyalty Web App',
        description: 'We run 2 bustling café outlets in Bengaluru and need a fast, tablet-optimized counter POS system with customer loyalty points and WhatsApp receipt generation. Must have an intuitive UI that our baristas can learn in 5 minutes.',
        category: 'Full Stack',
        requiredSkills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Express'],
        budget: 15000,
        platformFee: 1500,
        studentAmount: 13500,
        deadline: '2026-10-25',
        location: 'Bengaluru (Hybrid)',
        projectType: 'HYBRID',
        status: 'ACTIVE',
        selectedStudentId: 'usr_student_aarav',
        selectedStudentName: 'Aarav Sharma',
        milestones: [
          {
            id: 'ms_cafe_1',
            title: 'UI Prototype & Tablet Layout Design',
            description: 'Design responsive tablet interface with quick-tap menu catalog, modifiers, and cart state management.',
            amount: 4500,
            deadline: '2026-10-05',
            status: 'APPROVED',
            submissionNotes: 'Completed Figma design and implemented responsive React components with dark/light mode.',
            deliverableUrl: 'https://github.com/aarav/bean-brew-pos/tree/milestone-1',
            submittedAt: '2026-09-24T18:00:00Z',
            reviewedAt: '2026-09-25T10:00:00Z',
            feedback: 'Outstanding layout! Extremely clean and responsive on our iPad test.'
          },
          {
            id: 'ms_cafe_2',
            title: 'Loyalty Points Engine & WhatsApp Receipt Generator',
            description: 'Connect customer phone lookup, points accrual (10 pts per ₹100), and PDF/WhatsApp receipt dispatch.',
            amount: 5500,
            deadline: '2026-10-15',
            status: 'IN_PROGRESS'
          },
          {
            id: 'ms_cafe_3',
            title: 'Manager Analytics Dashboard & Final Handover',
            description: 'Daily revenue reports, top-selling blend telemetry, role authentication, and staff training walk-through.',
            amount: 3500,
            deadline: '2026-10-25',
            status: 'PENDING'
          }
        ],
        messages: [
          {
            id: 'msg_1',
            senderId: 'usr_biz_cafe',
            senderName: 'Rajesh Gupta (Bean & Brew)',
            senderRole: 'BUSINESS',
            message: 'Hi Aarav! Milestone 1 was approved. The touch targets feel very natural on our counter iPad. Excited for Milestone 2!',
            timestamp: '2026-09-25T10:15:00Z'
          },
          {
            id: 'msg_2',
            senderId: 'usr_student_aarav',
            senderName: 'Aarav Sharma',
            senderRole: 'STUDENT',
            message: 'Thank you Rajesh! Working on the loyalty points accumulator logic right now. Will share the preview link by Thursday.',
            timestamp: '2026-09-25T11:00:00Z'
          }
        ],
        createdAt: '2026-09-20T12:00:00Z',
        updatedAt: now,
      },
      {
        _id: 'proj_gym_portal',
        businessId: 'usr_biz_gym',
        businessName: 'UrbanFit Gym',
        businessLogo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=256&q=80',
        title: 'Member Workout & Slot Booking Web Portal',
        description: 'UrbanFit Gym needs a modern progressive web app where members can reserve trainer slots, track body metrics, check gym occupancy in real-time, and renew memberships seamlessly.',
        category: 'Web App',
        requiredSkills: ['React', 'Node.js', 'PostgreSQL or MongoDB', 'Tailwind CSS'],
        budget: 20000,
        platformFee: 2000,
        studentAmount: 18000,
        deadline: '2026-11-10',
        location: 'Mumbai (Remote)',
        projectType: 'REMOTE',
        status: 'OPEN',
        milestones: [
          {
            id: 'ms_gym_1',
            title: 'Member Auth & Profile Management',
            description: 'Role-based login for members & trainers, metric history, profile updates.',
            amount: 6000,
            deadline: '2026-10-18',
            status: 'PENDING'
          },
          {
            id: 'ms_gym_2',
            title: 'Slot Scheduling Engine',
            description: 'Capacity-limited slot booking with live waitlists and automated cancellation windows.',
            amount: 8000,
            deadline: '2026-10-30',
            status: 'PENDING'
          },
          {
            id: 'ms_gym_3',
            title: 'Membership Renewal & Trainer Reviews',
            description: 'Integrated renewal reminder flow and trainer ratings.',
            amount: 4000,
            deadline: '2026-11-10',
            status: 'PENDING'
          }
        ],
        messages: [],
        createdAt: '2026-09-22T09:30:00Z',
        updatedAt: now,
      },
      {
        _id: 'proj_glow_salon',
        businessId: 'usr_biz_salon',
        businessName: 'Glow Salon',
        businessLogo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=256&q=80',
        title: 'Online Appointment Booking & Stylist Scheduling System',
        description: 'Luxury salon in Bandra seeking an elegant booking experience for hair, skincare, and bridal services. Must let clients pick their favorite stylist and time slot.',
        category: 'UI/UX & Web',
        requiredSkills: ['React', 'Framer Motion', 'Tailwind CSS', 'Node.js'],
        budget: 18000,
        platformFee: 1800,
        studentAmount: 16200,
        deadline: '2026-11-05',
        location: 'Mumbai (Hybrid)',
        projectType: 'HYBRID',
        status: 'OPEN',
        milestones: [
          {
            id: 'ms_glow_1',
            title: 'Visual Service Catalog & Stylist Portfolio',
            description: 'High-end service selection with pricing tiers and stylist showcase.',
            amount: 6000,
            deadline: '2026-10-15',
            status: 'PENDING'
          },
          {
            id: 'ms_glow_2',
            title: 'Real-time Calendar Booking Flow',
            description: 'Conflict-free slot booking with SMS confirmation simulation.',
            amount: 7000,
            deadline: '2026-10-28',
            status: 'PENDING'
          },
          {
            id: 'ms_glow_3',
            title: 'Admin Appointment Management Console',
            description: 'Stylist shift scheduling and customer booking status toggles.',
            amount: 3200,
            deadline: '2026-11-05',
            status: 'PENDING'
          }
        ],
        messages: [],
        createdAt: '2026-09-23T14:15:00Z',
        updatedAt: now,
      },
      {
        _id: 'proj_brightpath',
        businessId: 'usr_biz_coaching',
        businessName: 'BrightPath Coaching',
        businessLogo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=256&q=80',
        title: 'Student Quiz Portal & Doubt Clearing Forum',
        description: 'Competitive entrance coaching institute with 500+ JEE/NEET aspirants. Needs an interactive timed test portal with instant score analytics and doubt discussion threads.',
        category: 'Full Stack',
        requiredSkills: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS'],
        budget: 25000,
        platformFee: 2500,
        studentAmount: 22500,
        deadline: '2026-11-20',
        location: 'Kota / Pune (Remote)',
        projectType: 'REMOTE',
        status: 'OPEN',
        milestones: [
          {
            id: 'ms_bp_1',
            title: 'Interactive Test Engine with Timer',
            description: 'MCQ interface with mark for review, question palette, and anti-tab switch detection.',
            amount: 9000,
            deadline: '2026-10-25',
            status: 'PENDING'
          },
          {
            id: 'ms_bp_2',
            title: 'Detailed Performance Analytics & Rank Calculation',
            description: 'Subject-wise breakdown, percentile ranking, and weak area indicators.',
            amount: 8000,
            deadline: '2026-11-08',
            status: 'PENDING'
          },
          {
            id: 'ms_bp_3',
            title: 'Student-Teacher Doubt Resolution Forum',
            description: 'Markdown question posting with image uploads and faculty reply badges.',
            amount: 5500,
            deadline: '2026-11-20',
            status: 'PENDING'
          }
        ],
        messages: [],
        createdAt: '2026-09-24T10:00:00Z',
        updatedAt: now,
      },
      {
        _id: 'proj_spiceroute',
        businessId: 'usr_biz_spiceroute',
        businessName: 'SpiceRoute Restaurant',
        businessLogo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=256&q=80',
        title: 'Digital QR Table Ordering & Kitchen Display System',
        description: 'Award-winning heritage restaurant wants a digital dining experience where guests scan table QR codes to browse multilingual menus, place orders directly to the kitchen display screen, and split bills.',
        category: 'Full Stack & Mobile',
        requiredSkills: ['React', 'Node.js', 'WebSockets / Realtime', 'Tailwind CSS'],
        budget: 22000,
        platformFee: 2200,
        studentAmount: 19800,
        deadline: '2026-11-15',
        location: 'Jaipur (Remote)',
        projectType: 'REMOTE',
        status: 'OPEN',
        milestones: [
          {
            id: 'ms_sr_1',
            title: 'Guest QR Menu & Cart Ordering Flow',
            description: 'Fast mobile-first web app with spice-level selectors and dietary tags.',
            amount: 8000,
            deadline: '2026-10-20',
            status: 'PENDING'
          },
          {
            id: 'ms_sr_2',
            title: 'Kitchen Display System (KDS)',
            description: 'Chef station screen with real-time order queue, order status toggles (Preparing, Ready, Served).',
            amount: 7000,
            deadline: '2026-11-02',
            status: 'PENDING'
          },
          {
            id: 'ms_sr_3',
            title: 'Split Bill Calculator & Feedback Capture',
            description: 'Automatic GST breakdown, split payment calculation, and Google review prompt.',
            amount: 4800,
            deadline: '2026-11-15',
            status: 'PENDING'
          }
        ],
        messages: [],
        createdAt: '2026-09-25T08:00:00Z',
        updatedAt: now,
      }
    ];

    // 6. Applications
    this.applications = [
      {
        _id: 'app_1',
        projectId: 'proj_cafe_pos',
        projectTitle: 'Modern POS & Digital Loyalty Web App',
        businessId: 'usr_biz_cafe',
        businessName: 'Bean & Brew Café',
        studentId: 'usr_student_aarav',
        studentName: 'Aarav Sharma',
        studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
        studentCollege: 'IIT Delhi',
        studentOverallScore: 92,
        proposal: 'I have previously created retail ordering apps and understand high-volume counter workflows. I will deliver a lightweight React tablet app with offline-resilient local state and automated WhatsApp notifications.',
        expectedCompletion: '2026-10-25',
        status: 'ACCEPTED',
        createdAt: '2026-09-20T14:00:00Z'
      },
      {
        _id: 'app_2',
        projectId: 'proj_gym_portal',
        projectTitle: 'Member Workout & Slot Booking Web Portal',
        businessId: 'usr_biz_gym',
        businessName: 'UrbanFit Gym',
        studentId: 'usr_student_aarav',
        studentName: 'Aarav Sharma',
        studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
        studentCollege: 'IIT Delhi',
        studentOverallScore: 92,
        proposal: 'I have designed booking interfaces with capacity checks. I will build an intuitive calendar slot selector that syncs with Google Calendar and sends push reminders.',
        expectedCompletion: '2026-11-05',
        status: 'PENDING',
        createdAt: '2026-09-23T11:00:00Z'
      },
      {
        _id: 'app_3',
        projectId: 'proj_gym_portal',
        projectTitle: 'Member Workout & Slot Booking Web Portal',
        businessId: 'usr_biz_gym',
        businessName: 'UrbanFit Gym',
        studentId: 'usr_student_priya',
        studentName: 'Priya Patel',
        studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        studentCollege: 'VIT Vellore',
        studentOverallScore: 94,
        proposal: 'In addition to slot booking, I can integrate an AI workout recommendation engine that generates personalized routine suggestions based on user fitness goals.',
        expectedCompletion: '2026-11-10',
        status: 'PENDING',
        createdAt: '2026-09-24T09:00:00Z'
      }
    ];

    // 7. Competitions
    this.competitions = [
      {
        _id: 'comp_1',
        title: 'Full-Stack E-Commerce Engine for Local Artisans',
        category: 'Full Stack',
        difficulty: 'INTERMEDIATE',
        description: 'Design and build a responsive web marketplace empowering local village artisans to catalog handcrafted goods, accept payments, and manage shipping without technical hurdles.',
        rules: [
          'Must be built using React / Next.js with any Node/Express or serverless backend',
          'Demonstrate zero-friction checkout flow with discount coupon support',
          'Provide clean modular architecture and unit/integration tests',
          'Public GitHub repository with documentation and live deployed link required'
        ],
        duration: '7 Days',
        deadline: '2026-10-15',
        prize: '₹25,000 + Top Skill Passport Verified Badge + Direct Business Introductions',
        evaluationCriteria: [
          { criteria: 'Code Quality & Architecture', weight: 30 },
          { criteria: 'UI/UX Responsiveness & Polish', weight: 30 },
          { criteria: 'Performance & Edge Case Handling', weight: 25 },
          { criteria: 'Documentation & Clarity', weight: 15 }
        ],
        status: 'ACTIVE',
        participantsCount: 382
      },
      {
        _id: 'comp_2',
        title: 'AI Smart Inventory & Demand Predictor',
        category: 'AI',
        difficulty: 'ADVANCED',
        description: 'Build an AI forecasting pipeline that analyzes past sales data of small grocery retailers to recommend weekly replenishment quantities and alert for perishable waste.',
        rules: [
          'Use Gemini API, Python, or TypeScript AI pipeline',
          'Process structured CSV / JSON datasets with time-series or regression model',
          'Visual interactive dashboard showing predictions vs confidence bounds'
        ],
        duration: '10 Days',
        deadline: '2026-10-22',
        prize: '₹30,000 + Sponsored Cloud Credits + Skill Passport AI Specialist Tier 1',
        evaluationCriteria: [
          { criteria: 'Model Accuracy & Insight Depth', weight: 40 },
          { criteria: 'Actionability of Dashboard UI', weight: 30 },
          { criteria: 'System Architecture & Latency', weight: 30 }
        ],
        status: 'ACTIVE',
        participantsCount: 245
      },
      {
        _id: 'comp_3',
        title: 'Zero-Trust Secure API Gateway Challenge',
        category: 'Cybersecurity',
        difficulty: 'ADVANCED',
        description: 'Develop a high-throughput API gateway with automatic JWT rotation, rate limiting per IP/User, IP reputation check, and OWASP Top 10 mitigation filters.',
        rules: [
          'Must withstand simulated DDoS and token replay attack scripts',
          'Latency overhead under 15ms per request',
          'Comprehensive security audit report included'
        ],
        duration: '5 Days',
        deadline: '2026-11-01',
        prize: '₹20,000 + Security Lead Badge + Placement Referral',
        evaluationCriteria: [
          { criteria: 'Security Hardening', weight: 50 },
          { criteria: 'Throughput & Benchmark', weight: 30 },
          { criteria: 'Code Readability', weight: 20 }
        ],
        status: 'UPCOMING',
        participantsCount: 160
      },
      {
        _id: 'comp_4',
        title: 'Micro-Interactions & Accessible UI Challenge',
        category: 'UI/UX',
        difficulty: 'BEGINNER',
        description: 'Craft an accessible, keyboard-navigable component kit with buttery-smooth 60fps micro-animations, full WCAG AAA compliance, and sound design accents.',
        rules: [
          'HTML5 semantic elements with complete ARIA attributes',
          'WCAG AAA color contrast ratios across dark and light themes',
          'Smooth Framer Motion or CSS transforms under 16ms frame budget'
        ],
        duration: '4 Days',
        deadline: '2026-10-10',
        prize: '₹15,000 + Design Prodigy Badge',
        evaluationCriteria: [
          { criteria: 'Accessibility & Keyboard Nav', weight: 40 },
          { criteria: 'Aesthetic Execution & Motion', weight: 40 },
          { criteria: 'Component Reusability', weight: 20 }
        ],
        status: 'ACTIVE',
        participantsCount: 512
      }
    ];

    // 8. Competition Participations
    this.competitionParticipations = [
      {
        _id: 'cp_1',
        competitionId: 'comp_1',
        competitionTitle: 'Full-Stack E-Commerce Engine for Local Artisans',
        studentId: 'usr_student_aarav',
        studentName: 'Aarav Sharma',
        submission: {
          githubUrl: 'https://github.com/aarav/artisan-engine-pro',
          liveDemoUrl: 'https://artisan-engine-demo.vercel.app',
          description: 'Constructed using Vite, Tailwind, Zustand, and Express with automated image compression for low-bandwidth village networks.'
        },
        score: 95,
        rank: 2,
        feedback: 'Superb architecture. The offline optimistic cart state was specifically commendable.',
        submittedAt: '2026-03-14T20:10:00Z'
      },
      {
        _id: 'cp_2',
        competitionId: 'comp_2',
        competitionTitle: 'AI Smart Inventory & Demand Predictor',
        studentId: 'usr_student_priya',
        studentName: 'Priya Patel',
        submission: {
          githubUrl: 'https://github.com/priya/smart-inventory-gemini',
          liveDemoUrl: 'https://smart-inventory.ai-studio.app',
          description: 'Hybrid time-series forecasting + Gemini Flash reasoning for explaining demand spikes.'
        },
        score: 98,
        rank: 1,
        feedback: 'Exceptional use of Gemini reasoning to generate actionable plain-language restock warnings for shop owners.',
        submittedAt: '2026-02-09T18:00:00Z'
      }
    ];

    // 9. Reviews
    this.reviews = [
      {
        _id: 'rev_1',
        projectId: 'proj_cafe_pos',
        projectTitle: 'Modern POS & Digital Loyalty Web App',
        reviewerId: 'usr_biz_cafe',
        reviewerName: 'Rajesh Gupta (Bean & Brew Café)',
        revieweeId: 'usr_student_aarav',
        rating: 5,
        communication: 5,
        quality: 5,
        delivery: 5,
        professionalism: 5,
        problemSolving: 5,
        comment: 'Aarav is exceptional! He not only built exactly what we needed for our café counters, but he also visited in person to test how our baristas used the screen under peak rush hours. Outstanding work!',
        createdAt: '2026-09-24T12:00:00Z'
      }
    ];

    // 10. Payments
    this.payments = [
      {
        _id: 'pay_1',
        projectId: 'proj_cafe_pos',
        projectTitle: 'Modern POS & Digital Loyalty Web App',
        payerId: 'usr_biz_cafe',
        payerName: 'Bean & Brew Café',
        receiverId: 'usr_student_aarav',
        receiverName: 'Aarav Sharma',
        amount: 4500,
        platformFee: 450,
        studentAmount: 4050,
        status: 'COMPLETED',
        transactionId: 'TXN_BSF_20260924_8819',
        paymentMethod: 'UPI / NetBanking Escrow Release',
        createdAt: '2026-09-24T18:30:00Z'
      }
    ];

    // 11. Notifications
    this.notifications = [
      {
        _id: 'notif_1',
        userId: 'usr_student_aarav',
        type: 'MILESTONE_APPROVED',
        title: 'Milestone 1 Approved & Paid! 🎉',
        message: 'Bean & Brew Café approved "UI Prototype & Tablet Layout Design". ₹4,050 net credited to your account.',
        read: false,
        link: '/workspace/proj_cafe_pos',
        createdAt: '2026-09-24T18:35:00Z'
      },
      {
        _id: 'notif_2',
        userId: 'usr_biz_cafe',
        type: 'APPLICATION_RECEIVED',
        title: 'New Applicant for Coffee Loyalty System',
        message: 'Aarav Sharma (Skill Score 92) submitted a verified proposal.',
        read: true,
        link: '/business/dashboard',
        createdAt: '2026-09-20T14:05:00Z'
      }
    ];

    // 12. Support Tickets
    this.supportTickets = [
      {
        _id: 'tkt_1',
        userId: 'usr_student_priya',
        userName: 'Priya Patel',
        userRole: 'STUDENT',
        category: 'Skill Passport Verification',
        description: 'I recently completed the National AI Grand Prix with 1st rank. Can my passport badge be upgraded to AI Gold Fellow?',
        priority: 'MEDIUM',
        status: 'Resolved',
        adminResponse: 'Congratulations Priya! Your Grand Prix score was verified and the AI Gold Fellow badge has been minted to your public Skill Passport.',
        createdAt: '2026-09-21T10:00:00Z',
        updatedAt: '2026-09-21T14:30:00Z'
      }
    ];
  }
}

export const store = new Store();
