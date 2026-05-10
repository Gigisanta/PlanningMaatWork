import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, existsSync } from "fs/promises";
import path from "path";

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

// GET /api/followups - Get pending follow-ups that are due
export async function GET() {
  try {
    if (!existsSync(LEADS_FILE)) {
      return NextResponse.json({ followUps: [], message: "No data file" });
    }

    const data = JSON.parse(await readFile(LEADS_FILE, "utf-8"));
    const now = new Date();

    // Optimize lead lookups with O(1) access instead of O(N*M)
    const leadMap = new Map(data.leads.map((l: Lead) => [l.id, l]));

    // Find follow-ups that are due (scheduledFor <= now and status = pending)
    const dueFollowUps = data.followUps
      .filter((fu: FollowUp) => {
        if (fu.status !== "pending") return false;
        const scheduledDate = new Date(fu.scheduledFor);
        return scheduledDate <= now;
      })
      .map((fu: FollowUp) => {
        const lead = leadMap.get(fu.leadId);
        return { ...fu, lead };
      });

    return NextResponse.json({
      dueFollowUps,
      count: dueFollowUps.length,
      now: now.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    return NextResponse.json({ error: "Error fetching follow-ups" }, { status: 500 });
  }
}

// PATCH /api/followups - Mark follow-up as sent
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { followUpId, status } = body;

    if (!followUpId || !status) {
      return NextResponse.json({ error: "followUpId and status required" }, { status: 400 });
    }

    if (!existsSync(LEADS_FILE)) {
      return NextResponse.json({ error: "No data file" }, { status: 404 });
    }

    const data = JSON.parse(await readFile(LEADS_FILE, "utf-8"));
    const followUp = data.followUps.find((fu: FollowUp) => fu.id === followUpId);

    if (!followUp) {
      return NextResponse.json({ error: "Follow-up not found" }, { status: 404 });
    }

    followUp.status = status;
    if (status === "sent") {
      followUp.sentAt = new Date().toISOString();
    }

    await writeFile(LEADS_FILE, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, followUp });
  } catch (error) {
    console.error("Error updating follow-up:", error);
    return NextResponse.json({ error: "Error updating follow-up" }, { status: 500 });
  }
}
