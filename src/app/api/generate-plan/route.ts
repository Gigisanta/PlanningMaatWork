import { NextRequest, NextResponse } from "next/server";
import { generatePlanHTML, PlanData } from '@/lib/generatePlan';
import { getCachedPDF, cachePDF } from '@/lib/pdf-cache';

export async function POST(request: NextRequest) {
  try {
    const data: PlanData = await request.json();

    // ⚡ Bolt: Check for cached HTML to avoid expensive HTML generation
    const cachedHtml = getCachedPDF(data);
    if (cachedHtml) {
      return NextResponse.json({ html: cachedHtml });
    }

    const html = generatePlanHTML(data);

    // ⚡ Bolt: Cache generated HTML for future requests
    cachePDF(data, html);

    return NextResponse.json({ html });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json({ error: 'Error al generar el plan' }, { status: 500 });
  }
}

