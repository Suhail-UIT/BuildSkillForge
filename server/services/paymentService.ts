import { store, IPayment } from '../db/store.js';

export interface CreateOrderParams {
  projectId: string;
  milestoneId?: string;
  payerId: string;
  amount: number;
}

export class PaymentService {
  /**
   * Calculates platform fee (10%) and net student amount
   */
  static calculateFees(totalAmount: number): { platformFee: number; studentAmount: number } {
    const fee = Math.round(totalAmount * 0.10);
    return {
      platformFee: fee,
      studentAmount: totalAmount - fee,
    };
  }

  /**
   * Creates or simulates a secure payment order
   */
  static async createOrder(params: CreateOrderParams) {
    const project = store.projects.find(p => p._id === params.projectId);
    if (!project) throw new Error('Project not found');

    const { platformFee, studentAmount } = this.calculateFees(params.amount);
    const orderId = `ORDER_BSF_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    return {
      orderId,
      amount: params.amount,
      platformFee,
      studentAmount,
      currency: 'INR',
      projectId: params.projectId,
      businessName: project.businessName,
      keyId: process.env.PAYMENT_KEY_ID || 'rzp_test_forge_mock',
    };
  }

  /**
   * Verifies and records completed payment
   */
  static async recordPayment(
    projectId: string,
    payerId: string,
    amount: number,
    paymentMethod: string = 'Razorpay / UPI'
  ): Promise<IPayment> {
    const project = store.projects.find(p => p._id === projectId);
    if (!project) throw new Error('Project not found');

    const payer = store.users.find(u => u._id === payerId);
    const receiver = store.users.find(u => u._id === project.selectedStudentId);

    const { platformFee, studentAmount } = this.calculateFees(amount);

    const payment: IPayment = {
      _id: `pay_${Date.now()}`,
      projectId,
      projectTitle: project.title,
      payerId,
      payerName: payer?.name || project.businessName,
      receiverId: receiver?._id || 'usr_student_aarav',
      receiverName: receiver?.name || project.selectedStudentName || 'Assigned Student',
      amount,
      platformFee,
      studentAmount,
      status: 'COMPLETED',
      transactionId: `TXN_BSF_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    store.payments.unshift(payment);

    // Create notification for student
    if (receiver) {
      store.notifications.unshift({
        _id: `notif_${Date.now()}`,
        userId: receiver._id,
        type: 'PAYMENT_RECEIVED',
        title: 'Payment Credited! 💰',
        message: `₹${studentAmount.toLocaleString('en-IN')} has been released for "${project.title}" (10% fee deducted: ₹${platformFee}).`,
        read: false,
        link: `/workspace/${projectId}`,
        createdAt: new Date().toISOString(),
      });
    }

    return payment;
  }
}
