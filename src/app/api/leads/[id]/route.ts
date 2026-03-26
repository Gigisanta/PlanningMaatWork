import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/leads/[id] - Get single lead
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { LeadFollowUp: { orderBy: { scheduledFor: "asc" } } },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("Error fetching lead:", error);
    return NextResponse.json({ error: "Error fetching lead" }, { status: 500 });
  }
}

// PATCH /api/leads/[id] - Update lead
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        stage: body.stage,
        notes: body.notes,
        lastContact: body.lastContact ? new Date(body.lastContact) : undefined,
        nextAction: body.nextAction,
        nextActionDate: body.nextActionDate ? new Date(body.nextActionDate) : undefined,
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ error: "Error updating lead" }, { status: 500 });
  }
}
