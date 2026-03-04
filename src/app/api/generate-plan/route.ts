import { NextRequest, NextResponse } from "next/server";
import { generatePlanHTML, PlanData } from '@/lib/generatePlan';

export async function POST(request: NextRequest) {
  try {
    const data: PlanData = await request.json();
    const html = generatePlanHTML(data);
    return NextResponse.json({ html });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json({ error: 'Error al generar el plan' }, { status: 500 });
  }
}

