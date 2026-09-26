import { Response } from 'express';
import { store, ISupportTicket } from '../db/store.js';
import { AuthRequest } from '../middleware/auth.js';
import { PaymentService } from '../services/paymentService.js';
import { askForgeAI } from '../services/aiService.js';

// --- PAYMENTS ---
export async function getPaymentHistory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    let payments = [...store.payments];

    if (user.role === 'STUDENT') {
      payments = payments.filter(p => p.receiverId === user._id);
    } else if (user.role === 'BUSINESS') {
      payments = payments.filter(p => p.payerId === user._id);
    } // ADMIN sees all

    const totalStudentEarnings = payments
      .filter(p => p.receiverId === user._id && p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.studentAmount, 0);

    const totalBusinessSpent = payments
      .filter(p => p.payerId === user._id && p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      success: true,
      payments,
      summary: {
        totalEarnings: totalStudentEarnings,
        totalSpent: totalBusinessSpent,
        totalPlatformFee: payments.reduce((sum, p) => sum + p.platformFee, 0),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function createPaymentOrder(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const { projectId, amount } = req.body;

    if (!projectId || !amount) {
      res.status(400).json({ success: false, message: 'projectId and amount are required.' });
      return;
    }

    const order = await PaymentService.createOrder({
      projectId,
      payerId: user._id,
      amount: Number(amount),
    });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

// --- NOTIFICATIONS ---
export async function getNotifications(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const userNotifs = store.notifications.filter(n => n.userId === user._id);
    const unreadCount = userNotifs.filter(n => !n.read).length;

    res.json({ success: true, notifications: userNotifs, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function markNotificationRead(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const { id } = req.params;

    const notif = store.notifications.find(n => n._id === id && n.userId === user._id);
    if (notif) {
      notif.read = true;
    }

    res.json({ success: true, notification: notif });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function markAllNotificationsRead(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    store.notifications.forEach(n => {
      if (n.userId === user._id) n.read = true;
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

// --- SUPPORT TICKETS ---
export async function getSupportTickets(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    let tickets = store.supportTickets;

    if (user.role !== 'ADMIN') {
      tickets = tickets.filter(t => t.userId === user._id);
    }

    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function createSupportTicket(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const { category, description, priority } = req.body;

    if (!category || !description) {
      res.status(400).json({ success: false, message: 'Category and description are required.' });
      return;
    }

    const now = new Date().toISOString();
    const newTicket: ISupportTicket = {
      _id: `tkt_${Date.now()}`,
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      category,
      description,
      priority: priority || 'MEDIUM',
      status: 'Open',
      createdAt: now,
      updatedAt: now,
    };

    store.supportTickets.unshift(newTicket);
    res.status(201).json({ success: true, ticket: newTicket });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function updateSupportTicket(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    if (user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Admin access required to respond to tickets.' });
      return;
    }

    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const ticket = store.supportTickets.find(t => t._id === id);
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found.' });
      return;
    }

    if (status) ticket.status = status;
    if (adminResponse) ticket.adminResponse = adminResponse;
    ticket.updatedAt = new Date().toISOString();

    // Notify user
    store.notifications.unshift({
      _id: `notif_${Date.now()}_tkt`,
      userId: ticket.userId,
      type: 'SUPPORT_RESPONSE',
      title: `Support Ticket Updated: ${ticket.category}`,
      message: `Admin responded: "${adminResponse || 'Ticket status changed to ' + ticket.status}"`,
      read: false,
      link: '/support',
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

// --- FORGE AI ASSISTANT ---
export async function askAI(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { prompt, currentProjectId } = req.body;

    if (!prompt || !prompt.trim()) {
      res.status(400).json({ success: false, message: 'Prompt cannot be empty.' });
      return;
    }

    const userContext = req.user ? {
      name: req.user.name,
      role: req.user.role,
      currentProjectId,
    } : undefined;

    const answer = await askForgeAI(prompt.trim(), userContext);

    res.json({
      success: true,
      answer,
      suggestSupport: answer.toLowerCase().includes('support') || answer.toLowerCase().includes('ticket'),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

// --- ADMIN DASHBOARD & MODERATION ---
export async function getAdminStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    if (user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Unauthorized. Admin access required.' });
      return;
    }

    const totalStudents = store.users.filter(u => u.role === 'STUDENT').length;
    const totalBusinesses = store.users.filter(u => u.role === 'BUSINESS').length;
    const activeProjects = store.projects.filter(p => p.status === 'ACTIVE').length;
    const completedProjects = store.projects.filter(p => p.status === 'COMPLETED').length;
    const openProjects = store.projects.filter(p => p.status === 'OPEN').length;

    const totalGrossRevenue = store.payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);

    const platform10PercentCut = store.payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.platformFee, 0);

    const studentTotalPayouts = store.payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.studentAmount, 0);

    const openSupportTickets = store.supportTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalBusinesses,
        totalUsers: store.users.length,
        openProjects,
        activeProjects,
        completedProjects,
        totalGrossRevenue,
        platformFeeRevenue: platform10PercentCut,
        studentTotalPayouts,
        competitionsCount: store.competitions.length,
        submissionsCount: store.competitionParticipations.length,
        openSupportTickets,
      },
      recentUsers: store.users.slice(-6).reverse(),
      recentProjects: store.projects.slice(-5).reverse(),
      recentPayments: store.payments.slice(-5),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function toggleUserStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    if (user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Admin access required.' });
      return;
    }

    const { id } = req.params;
    const targetUser = store.users.find(u => u._id === id);

    if (!targetUser) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    targetUser.status = targetUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    targetUser.updatedAt = new Date().toISOString();

    res.json({ success: true, user: targetUser });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}
