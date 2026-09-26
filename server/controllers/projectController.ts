import { Response } from 'express';
import { store, IProject, IApplication, IMilestone } from '../db/store.js';
import { AuthRequest } from '../middleware/auth.js';
import { PaymentService } from '../services/paymentService.js';

export async function getProjects(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { category, skill, minBudget, maxBudget, projectType, status, search } = req.query;

    let filtered = [...store.projects];

    if (status) {
      filtered = filtered.filter(p => p.status.toUpperCase() === (status as string).toUpperCase());
    }

    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase().includes((category as string).toLowerCase()));
    }

    if (skill && skill !== 'All') {
      filtered = filtered.filter(p => p.requiredSkills.some(s => s.toLowerCase() === (skill as string).toLowerCase()));
    }

    if (projectType && projectType !== 'All') {
      filtered = filtered.filter(p => p.projectType.toUpperCase() === (projectType as string).toUpperCase());
    }

    if (minBudget) {
      filtered = filtered.filter(p => p.budget >= Number(minBudget));
    }

    if (maxBudget) {
      filtered = filtered.filter(p => p.budget <= Number(maxBudget));
    }

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.businessName.toLowerCase().includes(q) ||
        p.requiredSkills.some(s => s.toLowerCase().includes(q))
      );
    }

    // Attach application counts for each project
    const results = filtered.map(p => {
      const appCount = store.applications.filter(a => a.projectId === p._id).length;
      return { ...p, applicationsCount: appCount };
    });

    res.json({ success: true, count: results.length, projects: results });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function getProjectById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const project = store.projects.find(p => p._id === id);

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    const business = store.businessProfiles.find(b => b.userId === project.businessId);
    const applicationsCount = store.applications.filter(a => a.projectId === project._id).length;

    let hasApplied = false;
    let userApplication = null;
    if (req.user && req.user.role === 'STUDENT') {
      userApplication = store.applications.find(a => a.projectId === project._id && a.studentId === req.user?._id);
      hasApplied = !!userApplication;
    }

    res.json({
      success: true,
      project: {
        ...project,
        applicationsCount,
        businessProfile: business,
        hasApplied,
        userApplication,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function createProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    if (user.role !== 'BUSINESS' && user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Only businesses can post projects.' });
      return;
    }

    const { title, description, category, requiredSkills, budget, deadline, location, projectType, milestones } = req.body;

    if (!title || !description || !budget || !deadline) {
      res.status(400).json({ success: false, message: 'Title, description, budget, and deadline are required.' });
      return;
    }

    const totalBudget = Number(budget);
    const { platformFee, studentAmount } = PaymentService.calculateFees(totalBudget);

    const business = store.businessProfiles.find(b => b.userId === user._id);
    const now = new Date().toISOString();

    const formattedMilestones: IMilestone[] = Array.isArray(milestones) && milestones.length > 0
      ? milestones.map((m: any, idx: number) => ({
          id: `ms_${Date.now()}_${idx}`,
          title: m.title || `Milestone ${idx + 1}`,
          description: m.description || '',
          amount: Number(m.amount) || Math.round(totalBudget / milestones.length),
          deadline: m.deadline || deadline,
          status: 'PENDING' as const,
        }))
      : [
          {
            id: `ms_${Date.now()}_1`,
            title: 'Initial Architecture & UI Prototype',
            description: 'Core wireframes and data models approved.',
            amount: Math.round(totalBudget * 0.4),
            deadline: deadline,
            status: 'PENDING',
          },
          {
            id: `ms_${Date.now()}_2`,
            title: 'Full Feature Build & Integration',
            description: 'Core functionality, database integration, and business testing.',
            amount: Math.round(totalBudget * 0.4),
            deadline: deadline,
            status: 'PENDING',
          },
          {
            id: `ms_${Date.now()}_3`,
            title: 'Testing, Deployment & Handover',
            description: 'Production deployment, credentials handover, and staff training.',
            amount: totalBudget - (Math.round(totalBudget * 0.4) * 2),
            deadline: deadline,
            status: 'PENDING',
          }
        ];

    const newProject: IProject = {
      _id: `proj_${Date.now()}`,
      businessId: user._id,
      businessName: business?.businessName || user.name,
      businessLogo: business?.logo || user.avatar,
      title,
      description,
      category: category || 'Full Stack',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : ['React', 'Node.js'],
      budget: totalBudget,
      platformFee,
      studentAmount,
      deadline,
      location: location || 'Remote',
      projectType: projectType || 'REMOTE',
      status: 'OPEN',
      milestones: formattedMilestones,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    store.projects.unshift(newProject);

    res.status(201).json({ success: true, project: newProject });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function applyToProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    if (user.role !== 'STUDENT') {
      res.status(403).json({ success: false, message: 'Only students can apply to projects.' });
      return;
    }

    const { id } = req.params;
    const { proposal, expectedCompletion } = req.body;

    const project = store.projects.find(p => p._id === id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    if (project.status !== 'OPEN') {
      res.status(400).json({ success: false, message: 'This project is no longer accepting applications.' });
      return;
    }

    const alreadyApplied = store.applications.find(a => a.projectId === id && a.studentId === user._id);
    if (alreadyApplied) {
      res.status(400).json({ success: false, message: 'You have already applied to this project.' });
      return;
    }

    const studentProfile = store.studentProfiles.find(s => s.userId === user._id);
    const skillPassport = store.skillPassports.find(p => p.studentId === user._id);

    const newApplication: IApplication = {
      _id: `app_${Date.now()}`,
      projectId: project._id,
      projectTitle: project.title,
      businessId: project.businessId,
      businessName: project.businessName,
      studentId: user._id,
      studentName: user.name,
      studentAvatar: user.avatar,
      studentCollege: studentProfile?.college || 'College of Engineering',
      studentOverallScore: skillPassport?.overallScore || 75,
      proposal: proposal || 'I have the verified skills required for this project and look forward to delivering exceptional work.',
      expectedCompletion: expectedCompletion || project.deadline,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    store.applications.push(newApplication);

    // Notify business
    store.notifications.unshift({
      _id: `notif_${Date.now()}`,
      userId: project.businessId,
      type: 'APPLICATION_RECEIVED',
      title: 'New Applicant Received 🚀',
      message: `${user.name} (Score: ${newApplication.studentOverallScore}) submitted a proposal for "${project.title}".`,
      read: false,
      link: `/business/dashboard`,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ success: true, application: newApplication });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function getProjectApplications(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const { id } = req.params;

    const project = store.projects.find(p => p._id === id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    if (user.role !== 'ADMIN' && project.businessId !== user._id) {
      res.status(403).json({ success: false, message: 'Unauthorized to view applications for this project.' });
      return;
    }

    const applications = store.applications.filter(a => a.projectId === id);

    // Enrich applications with student skill passport highlights
    const enriched = applications.map(app => {
      const passport = store.skillPassports.find(p => p.studentId === app.studentId);
      const studentProf = store.studentProfiles.find(s => s.userId === app.studentId);
      return {
        ...app,
        skillPassport: passport,
        studentProfile: studentProf,
      };
    });

    res.json({ success: true, applications: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function selectStudent(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { studentId } = req.body;

    const project = store.projects.find(p => p._id === id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    if (user.role !== 'ADMIN' && project.businessId !== user._id) {
      res.status(403).json({ success: false, message: 'Only the project owner can select candidates.' });
      return;
    }

    const candidate = store.users.find(u => u._id === studentId);
    if (!candidate) {
      res.status(404).json({ success: false, message: 'Student candidate not found.' });
      return;
    }

    // Update project state to ACTIVE and link selected student
    project.status = 'ACTIVE';
    project.selectedStudentId = candidate._id;
    project.selectedStudentName = candidate.name;
    project.updatedAt = new Date().toISOString();

    // Mark candidate's application as ACCEPTED, others as REJECTED
    store.applications.forEach(app => {
      if (app.projectId === id) {
        if (app.studentId === studentId) {
          app.status = 'ACCEPTED';
        } else {
          app.status = 'REJECTED';
        }
      }
    });

    // Send notification to selected student
    store.notifications.unshift({
      _id: `notif_${Date.now()}_sel`,
      userId: studentId,
      type: 'PROJECT_SELECTED',
      title: 'Congratulations! You Were Selected! 🌟',
      message: `${project.businessName} has selected you for "${project.title}". Enter your Project Workspace to start collaborating!`,
      read: false,
      link: `/workspace/${project._id}`,
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}
