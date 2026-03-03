import { NextRequest, NextResponse } from "next/server";

interface Instrument {
  nombre: string;
  tipo: string;
  asignacion: number;
  moneda: string;
  objetivo: string;
}

interface AsignacionEstrategica {
  horizonte: string;
  porcentaje: number;
  sector: string;
  objetivo: string;
}

interface ObligacionNegociable {
  emisor: string;
  cupon: string;
  vencimiento: string;
  ticker: string;
  moneda: string;
  pago: string;
}

interface Riesgo {
  riesgo: string;
  nivel: 'Bajo' | 'Medio' | 'Alto';
  mitigacion: string;
}

interface ConfigurableLink {
  name: string;
  url: string;
  icon: 'link' | 'instagram' | 'whatsapp';
}

interface PlanData {
  edad: number;
  profesion: string;
  objetivo: string;
  aporteMensual: number;
  perfilRiesgo: string;
  horizonteMeses: number;
  gastosPrincipales: string;
  observaciones?: string;
  asignacionEstrategica: AsignacionEstrategica[];
  instruments: Instrument[];
  obligacionesNegociables: ObligacionNegociable[];
  riesgos: Riesgo[];
  beneficiosFiscales: string[];
  terminoFinanciero: string;
  usarTerminoIA: boolean;
  consejoFinal: string;
  usarConsejoIA: boolean;
  platformLinks?: ConfigurableLink[];
  socialLinks?: ConfigurableLink[];
  asesorNombre?: string;
  asesorRecomendacion?: boolean;
}

const COLORS = {
  primary: '#1A3C34',
  primaryLight: '#2D5A4A',
  accent: '#B8860B',
  accentSoft: '#F4E4BC',
  text: '#1F2D26',
  textLight: '#5C6B62',
  bg: '#FAFAF8',
  white: '#FFFFFF',
  border: '#E2E8F0',
};

