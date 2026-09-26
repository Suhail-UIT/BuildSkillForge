import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI();
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `
You are ForgeAI — the dedicated intelligence assistant for BuildSkillForge.
BuildSkillForge connects college students with local businesses for real-world digital and technology projects.

Key Platform Principles:
1. Students: Learn → Compete → Prove → Build → Earn → Get Hired.
2. Businesses: Post Requirement → Discover Talent → Verify Skills → Select Student → Manage Project → Approve Work → Rate Student.
3. Pricing & Business Model: Transparent 10% platform fee on completed projects (e.g., on a ₹15,000 project, ₹1,500 is platform fee and ₹13,500 is the student payout).
4. Skill Passport: The student's dynamic, tamper-evident digital credential showcasing verified project deliveries, client ratings, competition rankings, and audited skill scores.
5. Project Workspace Milestones: Pending → In Progress → Submitted → Under Review → Approved (or Revision Requested). Deliverables and payments are released per approved milestone.
6. Support: When a user encounters an issue needing account changes, billing arbitration, or bugs, suggest creating a Support Ticket via the Support page.
7. Language versatility: You fluidly answer in English, Hindi, and Hinglish depending on how the user greets or queries you. (e.g. "Tournament kaise join karu?", "Mera project submit nahi ho raha", "How do I post a project?").
8. Security constraint: You are an advisory AI assistant. You cannot execute monetary transfers, grant admin privileges, or approve milestones directly.

Keep answers crisp, warm, helpful, structured with bullet points where appropriate, and encouraging.
`;

export async function askForgeAI(
  prompt: string,
  userContext?: { role?: string; name?: string; currentProjectId?: string }
): Promise<string> {
  const client = getAIClient();

  if (!client) {
    // High-quality contextual fallback when GEMINI_API_KEY is not configured
    const lower = prompt.toLowerCase();
    if (lower.includes('join') || lower.includes('competition') || lower.includes('tournament') || lower.includes('kaise join')) {
      return `### How to Join a BuildSkillForge Competition 🏆

1. **Browse Competitions**: Navigate to the **Competitions** tab from the top navigation.
2. **Review the Brief**: Choose an active challenge (e.g., *Full-Stack E-Commerce Engine* or *AI Inventory Predictor*), check rules, duration, and evaluation criteria.
3. **Click 'Enter Challenge'**: Start building your solution!
4. **Submit Your Code**: Before the deadline, submit your GitHub repository and live demo link.
5. **Get Evaluated**: Submissions are scored on code quality, UI polish, and performance. Top performers earn cash prizes and verified badges added straight to their **Skill Passport**!

*Hinglish Tip:* Aap direct Competitions section me jakar active challenge select karke GitHub repo link submit kar sakte hain!`;
    }

    if (lower.includes('post') || lower.includes('project') || lower.includes('hire') || lower.includes('business')) {
      return `### How Businesses Post Projects on BuildSkillForge 🚀

1. **Switch or Log in as Business**: Head to your **Business Dashboard**.
2. **Click 'Post New Project'**: Specify project title, category, tech stack, and overall budget.
3. **Define Milestones**: Split the project into verifiable milestones (e.g., UI Prototype, Backend API, Final Handover).
4. **Review Applications**: As college students apply, review their **Skill Passports** (which show verified past work and competition scores).
5. **Select & Collaborate**: Accept the best student to initialize your shared **Project Workspace**!`;
    }

    if (lower.includes('submit') || lower.includes('milestone') || lower.includes('deliverable') || lower.includes('nahi ho raha')) {
      return `### Submitting Milestones in Project Workspace 🛠️

1. Open your **Active Projects** and select the relevant project.
2. Inside the **Project Workspace**, scroll to the **Milestone Tracker**.
3. On your active milestone, click **Submit Deliverable**.
4. Enter your GitHub PR/commit link or deployed URL, along with summary notes of what was built.
5. The status updates to **Under Review**. The client will review and click **Approve** (or request revisions). Once approved, payment for that milestone is unlocked!

*Need urgent help?* If there is a technical error, click **Support** to file a quick ticket.`;
    }

    if (lower.includes('fee') || lower.includes('payment') || lower.includes('paisa') || lower.includes('charge')) {
      return `### BuildSkillForge Transparent Pricing 💳

- **Platform Fee**: Flat **10%** on successfully delivered projects.
- **Example**:
  - Project Value: ₹15,000
  - Platform Fee (10%): ₹1,500
  - Student Payout: **₹13,500**
- Payments are held in escrow and released milestone-by-milestone upon business approval!`;
    }

    return `Hello ${userContext?.name || 'there'}! I am **ForgeAI**, your assistant on BuildSkillForge.

I can help you with:
- 🎯 **Joining Competitions** to build your Skill Passport
- 💼 **Browsing & Applying to Projects** from verified local businesses
- 📋 **Posting Projects & Hiring Verified Students**
- ⚡ **Workspace Milestones & Deliverable Approvals**
- 💰 **Payment Release & 10% Fee Breakdown**

Feel free to ask me anything in **English**, **Hindi**, or **Hinglish**!`;
  }

  try {
    const contextualPrompt = userContext
      ? `[User Context: Name: ${userContext.name || 'User'}, Role: ${userContext.role || 'GUEST'}]\n\nUser Question: ${prompt}`
      : prompt;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contextualPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || 'ForgeAI processed your request. How else may I assist you with BuildSkillForge?';
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'ForgeAI is temporarily operating in local offline mode. You can still navigate projects, check your Skill Passport, or open a support ticket!';
  }
}
