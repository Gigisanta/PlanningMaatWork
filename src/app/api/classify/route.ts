import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, existsSync, mkdir } from "fs/promises";
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
  interest: string;
  stage: string;
  budgetScore: number;
  urgencyScore: number;
  industryScore: number;
  totalScore: number;
  primaryService: string; // "maatwork" | "cactuswealth"
  crossSellOpportunity: boolean;
  crossSellReason?: string;
  notes?: string;
  lastContact?: string;
  nextAction?: string;
  nextActionDate?: string;
  outreachSequence?: string;
  calComLink?: string;
  createdAt: string;
  updatedAt: string;
}

async function getData() {
  if (!existsSync(LEADS_FILE)) {
    return { leads: [], outreachLogs: [] };
  }
  const data = JSON.parse(await readFile(LEADS_FILE, "utf-8"));
  return { 
    leads: Array.isArray(data.leads) ? data.leads : [], 
    outreachLogs: Array.isArray(data.outreachLogs) ? data.outreachLogs : [] 
  };
}

async function saveData(data: { leads: Lead[]; outreachLogs: any[] }) {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  await writeFile(LEADS_FILE, JSON.stringify(data, null, 2));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Keywords that indicate cross-sell to Cactus Wealth
const CROSSSELL_KEYWORDS = {
  financial: ["inversiones", "ahorro", "jubilación", "retiro", "finanzas", "presupuesto", "deudas", "crédito", "préstamo"],
  concerns: ["estrés financiero", "dinero", "pesos", "dólares", "inflación", "precio del dólar", "que no alcanza"],
  goals: ["invertir", "ahorrar", "jubilación", "retiro", "futuro", "patrimonio", "capital"]
};

// ⚡ Bolt: Hoisted arrays out of function scope to prevent O(N) allocation on every function call
const ALL_FINANCIAL_KEYWORDS = Object.values(CROSSSELL_KEYWORDS).flat();

const MAATWORK_INDUSTRIES = ["gimnasio", "gym", "fitness", "natatorio", "piscina", "pool", "salon", "estetica", "peluqueria", "spa", "boxeo", "crossfit", "yoga", "pilates", "deporte"];

function classifyLead(lead: Partial<Lead>): { primaryService: string; crossSellOpportunity: boolean; crossSellReason?: string } {
  const text = `${lead.name || ""} ${lead.company || ""} ${lead.notes || ""}`.toLowerCase();
  
  // Check if they're a clear MaatWork target (gym/pool/salon)
  const isMaatWorkTarget = MAATWORK_INDUSTRIES.some(ind => text.includes(ind));
  
  // Check for financial advisory needs
  const financialKeywordsFound = ALL_FINANCIAL_KEYWORDS.filter(kw => text.includes(kw));
  
  // Decision logic:
  // 1. If it's a MaatWork target -> PRIMARY = maatwork
  // 2. If it mentions financial goals AND is not a clear MaatWork target -> PRIMARY = cactuswealth
  // 3. If MaatWork target but also has financial keywords -> cross-sell opportunity
  
  if (isMaatWorkTarget) {
    if (financialKeywordsFound.length > 0) {
      return {
        primaryService: "maatwork",
        crossSellOpportunity: true,
        crossSellReason: `Keywords financieras detectadas: ${financialKeywordsFound.slice(0, 3).join(", ")}`
      };
    }
    return {
      primaryService: "maatwork",
      crossSellOpportunity: false
    };
  }
  
  // If not a MaatWork target but has financial interests
  if (financialKeywordsFound.length >= 2) {
    return {
      primaryService: "cactuswealth",
      crossSellOpportunity: false
    };
  }
  
  // Default to maatwork if industry match
  return {
    primaryService: "maatwork",
    crossSellOpportunity: false
  };
}

// GET /api/classify - Classify all leads
export async function GET() {
  try {
    const { leads } = await getData();
    
    // Re-classify all leads
    const classified = leads.map(lead => {
      const classification = classifyLead(lead);
      return {
        ...lead,
        ...classification
      };
    });
    
    // Stats
    // ⚡ Bolt: Consolidated 9 O(N) array.filter() passes into a single O(N) pass for better performance
    const stats = classified.reduce((acc, l) => {
      acc.total++;
      if (l.primaryService === "maatwork") acc.maatwork++;
      else if (l.primaryService === "cactuswealth") acc.cactuswealth++;

      if (l.crossSellOpportunity) acc.crossSellOpportunities++;

      if (l.stage in acc.byStage) {
        acc.byStage[l.stage as keyof typeof acc.byStage]++;
      }

      return acc;
    }, {
      total: 0,
      maatwork: 0,
      cactuswealth: 0,
      crossSellOpportunities: 0,
      byStage: {
        new: 0,
        outreach: 0,
        qualified: 0,
        meeting: 0,
        proposal: 0,
        won: 0,
      }
    });
    
    return NextResponse.json({ leads: classified, stats });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error classifying leads" }, { status: 500 });
  }
}

// POST /api/classify - Classify a single lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId } = body;
    
    if (!leadId) {
      return NextResponse.json({ error: "leadId required" }, { status: 400 });
    }
    
    const { leads } = await getData();
    const leadIndex = leads.findIndex(l => l.id === leadId);
    
    if (leadIndex === -1) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    
    const lead = leads[leadIndex];
    const classification = classifyLead(lead);
    
    // Update lead
    leads[leadIndex] = {
      ...lead,
      ...classification,
      updatedAt: new Date().toISOString()
    };
    
    await saveData({ leads, outreachLogs: [] });
    
    return NextResponse.json({
      success: true,
      lead: leads[leadIndex],
      classification
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error classifying lead" }, { status: 500 });
  }
}
