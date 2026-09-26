import mongoose, { Schema } from 'mongoose';

// User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'BUSINESS', 'ADMIN'], default: 'STUDENT' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  status: { type: String, enum: ['ACTIVE', 'PENDING', 'SUSPENDED'], default: 'ACTIVE' },
  emailVerified: { type: Boolean, default: false },
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

// StudentProfile Schema
const studentProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  college: { type: String, required: true },
  degree: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  skillScores: { type: Map, of: Number },
  portfolio: [{ title: String, url: String, description: String }],
  resumeUrl: { type: String },
  availability: { type: String, enum: ['FULL_TIME', 'PART_TIME', 'WEEKENDS'], default: 'PART_TIME' },
  location: { type: String, default: '' },
}, { timestamps: true });

export const StudentProfileModel = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema);

// BusinessProfile Schema
const businessProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  verificationStatus: { type: String, enum: ['VERIFIED', 'PENDING', 'REJECTED'], default: 'PENDING' },
}, { timestamps: true });

export const BusinessProfileModel = mongoose.models.BusinessProfile || mongoose.model('BusinessProfile', businessProfileSchema);

// SkillPassport Schema
const skillPassportSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  overallScore: { type: Number, default: 70 },
  skills: [{ name: String, score: Number, verifiedProjectsCount: Number, category: String }],
  competitionHistory: [{
    competitionId: String,
    competitionTitle: String,
    rank: Number,
    score: Number,
    date: String,
  }],
  projects: [{
    projectId: String,
    title: String,
    clientName: String,
    rating: Number,
    completedAt: String,
    skillsUsed: [String],
  }],
  badges: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    unlockedAt: String,
  }],
  ratings: {
    average: { type: Number, default: 5 },
    communication: { type: Number, default: 5 },
    quality: { type: Number, default: 5 },
    delivery: { type: Number, default: 5 },
    professionalism: { type: Number, default: 5 },
    problemSolving: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  workHistory: [{
    role: String,
    company: String,
    period: String,
    description: String,
  }],
}, { timestamps: true });

export const SkillPassportModel = mongoose.models.SkillPassport || mongoose.model('SkillPassport', skillPassportSchema);

// Project Schema
const projectSchema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  requiredSkills: [{ type: String }],
  budget: { type: Number, required: true },
  platformFee: { type: Number, required: true },
  studentAmount: { type: Number, required: true },
  deadline: { type: String, required: true },
  location: { type: String, default: 'Remote' },
  projectType: { type: String, enum: ['REMOTE', 'HYBRID', 'ONSITE'], default: 'REMOTE' },
  status: { type: String, enum: ['OPEN', 'ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'OPEN' },
  selectedStudentId: { type: Schema.Types.ObjectId, ref: 'User' },
  milestones: [{
    id: String,
    title: String,
    description: String,
    amount: Number,
    deadline: String,
    status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REVISION_REQUESTED'], default: 'PENDING' },
    submissionNotes: String,
    deliverableUrl: String,
    submittedAt: String,
    reviewedAt: String,
    feedback: String,
  }],
  messages: [{
    id: String,
    senderId: String,
    senderName: String,
    senderRole: String,
    message: String,
    timestamp: String,
  }],
}, { timestamps: true });

export const ProjectModel = mongoose.models.Project || mongoose.model('Project', projectSchema);
