import { Response } from 'express';
import { store } from '../db/store.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getSkillPassport(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { studentId } = req.params;
    const passport = store.skillPassports.find(p => p.studentId === studentId);

    if (!passport) {
      res.status(404).json({ success: false, message: 'Skill Passport not found for this student.' });
      return;
    }

    const studentProfile = store.studentProfiles.find(s => s.userId === studentId);
    const studentUser = store.users.find(u => u._id === studentId);
    const completedReviews = store.reviews.filter(r => r.revieweeId === studentId);

    res.json({
      success: true,
      passport: {
        ...passport,
        bio: studentProfile?.bio,
        portfolio: studentProfile?.portfolio,
        resumeUrl: studentProfile?.resumeUrl,
        availability: studentProfile?.availability,
        location: studentProfile?.location,
        degree: studentProfile?.degree,
        graduationYear: studentProfile?.graduationYear,
        recentReviews: completedReviews,
        userEmail: studentUser?.email,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function searchTalent(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { skill, college, minScore, query } = req.query;

    let talentList = store.studentProfiles.map(sp => {
      const user = store.users.find(u => u._id === sp.userId);
      const passport = store.skillPassports.find(p => p.studentId === sp.userId);
      return {
        userId: sp.userId,
        name: user?.name || 'Verified Student',
        avatar: user?.avatar,
        college: sp.college,
        degree: sp.degree,
        graduationYear: sp.graduationYear,
        bio: sp.bio,
        skills: sp.skills,
        skillScores: sp.skillScores,
        availability: sp.availability,
        location: sp.location,
        portfolio: sp.portfolio,
        overallScore: passport?.overallScore || 70,
        ratings: passport?.ratings,
        projectsDelivered: passport?.projects.length || 0,
        badges: passport?.badges || [],
      };
    });

    if (query) {
      const q = (query as string).toLowerCase();
      talentList = talentList.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.college.toLowerCase().includes(q) ||
        t.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (skill && skill !== 'All') {
      talentList = talentList.filter(t => t.skills.some(s => s.toLowerCase() === (skill as string).toLowerCase()));
    }

    if (minScore) {
      talentList = talentList.filter(t => t.overallScore >= Number(minScore));
    }

    // Sort by overallScore descending
    talentList.sort((a, b) => b.overallScore - a.overallScore);

    res.json({ success: true, count: talentList.length, talent: talentList });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function updateStudentProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    if (user.role !== 'STUDENT') {
      res.status(403).json({ success: false, message: 'Only students can edit this profile.' });
      return;
    }

    const { college, degree, graduationYear, bio, skills, portfolio, resumeUrl, availability, location } = req.body;

    let profile = store.studentProfiles.find(s => s.userId === user._id);
    if (!profile) {
      profile = {
        _id: `sp_${Date.now()}`,
        userId: user._id,
        college: college || '',
        degree: degree || '',
        graduationYear: Number(graduationYear) || 2026,
        bio: bio || '',
        skills: Array.isArray(skills) ? skills : [],
        skillScores: {},
        portfolio: Array.isArray(portfolio) ? portfolio : [],
        resumeUrl,
        availability: availability || 'PART_TIME',
        location: location || '',
      };
      store.studentProfiles.push(profile);
    } else {
      if (college) profile.college = college;
      if (degree) profile.degree = degree;
      if (graduationYear) profile.graduationYear = Number(graduationYear);
      if (bio !== undefined) profile.bio = bio;
      if (skills) profile.skills = skills;
      if (portfolio) profile.portfolio = portfolio;
      if (resumeUrl !== undefined) profile.resumeUrl = resumeUrl;
      if (availability) profile.availability = availability;
      if (location !== undefined) profile.location = location;
    }

    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}
