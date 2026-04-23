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

// Cal.com booking links (to be configured by user)
const CAL_COM_LINKS = {
  maatwork: "YOUR_CAL_COM_USERNAME", // Replace with actual Cal.com username
  cactuswealth: "YOUR_CAL_COM_USERNAME"
};

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

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// GET /api/outbound - Get outbound pipeline stats
export async function GET() {
  try {
    const { leads, outreachLogs } = await getData();
    
    // ⚡ Bolt: Consolidate leads byStage filter passes into a single reduce
    const byStage = leads.reduce(
      (acc, l) => {
        if (l.stage in acc) {
          acc[l.stage as keyof typeof acc]++;
        }
        return acc;
      },
      { new: 0, outreach: 0, qualified: 0, meeting: 0, proposal: 0, won: 0, lost: 0 }
    );

    // ⚡ Bolt: Consolidate outreachStats filter passes into a single reduce
    const outreachStats = outreachLogs.reduce(
      (acc, l) => {
        if (l.status !== "pending") acc.totalSent++;
        if (["delivered", "opened", "replied", "booked"].includes(l.status)) acc.delivered++;
        if (["opened", "replied", "booked"].includes(l.status)) acc.opened++;
        if (["replied", "booked"].includes(l.status)) acc.replied++;
        if (l.status === "booked") acc.booked++;
        return acc;
      },
      { totalSent: 0, delivered: 0, opened: 0, replied: 0, booked: 0 }
    );

    const stats = {
      totalLeads: leads.length,
      byStage,
      outreachStats,
      calComLinks: CAL_COM_LINKS,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error fetching stats" }, { status: 500 });
  }
}

// POST /api/outbound/generate-sequence - Generate outreach sequence for a lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, type } = body; // type: "email" | "whatsapp" | "telegram"

    if (!leadId) {
      return NextResponse.json({ error: "leadId required" }, { status: 400 });
    }

    const { leads, outreachLogs } = await getData();
    const lead = leads.find(l => l.id === leadId);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const calLink = lead.interest === "cactus_wealth" 
      ? `https://cal.com/${CAL_COM_LINKS.cactuswealth}`
      : `https://cal.com/${CAL_COM_LINKS.maatwork}`;

    // Generate email sequence
    const sequences = {
      email: [
        {
          day: 0,
          subject: lead.interest === "cactus_wealth" 
            ? `${lead.name}, una pregunta sobre tu futuro financiero`
            : `${lead.company || lead.name}, una pregunta rápida`,
          content: lead.interest === "cactus_wealth" ? `
Hola ${lead.name},

Vi tu perfil y me pareció interesante tu situación.

Trabajo con personas que quieren:
- Entender si están ahorrando bien
- Invertir sin riesgos innecesarios
- Planificar su jubilación o metas financieras

La mayoría de mis clientes no tienen un plan financiero claro cuando empezamos.

¿Querés una consulta gratis de 30 min para revisar tu situación?
→ ${calLink}

Abrazo!
Gio
          ` : `
Hola ${lead.name},

Vi ${lead.company || "tu negocio"} y me copó lo que muestran.

Te escribo porque estamos ayudando a gyms como el tuyo a automatizar:
- Cobros y renovaciones
- Turnos y horarios
- Seguimiento con clientes por WhatsApp

La mayoría de nuestros clientes recovered 10-15 horas semanales.

¿Te parece si agenda una llamada de 20 min para mostrarte cómo funciona? 
→ ${calLink}

Saludos!
Gio
          `,
          status: "pending" as const
        },
        {
          day: 3,
          subject: `Re: ${lead.company || lead.name}`,
          content: lead.interest === "cactus_wealth" ? `
Hola ${lead.name},

Te quería hacer una pregunta simple:

Si pudieras mejorar tu situación financiera ahora mismo, ¿por dónde empezarías?

Para muchos de mis clientes, el primer paso es entender dónde están realmente.
Tenemos una consulta gratuita de 30 min para revisar tu situación.

¿Tenés 30 min esta semana?
→ ${calLink}

Abrazo!
Gio
          ` : `
Hola ${lead.name},

Te quería hacer una pregunta simple:

Si pudieras recovered 10 horas ahora mismo esta semana, ¿en qué invertirías ese tiempo?

Para muchos de nuestros clientes, esas horas van a parar a:
- Seguir clientes que no renuevan
- Mandar mensajes de WhatsApp manualmente
- Corregir errores de cobros

Te paso el link por si querés ver cómo funciona:
→ ${calLink}

Abrazo!
Gio
          `,
          status: "pending" as const
        },
        {
          day: 7,
          subject: `${lead.name}, cierre esta semana`,
          content: lead.interest === "cactus_wealth" ? `
Hola ${lead.name},

Te escribo por última vez sobre esto.

Tenemos 3 plazas disponibles esta semana para consultas gratuitas.

¿Querés reservar la tuya?
→ ${calLink}

Si no te interesa, simplemente respondeme "no" y no te molesto más :)

Gio
          ` : `
Hola ${lead.name},

Te escribo por última vez sobre esto.

Tenemos 3 plazas disponibles esta semana para implementar MaatWork sin costo de setup.

¿Querés reservar la tuya?
→ ${calLink}

Si no te interesa, simplemente respondeme "no" y no te molesto más :)

Gio
          `,
          status: "pending" as const
        },
        {
          day: 14,
          subject: `PD: ¿Puedo ayudarte con algo más?`,
          content: lead.interest === "cactus_wealth" ? `
Hola ${lead.name},

Sé que quizás no era el momento. Si en el futuro necesitás ayuda con tus finanzas, estoy disponible.

Mientras tanto, te dejo un recurso gratis que puede servirte:
→ ${calLink}/recursos

¡Abrazo!
Gio
          ` : `
Hola ${lead.name},

Una última cosa — también trabajo con asesoría financiera para dueños de negocios como vos.

Si alguna vez querés revisar cómo están tus finanzas personales o las del negocio, con mucho gusto te ayudo.

Consultá sin compromiso:
→ ${calLink}

¡Éxitos con ${lead.company || "tu negocio"}!
Gio
          `,
          status: "pending" as const
        }
      ],
      whatsapp: [
        {
          day: 0,
          content: `Hola ${lead.name}! 👋

Soy Gio${lead.interest === "cactus_wealth" ? " de Cactus Wealth" : " de MaatWork"}.

Te ofrezco una consulta GRATIS de 30 min donde podemos ver:
→ Cómo están tus números realmente
→ 3 acciones concretas para mejorar

¿Tenés 30 min esta semana? Agendá acá:
${calLink}

¡Abrazo!`,
          status: "pending" as const
        },
        {
          day: 3,
          content: `${lead.name}, ¿pudiste agendar la consulta?

Quedan solo 2 plazas esta semana.
→ ${calLink}`,
          status: "pending" as const
        }
      ],
      telegram: [
        {
          day: 0,
          content: `📋 *Lead: ${lead.name}*
📧 Email: ${lead.email}
🏢 Company: ${lead.company || "N/A"}
📊 Score: ${lead.totalScore}/13
🔗 Booking: ${calLink}

*Outreach sequence generado. En espera de respuesta.*`,
          status: "pending" as const
        }
      ]
    };

    // Store sequences as outreach logs
    const selectedSequences = sequences[type] || sequences.email;
    const now = new Date().toISOString();

    for (const seq of selectedSequences) {
      const log: OutreachLog = {
        id: generateId(),
        leadId,
        type: type as "email" | "whatsapp" | "telegram",
        subject: (seq as any).subject,
        content: seq.content,
        status: seq.status,
        createdAt: now,
      };
      outreachLogs.push(log);
    }

    // Update lead stage
    const leadIndex = leads.findIndex(l => l.id === leadId);
    leads[leadIndex].stage = "outreach";
    leads[leadIndex].outreachSequence = type;
    leads[leadIndex].calComLink = calLink;
    leads[leadIndex].updatedAt = now;

    await saveData({ leads, outreachLogs });

    return NextResponse.json({
      success: true,
      lead: leads[leadIndex],
      sequence: selectedSequences,
      calLink,
      message: `Sequence "${type}" generated for ${lead.name}. Ready to send.`
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error generating sequence" }, { status: 500 });
  }
}
