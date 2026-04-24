import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, existsSync, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

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
  outreachSequence?: string;
  calComLink?: string;
  createdAt: string;
  updatedAt: string;
}

interface OutreachLog {
  id: string;
  leadId: string;
  type: "email" | "whatsapp" | "telegram";
  subject?: string;
  content: string;
  status: "pending" | "sent" | "delivered" | "opened" | "replied" | "booked" | "bounced";
  sentAt?: string;
  openedAt?: string;
  repliedAt?: string;
  bookedAt?: string;
  createdAt: string;
}

async function getData() {
  if (!existsSync(LEADS_FILE)) {
    return { leads: [], outreachLogs: [] };
  }
  const data = JSON.parse(await readFile(LEADS_FILE, "utf-8"));
  return { leads: data.leads || [], outreachLogs: data.outreachLogs || [] };
}

async function saveData(data: { leads: Lead[]; outreachLogs: OutreachLog[] }) {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  await writeFile(LEADS_FILE, JSON.stringify(data, null, 2));
}

// GET /api/outbound/leads - Get leads ready for outreach
export async function GET() {
  try {
    const { leads, outreachLogs } = await getData();
    
    // Get leads in "outreach" stage with pending sequences
    const outreachLeads = leads.filter(l => l.stage === "outreach");
    
    // Get pending outreach items
    const pendingOutreach = outreachLogs
      .filter(log => log.status === "pending")
      .map(log => {
        const lead = leads.find(l => l.id === log.leadId);
        return { ...log, lead };
      });

    return NextResponse.json({
      outreachLeads,
      pendingOutreach,
      stats: {
        leadsInOutreach: outreachLeads.length,
        pendingMessages: pendingOutreach.length,
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error fetching outreach leads" }, { status: 500 });
  }
}

// POST /api/outbound/leads - Generate outreach for a specific lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, type = "email" } = body;

    if (!leadId) {
      return NextResponse.json({ error: "leadId required" }, { status: 400 });
    }

    const { leads, outreachLogs } = await getData();
    const lead = leads.find(l => l.id === leadId);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Generate outreach using the main outbound endpoint logic
    const calLink = lead.interest === "cactus_wealth" 
      ? "https://cal.com/tu-cal-cactus" // Replace with actual
      : "https://cal.com/tu-cal-maatwork";

    const now = new Date().toISOString();

    // Generate 3 email sequence
    const sequences = [
      {
        day: 0,
        subject: lead.interest === "cactus_wealth" 
          ? `${lead.name}, una pregunta sobre tu futuro financiero`
          : `${lead.company || lead.name}, una pregunta rápida`,
        content: lead.interest === "cactus_wealth" ? `Hola ${lead.name},

Vi tu perfil y me pareció interesante tu situación.

Trabajo con personas que quieren entender si están ahorrando bien, invertir sin riesgos innecesarios y planificar su jubilación.

¿Querés una consulta gratis de 30 min?
→ ${calLink}

Abrazo!
Gio` : `Hola ${lead.name},

Vi ${lead.company || "tu negocio"} y me copó lo que muestran.

Te escribo porque estamos ayudando a gyms como el tuyo a automatizar cobros, turnos y seguimiento por WhatsApp.

La mayoría recovered 10-15 horas semanales.

¿Te parece si agenda una llamada de 20 min?
→ ${calLink}

Saludos!
Gio`,
        status: "pending" as const
      }
    ];

    for (const seq of sequences) {
      const log: OutreachLog = {
        id: crypto.randomUUID(),
        leadId,
        type: type as "email" | "whatsapp" | "telegram",
        subject: (seq as any).subject,
        content: seq.content,
        status: seq.status,
        createdAt: now,
      };
      outreachLogs.push(log);
    }

    await saveData({ leads, outreachLogs });

    return NextResponse.json({
      success: true,
      lead,
      sequence: sequences,
      message: `Outreach sequence generated for ${lead.name}`
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error generating outreach" }, { status: 500 });
  }
}
