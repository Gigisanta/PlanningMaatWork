import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Simple JSON file storage - use /tmp for Vercel serverless compatibility
const DATA_DIR = path.join("/tmp", "maatwork-leads");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  source: string;
  interest?: string;
  stage: string;
  budgetScore: number;
  urgencyScore: number;
  industryScore: number;
  totalScore: number;
  notes?: string;
  lastContact?: string;
  nextAction?: string;
  nextActionDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface FollowUp {
  id: string;
  leadId: string;
  type: string;
  status: string;
  scheduledFor: string;
  sentAt?: string;
  content?: string;
  createdAt: string;
}

// Ensure data directory exists
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

// Read leads from file
async function getLeads(): Promise<{ leads: Lead[]; followUps: FollowUp[] }> {
  await ensureDataDir();
  if (!existsSync(LEADS_FILE)) {
    return { leads: [], followUps: [] };
  }
  const data = await readFile(LEADS_FILE, "utf-8");
  return JSON.parse(data);
}

// Write leads to file
async function saveLeads(data: { leads: Lead[]; followUps: FollowUp[] }) {
  await ensureDataDir();
  await writeFile(LEADS_FILE, JSON.stringify(data, null, 2));
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Calculate lead scores
function calculateScores(data: { name: string; email: string; company?: string }): {
  budgetScore: number;
  urgencyScore: number;
  industryScore: number;
  totalScore: number;
} {
  const idealIndustries = ["gimnasio", "gym", "fitness", "natatorio", "piscina", "pool", "salon", "estetica", "peluqueria"];
  
  let industryScore = 1;
  if (data.company && idealIndustries.some(ind => data.company!.toLowerCase().includes(ind))) {
    industryScore = 3;
  } else if (data.company) {
    industryScore = 2;
  }

  // Budget scoring (default to 3 for inbound web leads)
  const budgetScore = 3;
  // Urgency scoring (default to 3 for proactive inquiries)
  const urgencyScore = 3;

  return {
    budgetScore,
    urgencyScore,
    industryScore,
    totalScore: budgetScore + urgencyScore + industryScore,
  };
}

// GET /api/leads - List all leads
export async function GET() {
  try {
    const data = await getLeads();

    // ⚡ Bolt: Consolidate stats generation into a single reduce pass
    const statsAccumulator = data.leads.reduce(
      (acc, l) => {
        if (l.stage === "new") acc.new++;
        if (l.stage === "contacted") acc.contacted++;
        if (l.stage === "qualified") acc.qualified++;
        acc.totalScoreSum += l.totalScore || 0;
        return acc;
      },
      { new: 0, contacted: 0, qualified: 0, totalScoreSum: 0 }
    );

    const stats = {
      total: data.leads.length,
      new: statsAccumulator.new,
      contacted: statsAccumulator.contacted,
      qualified: statsAccumulator.qualified,
      avgScore: data.leads.length > 0
        ? Math.round((statsAccumulator.totalScoreSum / data.leads.length) * 10) / 10
        : 0,
    };

    return NextResponse.json({
      leads: data.leads,
      followUps: data.followUps,
      stats
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Error fetching leads" }, { status: 500 });
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, source, interest } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const scores = calculateScores({ name, email, company });

    const now = new Date().toISOString();
    const lead: Lead = {
      id: generateId(),
      name,
      email,
      company: company || undefined,
      phone: phone || undefined,
      source: source || "web",
      interest: interest || undefined,
      stage: "new",
      ...scores,
      notes: undefined,
      lastContact: undefined,
      nextAction: undefined,
      nextActionDate: undefined,
      createdAt: now,
      updatedAt: now,
    };

    // Schedule follow-ups
    const followUps: FollowUp[] = [
      { id: generateId(), leadId: lead.id, type: "telegram", status: "pending", scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), content: `Follow-up Day 3 para ${name}`, createdAt: now },
      { id: generateId(), leadId: lead.id, type: "telegram", status: "pending", scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), content: `Follow-up Day 7 para ${name}`, createdAt: now },
      { id: generateId(), leadId: lead.id, type: "telegram", status: "pending", scheduledFor: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), content: `Follow-up Day 14 para ${name}`, createdAt: now },
    ];

    const data = await getLeads();
    data.leads.unshift(lead);
    data.followUps.push(...followUps);
    await saveLeads(data);

    return NextResponse.json({
      success: true,
      lead,
      followUps,
      message: "Lead captured! Follow-ups scheduled for days 3, 7, 14.",
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Error creating lead" }, { status: 500 });
  }
}