function generateBaseHTML(data: PlanData): string {
  const fecha = new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const metaTotal = data.aporteMensual * data.horizonteMeses;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Propuesta Premium - ${data.profesion}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #fff; color: ${COLORS.text}; line-height: 1.5; }
    .page { width: 800px; margin: 0 auto; background: #fff; padding: 0; position: relative; }

    /* Hero Section */
    .hero { background: ${COLORS.primary}; color: #fff; padding: 100px 60px; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; top: 0; right: 0; width: 300px; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05)); }
    .hero h1 { font-family: 'Playfair Display', serif; font-size: 44px; margin-bottom: 20px; color: ${COLORS.accentSoft}; }
    .hero p { font-size: 18px; opacity: 0.9; max-width: 500px; margin-bottom: 40px; }
    .hero-stats { display: flex; gap: 40px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 30px; }
    .stat-item .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; margin-bottom: 5px; }
    .stat-item .value { font-size: 18px; font-weight: 700; }

    .content { padding: 60px; }
    .section-title { font-family: 'Playfair Display', serif; font-size: 28px; color: ${COLORS.primary}; margin-bottom: 30px; border-left: 5px solid ${COLORS.accent}; padding-left: 20px; }

    .intro-text { font-size: 16px; color: ${COLORS.textLight}; margin-bottom: 40px; line-height: 1.8; }

    /* Cards */
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 50px; }
    .card-flat { background: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #edf2f7; }
    .card-flat .label { font-size: 10px; text-transform: uppercase; color: ${COLORS.textLight}; font-weight: 600; margin-bottom: 8px; }
    .card-flat .value { font-size: 18px; font-weight: 700; color: ${COLORS.primary}; }

    /* Visual Allocation */
    .allocation-visual { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 50px; }
    .chart-box { background: #fff; padding: 30px; border-radius: 20px; border: 1px solid #edf2f7; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }

    .progress-group { margin-bottom: 20px; }
    .progress-label { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; font-weight: 500; }
    .progress-bg { height: 8px; background: #edf2f7; border-radius: 10px; overflow: hidden; }
    .progress-fill { height: 100%; background: ${COLORS.primary}; border-radius: 10px; }

    /* Portfolio List */
    .portfolio-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 50px; }
    .portfolio-item { padding: 20px; border-radius: 12px; background: #fff; border: 1px solid #edf2f7; border-left: 4px solid ${COLORS.accent}; }
    .portfolio-item h4 { font-size: 15px; margin-bottom: 5px; color: ${COLORS.primary}; }
    .portfolio-item .meta { font-size: 12px; color: ${COLORS.textLight}; display: flex; justify-content: space-between; }

    /* Tables */
    table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
    th { text-align: left; padding: 15px; background: ${COLORS.primary}; color: #fff; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 15px; border-bottom: 1px solid #edf2f7; font-size: 13px; }
    tr:nth-child(even) { background: #fdfdfd; }

    .badge { padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; background: #e2e8f0; }

    .advice-box { background: ${COLORS.accentSoft}; padding: 40px; border-radius: 24px; text-align: center; margin-top: 40px; }
    .advice-box h3 { font-family: 'Playfair Display', serif; margin-bottom: 15px; color: ${COLORS.primary}; }

    .footer { text-align: center; padding: 60px; border-top: 1px solid #edf2f7; font-size: 12px; color: ${COLORS.textLight}; }
    .social-links { display: flex; justify-content: center; gap: 20px; margin-bottom: 20px; }
    .social-links a { color: ${COLORS.primary}; text-decoration: none; font-weight: 600; font-size: 14px; }

    @media print {
      body { background: white; }
      .page { width: 100%; }
      .hero { -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="hero">
        <div class="label" style="text-transform: uppercase; letter-spacing: 2px; font-size: 12px; margin-bottom: 20px; opacity: 0.8;">Planificación Patrimonial</div>
        <h1>Estrategia de Inversión Modelo</h1>
        <p>Propuesta técnica personalizada para <strong>${data.profesion}</strong>. Enfoque en preservación de capital y crecimiento compuesto.</p>

        <div class="hero-stats">
            <div class="stat-item"><div class="label">Fecha</div><div class="value">${fecha}</div></div>
            <div class="stat-item"><div class="label">Perfil</div><div class="value">${data.perfilRiesgo}</div></div>
            <div class="stat-item"><div class="label">Horizonte</div><div class="value">${data.horizonteMeses} Meses</div></div>
        </div>
    </div>

    <div class="content">
        <h2 class="section-title">Resumen de Objetivos</h2>
        <div class="intro-text">
            Basado en nuestra conversación y análisis de perfil, hemos diseñado una hoja de ruta que prioriza la <strong>eficiencia impositiva</strong> y la <strong>diversificación global</strong>. El objetivo es alcanzar una meta proyectada de USD ${metaTotal.toLocaleString()} mediante aportes consistentes.
        </div>

        <div class="grid-4">
            <div class="card-flat"><div class="label">Aporte</div><div class="value">USD ${data.aporteMensual.toLocaleString()}</div></div>
            <div class="card-flat"><div class="label">Meta Final</div><div class="value">USD ${metaTotal.toLocaleString()}</div></div>
            <div class="card-flat"><div class="label">Riesgo</div><div class="value">${data.perfilRiesgo.split('-')[0]}</div></div>
            <div class="card-flat"><div class="label">Edad</div><div class="value">${data.edad} Años</div></div>
        </div>

        <h2 class="section-title">Distribución del Capital</h2>
        <div class="allocation-visual">
            <div class="chart-box">
                <h4 style="font-size: 14px; margin-bottom: 20px; color: ${COLORS.primary};">Asignación por Horizontes</h4>
                ${data.asignacionEstrategica.map(asig => `
                    <div class="progress-group">
                        <div class="progress-label"><span>${asig.horizonte}</span><span>${asig.porcentaje}%</span></div>
                        <div class="progress-bg"><div class="progress-fill" style="width: ${asig.porcentaje}%;"></div></div>
                    </div>
                `).join('')}
            </div>
            <div style="font-size: 14px; color: ${COLORS.textLight}; line-height: 1.6;">
                <p><strong>Visión Estratégica:</strong></p>
                <p style="margin-top: 10px;">${data.objetivo}</p>
                <p style="margin-top: 20px;">Esta distribución asegura liquidez para imprevistos en el corto plazo mientras mantiene exposición a activos de alto crecimiento para el futuro.</p>
            </div>
        </div>

        <h2 class="section-title">Cartera de Instrumentos</h2>
        <div class="portfolio-grid">
            ${data.instruments.map(inst => `
                <div class="portfolio-item">
                    <h4>${inst.nombre}</h4>
                    <div class="meta">
                        <span>${inst.tipo}</span>
                        <span style="font-weight: 700; color: ${COLORS.primary};">${inst.asignacion}%</span>
                    </div>
                    <div style="margin-top: 8px; font-size: 11px; font-style: italic; opacity: 0.8;">${inst.objetivo}</div>
                </div>
            `).join('')}
        </div>

        <h2 class="section-title">Renta Fija Seleccionada (ONs)</h2>
        <table>
            <thead><tr><th>Emisor</th><th>Ticker</th><th>Cupón</th><th>Vencimiento</th><th>Moneda</th></tr></thead>
            <tbody>
                ${data.obligacionesNegociables.map(on => `
                    <tr><td><strong>${on.emisor}</strong></td><td><span class="badge">${on.ticker}</span></td><td>${on.cupon}</td><td>${on.vencimiento}</td><td>${on.moneda}</td></tr>
                `).join('')}
            </tbody>
        </table>

        <h2 class="section-title">Optimización Impositiva</h2>
        <div style="display: grid; gap: 12px; margin-bottom: 50px;">
            ${data.beneficiosFiscales.map(b => `
                <div style="padding: 15px 20px; background: #f0fdf4; border-radius: 12px; border-left: 4px solid #16a34a; font-size: 14px;">${b}</div>
            `).join('')}
        </div>

        <div class="advice-box">
            <h3>Nota del Asesor</h3>
            <p style="font-size: 17px; font-style: italic; opacity: 0.9;">"La disciplina financiera no es una restricción, sino la llave que abre la puerta a tu libertad futura. Este plan es el primer paso."</p>
            <div style="margin-top: 25px; font-weight: 700; color: ${COLORS.primary};">${data.asesorNombre || 'Tu Asesor Financiero'}</div>
        </div>
    </div>

    <div class="footer">
        <div class="social-links">
            ${data.socialLinks?.map(link => `<a href="${link.url}">${link.name}</a>`).join(' • ') || ''}
        </div>
        <p>Propuesta generada exclusivamente para <strong>${data.profesion}</strong> por Cactus Portfolios.</p>
        <p style="margin-top: 10px; opacity: 0.6; font-size: 10px;">Este documento es de carácter técnico e informativo. Los rendimientos pasados no garantizan resultados futuros.</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const data: PlanData = await request.json();
    const html = generateBaseHTML(data);
    return NextResponse.json({ html });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json({ error: 'Error al generar el plan' }, { status: 500 });
  }
}
