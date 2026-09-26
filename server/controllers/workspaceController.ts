import { Response } from 'express';
import { store, IWorkspaceMessage, IReview } from '../db/store.js';
import { AuthRequest } from '../middleware/auth.js';
import { PaymentService } from '../services/paymentService.js';

export async function getWorkspace(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const { projectId } = req.params;

    const project = store.projects.find(p => p._id === projectId);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    // Verify access
    const isOwner = project.businessId === user._id;
    const isStudent = project.selectedStudentId === user._id;
    const isAdmin = user.role === 'ADMIN';

    if (!isOwner && !isStudent && !isAdmin) {
      res.status(403).json({ success: false, message: 'Unauthorized access to this project workspace.' });
      return;
    }

    const business = store.businessProfiles.find(b => b.userId === project.businessId);
    const studentUser = store.users.find(u => u._id === project.selectedStudentId);
    const studentProfile = store.studentProfiles.find(s => s.userId === project.selectedStudentId);
    const skillPassport = store.skillPassports.find(p => p.studentId === project.selectedStudentId);

    const projectPayments = store.payments.filter(p => p.projectId === projectId);
    const projectReview = store.reviews.find(r => r.projectId === projectId);

    res.json({
      success: true,
      workspace: {
        project,
        business: {
          id: project.businessId,
          name: project.businessName,
          logo: project.businessLogo,
          location: business?.location,
          website: business?.website,
        },
        student: studentUser ? {
          id: studentUser._id,
          name: studentUser.name,
          avatar: studentUser.avatar,
          college: studentProfile?.college,
          skills: studentProfile?.skills,
          passportScore: skillPassport?.overallScore,
        } : null,
        milestones: project.milestones,
        messages: project.messages || [],
        payments: projectPayments,
        review: projectReview || null,
        currentUserRole: user._id === project.businessId ? 'BUSINESS' : (user._id === project.selectedStudentId ? 'STUDENT' : user.role),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function updateMilestoneStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const { projectId, milestoneId } = req.params;
    const { action, submissionNotes, deliverableUrl, feedback } = req.body;

    const project = store.projects.find(p => p._id === projectId);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    const milestone = project.milestones.find(m => m.id === milestoneId);
    if (!milestone) {
      res.status(404).json({ success: false, message: 'Milestone not found.' });
      return;
    }

    const isStudent = project.selectedStudentId === user._id;
    const isBusiness = project.businessId === user._id || user.role === 'ADMIN';

    // 1. Student starting milestone
    if (action === 'START') {
      if (!isStudent && user.role !== 'ADMIN') {
        res.status(403).json({ success: false, message: 'Only the assigned student can start work.' });
        return;
      }
      milestone.status = 'IN_PROGRESS';
    }
    // 2. Student submitting deliverable
    else if (action === 'SUBMIT') {
      if (!isStudent && user.role !== 'ADMIN') {
        res.status(403).json({ success: false, message: 'Only the assigned student can submit deliverables.' });
        return;
      }
      milestone.status = 'UNDER_REVIEW';
      milestone.submissionNotes = submissionNotes || 'Deliverables submitted for review.';
      milestone.deliverableUrl = deliverableUrl || '';
      milestone.submittedAt = new Date().toISOString();

      // Notify Business
      store.notifications.unshift({
        _id: `notif_${Date.now()}_sub`,
        userId: project.businessId,
        type: 'MILESTONE_SUBMITTED',
        title: 'Milestone Submitted for Review 🔍',
        message: `${project.selectedStudentName} submitted deliverable for "${milestone.title}".`,
        read: false,
        link: `/workspace/${projectId}`,
        createdAt: new Date().toISOString(),
      });
    }
    // 3. Business reviewing milestone
    else if (action === 'APPROVE') {
      if (!isBusiness) {
        res.status(403).json({ success: false, message: 'Only the business client can approve milestones.' });
        return;
      }
      milestone.status = 'APPROVED';
      milestone.reviewedAt = new Date().toISOString();
      milestone.feedback = feedback || 'Milestone verified and approved.';

      // Process automatic payment release for this milestone
      await PaymentService.recordPayment(projectId, project.businessId, milestone.amount, 'UPI Escrow Release');

      // Check if all milestones are approved, set project to near-completion
      const allApproved = project.milestones.every(m => m.status === 'APPROVED');
      if (allApproved) {
        // Can prompt business to complete project & rate student
      }
    }
    // 4. Business requesting revision
    else if (action === 'REQUEST_REVISION') {
      if (!isBusiness) {
        res.status(403).json({ success: false, message: 'Only the business client can request revisions.' });
        return;
      }
      milestone.status = 'REVISION_REQUESTED';
      milestone.feedback = feedback || 'Please review requested tweaks before re-submission.';

      if (project.selectedStudentId) {
        store.notifications.unshift({
          _id: `notif_${Date.now()}_rev`,
          userId: project.selectedStudentId,
          type: 'REVISION_REQUESTED',
          title: 'Revision Requested on Milestone ⚠️',
          message: `${project.businessName} requested adjustments on "${milestone.title}": ${feedback || 'Check workspace notes.'}`,
          read: false,
          link: `/workspace/${projectId}`,
          createdAt: new Date().toISOString(),
        });
      }
    } else {
      res.status(400).json({ success: false, message: 'Invalid action specified.' });
      return;
    }

    project.updatedAt = new Date().toISOString();
    res.json({ success: true, milestone, project });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function sendWorkspaceMessage(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const { projectId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      res.status(400).json({ success: false, message: 'Message content cannot be empty.' });
      return;
    }

    const project = store.projects.find(p => p._id === projectId);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    const newMessage: IWorkspaceMessage = {
      id: `msg_${Date.now()}`,
      senderId: user._id,
      senderName: user.name,
      senderRole: user.role,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    if (!project.messages) project.messages = [];
    project.messages.push(newMessage);

    // Notify recipient
    const recipientId = user._id === project.businessId ? project.selectedStudentId : project.businessId;
    if (recipientId) {
      store.notifications.unshift({
        _id: `notif_${Date.now()}_msg`,
        userId: recipientId,
        type: 'NEW_MESSAGE',
        title: `Message from ${user.name}`,
        message: message.trim().slice(0, 80) + (message.length > 80 ? '...' : ''),
        read: false,
        link: `/workspace/${projectId}`,
        createdAt: new Date().toISOString(),
      });
    }

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function completeAndRateProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const { projectId } = req.params;
    const { communication, quality, delivery, professionalism, problemSolving, comment } = req.body;

    const project = store.projects.find(p => p._id === projectId);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    if (project.businessId !== user._id && user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Only the business client can rate the student and finalize the project.' });
      return;
    }

    if (!project.selectedStudentId) {
      res.status(400).json({ success: false, message: 'No student assigned to this project.' });
      return;
    }

    const comm = Math.min(5, Math.max(1, Number(communication) || 5));
    const qual = Math.min(5, Math.max(1, Number(quality) || 5));
    const deliv = Math.min(5, Math.max(1, Number(delivery) || 5));
    const prof = Math.min(5, Math.max(1, Number(professionalism) || 5));
    const prob = Math.min(5, Math.max(1, Number(problemSolving) || 5));
    const avgRating = Number(((comm + qual + deliv + prof + prob) / 5).toFixed(1));

    const newReview: IReview = {
      _id: `rev_${Date.now()}`,
      projectId: project._id,
      projectTitle: project.title,
      reviewerId: user._id,
      reviewerName: project.businessName,
      revieweeId: project.selectedStudentId,
      rating: avgRating,
      communication: comm,
      quality: qual,
      delivery: deliv,
      professionalism: prof,
      problemSolving: prob,
      comment: comment || 'Successfully completed and delivered to high standards.',
      createdAt: new Date().toISOString(),
    };

    store.reviews.push(newReview);
    project.status = 'COMPLETED';
    project.updatedAt = new Date().toISOString();

    // UPDATE STUDENT'S SKILL PASSPORT WITH VERIFIED EVIDENCE
    const passport = store.skillPassports.find(p => p.studentId === project.selectedStudentId);
    if (passport) {
      // Add project to passport history
      passport.projects.unshift({
        projectId: project._id,
        title: project.title,
        clientName: project.businessName,
        rating: avgRating,
        completedAt: new Date().toISOString().split('T')[0],
        skillsUsed: project.requiredSkills,
      });

      // Recalculate passport ratings
      const allReviewsForStudent = store.reviews.filter(r => r.revieweeId === project.selectedStudentId);
      const totalReviews = allReviewsForStudent.length;
      const sumRating = allReviewsForStudent.reduce((acc, r) => acc + r.rating, 0);

      passport.ratings = {
        average: Number((sumRating / totalReviews).toFixed(1)),
        communication: Number((allReviewsForStudent.reduce((a, b) => a + b.communication, 0) / totalReviews).toFixed(1)),
        quality: Number((allReviewsForStudent.reduce((a, b) => a + b.quality, 0) / totalReviews).toFixed(1)),
        delivery: Number((allReviewsForStudent.reduce((a, b) => a + b.delivery, 0) / totalReviews).toFixed(1)),
        professionalism: Number((allReviewsForStudent.reduce((a, b) => a + b.professionalism, 0) / totalReviews).toFixed(1)),
        problemSolving: Number((allReviewsForStudent.reduce((a, b) => a + b.problemSolving, 0) / totalReviews).toFixed(1)),
        reviewCount: totalReviews,
      };

      // Boost overall score with verified project delivery (+2 to +5 points based on rating)
      passport.overallScore = Math.min(99, passport.overallScore + (avgRating >= 4.5 ? 4 : 2));

      // Unlock Verified Finisher Badge if not present
      if (!passport.badges.some(b => b.id === 'b_verified_builder')) {
        passport.badges.push({
          id: 'b_verified_builder',
          name: 'Verified Project Finisher',
          description: 'Delivered real business projects on-budget and on-time',
          icon: 'CheckCircle',
          unlockedAt: new Date().toISOString(),
        });
      }
    }

    // Send celebration notification to student
    store.notifications.unshift({
      _id: `notif_${Date.now()}_comp`,
      userId: project.selectedStudentId,
      type: 'PROJECT_COMPLETED',
      title: 'Project Completed & Rated! ⭐',
      message: `${project.businessName} awarded you ${avgRating} / 5 stars for "${project.title}". Your Skill Passport has been updated!`,
      read: false,
      link: `/skill-passport/${project.selectedStudentId}`,
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true, project, review: newReview, skillPassport: passport });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}
