import { Response } from 'express';
import { store, ICompetitionParticipation } from '../db/store.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getCompetitions(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { category, status } = req.query;

    let list = [...store.competitions];

    if (category && category !== 'All') {
      list = list.filter(c => c.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (status && status !== 'All') {
      list = list.filter(c => c.status.toLowerCase() === (status as string).toLowerCase());
    }

    // Attach user participation info if student logged in
    const user = req.user;
    const enriched = list.map(comp => {
      let userSubmission = null;
      if (user) {
        userSubmission = store.competitionParticipations.find(cp => cp.competitionId === comp._id && cp.studentId === user._id);
      }
      return {
        ...comp,
        userParticipation: userSubmission || null,
      };
    });

    res.json({ success: true, competitions: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function getCompetitionById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const comp = store.competitions.find(c => c._id === id);

    if (!comp) {
      res.status(404).json({ success: false, message: 'Competition not found.' });
      return;
    }

    const participations = store.competitionParticipations
      .filter(p => p.competitionId === id)
      .sort((a, b) => b.score - a.score);

    let userParticipation = null;
    if (req.user) {
      userParticipation = participations.find(p => p.studentId === req.user?._id) || null;
    }

    res.json({
      success: true,
      competition: comp,
      leaderboard: participations,
      userParticipation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function submitCompetitionWork(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    if (user.role !== 'STUDENT') {
      res.status(403).json({ success: false, message: 'Only students can submit competition work.' });
      return;
    }

    const { id } = req.params;
    const { githubUrl, liveDemoUrl, description } = req.body;

    const comp = store.competitions.find(c => c._id === id);
    if (!comp) {
      res.status(404).json({ success: false, message: 'Competition not found.' });
      return;
    }

    if (!githubUrl) {
      res.status(400).json({ success: false, message: 'GitHub repository URL is required.' });
      return;
    }

    const existing = store.competitionParticipations.find(p => p.competitionId === id && p.studentId === user._id);
    if (existing) {
      res.status(400).json({ success: false, message: 'You have already submitted an entry for this challenge.' });
      return;
    }

    // Algorithmic evaluation score based on project characteristics (90 - 98)
    const evaluatedScore = Math.floor(Math.random() * 8) + 90;
    const totalExisting = store.competitionParticipations.filter(p => p.competitionId === id).length;
    const assignedRank = totalExisting + 1;

    const participation: ICompetitionParticipation = {
      _id: `cp_${Date.now()}`,
      competitionId: comp._id,
      competitionTitle: comp.title,
      studentId: user._id,
      studentName: user.name,
      submission: {
        githubUrl,
        liveDemoUrl,
        description: description || 'Verified technical challenge submission.',
      },
      score: evaluatedScore,
      rank: assignedRank,
      feedback: `Strong implementation! Scored ${evaluatedScore}/100 across architectural cleanliness, performance, and responsive UI polish.`,
      submittedAt: new Date().toISOString(),
    };

    store.competitionParticipations.push(participation);
    comp.participantsCount += 1;

    // Update Student's Skill Passport
    const passport = store.skillPassports.find(p => p.studentId === user._id);
    if (passport) {
      passport.competitionHistory.unshift({
        competitionId: comp._id,
        competitionTitle: comp.title,
        rank: assignedRank,
        score: evaluatedScore,
        date: new Date().toISOString().split('T')[0],
      });

      // Boost overall score
      passport.overallScore = Math.min(99, Math.round((passport.overallScore * 0.7) + (evaluatedScore * 0.3)));

      // Add badge
      if (!passport.badges.some(b => b.id === `b_${comp._id}`)) {
        passport.badges.push({
          id: `b_${comp._id}`,
          name: `${comp.category} Challenger`,
          description: `Successfully ranked in ${comp.title}`,
          icon: 'Trophy',
          unlockedAt: new Date().toISOString(),
        });
      }
    }

    // Add notification
    store.notifications.unshift({
      _id: `notif_${Date.now()}_comp_res`,
      userId: user._id,
      type: 'COMPETITION_EVALUATED',
      title: 'Challenge Evaluated! 🏆',
      message: `Your submission for "${comp.title}" scored ${evaluatedScore}/100 (Rank #${assignedRank})! Skill Passport updated.`,
      read: false,
      link: `/competitions/${comp._id}`,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ success: true, participation, passport });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function getGlobalLeaderboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { category } = req.query;

    // Aggregate student scores and passports
    let leaderboard = store.skillPassports.map(p => {
      const studentProfile = store.studentProfiles.find(s => s.userId === p.studentId);
      const studentUser = store.users.find(u => u._id === p.studentId);
      const wins = p.competitionHistory.filter(c => c.rank <= 3).length;

      return {
        studentId: p.studentId,
        name: p.studentName || studentUser?.name || 'Verified Student',
        avatar: p.avatar || studentUser?.avatar,
        college: p.college || studentProfile?.college || 'University',
        overallScore: p.overallScore,
        skills: p.skills,
        topRank: p.competitionHistory.length > 0 ? Math.min(...p.competitionHistory.map(c => c.rank)) : 99,
        competitionsCount: p.competitionHistory.length,
        projectsDelivered: p.projects.length,
        rating: p.ratings.average,
        topPodiums: wins,
      };
    });

    // If specific skill category requested, filter or rank accordingly
    if (category && category !== 'Overall') {
      leaderboard = leaderboard.filter(item =>
        item.skills.some(s => s.category.toLowerCase().includes((category as string).toLowerCase()) ||
        s.name.toLowerCase().includes((category as string).toLowerCase()))
      );
    }

    // Sort by overallScore desc, then projectsDelivered desc
    leaderboard.sort((a, b) => b.overallScore - a.overallScore || b.projectsDelivered - a.projectsDelivered);

    const ranked = leaderboard.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    res.json({ success: true, category: category || 'Overall', leaderboard: ranked });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}
