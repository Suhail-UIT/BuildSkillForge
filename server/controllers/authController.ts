import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { store, IUser, IStudentProfile, IBusinessProfile, ISkillPassport } from '../db/store.js';
import { generateToken, AuthRequest } from '../middleware/auth.js';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role, college, degree, graduationYear, businessName, businessType, location } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ success: false, message: 'Name, email, password, and role are required.' });
      return;
    }

    if (!['STUDENT', 'BUSINESS'].includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role specified.' });
      return;
    }

    const existingUser = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `usr_${role.toLowerCase()}_${Date.now()}`;
    const now = new Date().toISOString();

    const newUser: IUser = {
      _id: userId,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      status: 'ACTIVE',
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    };

    store.users.push(newUser);

    if (role === 'STUDENT') {
      const studentProfile: IStudentProfile = {
        _id: `sp_${Date.now()}`,
        userId,
        college: college || 'College / University',
        degree: degree || 'B.Tech / Degree',
        graduationYear: Number(graduationYear) || 2026,
        bio: 'Aspiring builder eager to solve real-world problems for local businesses.',
        skills: ['React', 'JavaScript', 'HTML/CSS'],
        skillScores: { 'React': 75, 'JavaScript': 70 },
        portfolio: [],
        availability: 'PART_TIME',
        location: location || 'India',
      };
      store.studentProfiles.push(studentProfile);

      const skillPassport: ISkillPassport = {
        _id: `pass_${Date.now()}`,
        studentId: userId,
        studentName: name,
        avatar: newUser.avatar,
        college: studentProfile.college,
        overallScore: 72,
        skills: [
          { name: 'Frontend Basics', score: 75, verifiedProjectsCount: 0, category: 'Frontend' },
          { name: 'JavaScript & Logic', score: 70, verifiedProjectsCount: 0, category: 'Core' },
        ],
        competitionHistory: [],
        projects: [],
        badges: [
          {
            id: 'b_newbie',
            name: 'New Builder',
            description: 'Joined BuildSkillForge talent network',
            icon: 'Sparkles',
            unlockedAt: now,
          }
        ],
        ratings: {
          average: 5.0,
          communication: 5.0,
          quality: 5.0,
          delivery: 5.0,
          professionalism: 5.0,
          problemSolving: 5.0,
          reviewCount: 0,
        },
        workHistory: [],
      };
      store.skillPassports.push(skillPassport);
    } else {
      const businessProfile: IBusinessProfile = {
        _id: `bp_${Date.now()}`,
        userId,
        businessName: businessName || name,
        businessType: businessType || 'Local Enterprise',
        description: 'Local business seeking verified college student talent for tech upgrades.',
        logo: newUser.avatar,
        location: location || 'India',
        website: '',
        verificationStatus: 'PENDING',
      };
      store.businessProfiles.push(businessProfile);
    }

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function demoLogin(req: Request, res: Response): Promise<void> {
  try {
    const { demoKey } = req.body;
    let targetUser: IUser | undefined;

    if (demoKey === 'student_aarav') {
      targetUser = store.users.find(u => u._id === 'usr_student_aarav');
    } else if (demoKey === 'student_priya') {
      targetUser = store.users.find(u => u._id === 'usr_student_priya');
    } else if (demoKey === 'business_cafe') {
      targetUser = store.users.find(u => u._id === 'usr_biz_cafe');
    } else if (demoKey === 'business_gym') {
      targetUser = store.users.find(u => u._id === 'usr_biz_gym');
    } else if (demoKey === 'admin') {
      targetUser = store.users.find(u => u._id === 'usr_admin');
    }

    if (!targetUser) {
      res.status(400).json({ success: false, message: 'Unknown demo profile.' });
      return;
    }

    const token = generateToken(targetUser);
    res.json({
      success: true,
      token,
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        avatar: targetUser.avatar,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    let profileData: any = null;

    if (user.role === 'STUDENT') {
      const studentProfile = store.studentProfiles.find(sp => sp.userId === user._id);
      const passport = store.skillPassports.find(p => p.studentId === user._id);
      profileData = { studentProfile, skillPassport: passport };
    } else if (user.role === 'BUSINESS') {
      const businessProfile = store.businessProfiles.find(bp => bp.userId === user._id);
      profileData = { businessProfile };
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        status: user.status,
      },
      ...profileData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}
