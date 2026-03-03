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
  ingresosMensuales: number;
  gastosMensuales: number;
  fondoEmergenciaMeses: number;
  fondoEmergenciaActual: number;
  metasVida: any[];
  proyeccionRetiro: string;
  patrimonioActivos: number;
  patrimonioDeudas: number;
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
  usd: '#2D5A4A',
  ars: '#C4846C',
};

function generateBaseHTML(data: PlanData): string {
  const fecha = new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const metaTotal = data.aporteMensual * data.horizonteMeses;

  const totalUSD = data.instruments.filter(i => i.moneda.includes('USD')).reduce((s, i) => s + i.asignacion, 0);
  const totalARS = data.instruments.filter(i => i.moneda === 'ARS').reduce((s, i) => s + i.asignacion, 0);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Planificación Patrimonial - ${data.profesion}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #fff; color: ${COLORS.text}; line-height: 1.5; -webkit-print-color-adjust: exact; }
    .page { width: 850px; margin: 0 auto; background: #fff; position: relative; }

    /* Header / Hero */
    .hero { background: ${COLORS.primary}; color: #fff; padding: 120px 80px 80px; position: relative; overflow: hidden; }
    .hero-bg { position: absolute; top: -50%; right: -10%; width: 600px; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%); transform: rotate(-15deg); }
    .hero .brand { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; color: ${COLORS.accentSoft}; margin-bottom: 30px; display: block; }
    .hero h1 { font-family: 'Playfair Display', serif; font-size: 52px; line-height: 1.1; margin-bottom: 24px; }
    .hero .subtitle { font-size: 20px; font-weight: 400; opacity: 0.8; max-width: 550px; margin-bottom: 50px; }

    .hero-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.15); }
    .meta-item .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.6; margin-bottom: 8px; }
    .meta-item .value { font-size: 18px; font-weight: 600; }

    /* Content Layout */
    .content { padding: 80px; }
    section { margin-bottom: 80px; }
    .section-header { display: flex; align-items: baseline; gap: 20px; margin-bottom: 40px; }
    .section-header .num { font-family: 'Playfair Display', serif; font-size: 40px; color: ${COLORS.accent}; opacity: 0.3; }
    .section-header h2 { font-family: 'Playfair Display', serif; font-size: 32px; color: ${COLORS.primary}; }

    /* Summary Cards */
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 60px; }
    .summary-card { background: ${COLORS.bg}; padding: 24px; border-radius: 16px; border: 1px solid ${COLORS.border}; }
    .summary-card .label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: ${COLORS.textLight}; margin-bottom: 12px; }
    .summary-card .value { font-size: 20px; font-weight: 800; color: ${COLORS.primary}; }

    /* Allocation Visuals */
    .allocation-box { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
    .chart-container { background: #fff; padding: 30px; border-radius: 24px; border: 1px solid ${COLORS.border}; box-shadow: 0 20px 40px rgba(0,0,0,0.03); }
    .bar-item { margin-bottom: 24px; }
    .bar-info { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; font-weight: 600; }
    .bar-bg { height: 10px; background: #F1F5F9; border-radius: 5px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 5px; transition: width 1s ease; }

    /* Portfolio Grid */
    .portfolio-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .inst-card { padding: 24px; border-radius: 20px; background: #fff; border: 1px solid ${COLORS.border}; position: relative; transition: transform 0.2s; }
    .inst-card:hover { border-color: ${COLORS.accent}; }
    .inst-card .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .inst-card .weight { font-size: 24px; font-weight: 900; color: ${COLORS.primary}; }
    .inst-card .currency { font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; background: ${COLORS.bg}; }
    .inst-card h4 { font-size: 16px; font-weight: 700; margin-bottom: 6px; color: ${COLORS.primary}; }
    .inst-card .type { font-size: 12px; color: ${COLORS.textLight}; font-weight: 500; margin-bottom: 12px; }
    .inst-card .goal { font-size: 11px; line-height: 1.4; color: ${COLORS.textLight}; font-style: italic; border-top: 1px solid ${COLORS.border}; padding-top: 12px; }

    /* ON Table */
    .table-container { border-radius: 20px; overflow: hidden; border: 1px solid ${COLORS.border}; background: #fff; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 20px; background: ${COLORS.primary}; color: #fff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; }
    td { padding: 20px; border-bottom: 1px solid ${COLORS.border}; font-size: 14px; }
    tr:last-child td { border-bottom: none; }
    .ticker { font-weight: 800; color: ${COLORS.primary}; background: ${COLORS.accentSoft}; padding: 4px 8px; border-radius: 4px; font-size: 12px; }

    /* Tax Box */
    .tax-grid { display: grid; gap: 16px; }
    .tax-item { display: flex; gap: 20px; padding: 24px; background: #F0FDF4; border-radius: 20px; border: 1px solid #DCFCE7; }
    .tax-icon { width: 40px; height: 40px; background: #BBF7D0; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #166534; font-weight: 800; flex-shrink: 0; }

    /* Footer */
    .executive-advice { background: ${COLORS.primary}; border-radius: 32px; padding: 60px; color: #fff; text-align: center; margin-top: 60px; position: relative; overflow: hidden; }
    .executive-advice blockquote { font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; margin-bottom: 30px; position: relative; z-index: 1; }
    .executive-advice .author { font-size: 16px; font-weight: 700; color: ${COLORS.accentSoft}; letter-spacing: 2px; text-transform: uppercase; }

    .footer-links { text-align: center; padding: 80px 0; border-top: 1px solid ${COLORS.border}; margin-top: 100px; }
    .socials { display: flex; justify-content: center; gap: 30px; margin-bottom: 24px; }
    .socials a { color: ${COLORS.primary}; text-decoration: none; font-weight: 700; font-size: 14px; }
    .disclaimer { font-size: 10px; color: ${COLORS.textLight}; max-width: 600px; margin: 40px auto 0; opacity: 0.6; line-height: 1.6; }

    @page { size: A4; margin: 0; }
  </style>
</head>
<body>
  <div class="page">
    <div class="hero">
        <div class="hero-bg"></div>
        <span class="brand">Cactus Executive</span>
        <h1>Estrategia de Inversión y Planificación Patrimonial</h1>
        <div class="subtitle">Análisis técnico y propuesta de asignación de activos diseñada específicamente para su perfil profesional.</div>

        <div class="hero-meta">
            <div class="meta-item"><div class="label">Preparado para</div><div class="value">${data.profesion}</div></div>
            <div class="meta-item"><div class="label">Perfil de Riesgo</div><div class="value">${data.perfilRiesgo}</div></div>
            <div class="meta-item"><div class="label">Fecha de Emisión</div><div class="value">${fecha}</div></div>
        </div>
    </div>

    <div class="content">
        <section>
            <div class="section-header">
                <div class="num">01</div>
                <h2>Salud Financiera y Patrimonio</h2>
            </div>
            <div class="summary-grid" style="grid-template-cols: repeat(2, 1fr); margin-bottom: 30px;">
                <div class="summary-card">
                    <div class="label">Ingresos Mensuales</div>
                    <div class="value">USD ${data.ingresosMensuales?.toLocaleString() || '0'}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Gastos Mensuales</div>
                    <div class="value">USD ${data.gastosMensuales?.toLocaleString() || '0'}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Fondo de Emergencia Actual</div>
                    <div class="value">USD ${data.fondoEmergenciaActual?.toLocaleString() || '0'}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Objetivo de Fondo</div>
                    <div class="value">USD ${(data.gastosMensuales * data.fondoEmergenciaMeses).toLocaleString()}</div>
                </div>
            </div>

            <div style="background: ${COLORS.accentSoft}; padding: 30px; border-radius: 24px; border: 1px solid ${COLORS.accent}; margin-bottom: 40px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="margin: 0; color: ${COLORS.primary}; font-size: 14px; text-transform: uppercase;">Patrimonio Neto Proyectado</h4>
                        <p style="margin: 5px 0 0; font-size: 12px; color: ${COLORS.textLight};">Diferencia entre activos líquidos y deudas</p>
                    </div>
                    <div style="font-size: 32px; font-weight: 900; color: ${COLORS.primary};">
                        USD ${(data.patrimonioActivos - data.patrimonioDeudas).toLocaleString()}
                    </div>
                </div>
            </div>
        </section>

        <section>
            <div class="section-header">
                <div class="num">02</div>
                <h2>Objetivos de Vida y Retiro</h2>
            </div>
            <div style="display: grid; gap: 20px; margin-bottom: 40px;">
                ${data.metasVida?.map(meta => `
                    <div style="background: #fff; padding: 24px; border-radius: 20px; border: 1px solid ${COLORS.border}; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h4 style="margin: 0; font-size: 16px; color: ${COLORS.primary};">${meta.descripcion}</h4>
                            <p style="margin: 5px 0 0; font-size: 12px; color: ${COLORS.textLight};">Plazo: ${meta.plazo} meses</p>
                        </div>
                        <div style="font-size: 18px; font-weight: 800; color: ${COLORS.accent};">USD ${meta.monto.toLocaleString()}</div>
                    </div>
                `).join('')}
            </div>
            ${data.proyeccionRetiro ? `
                <div style="padding: 30px; background: #F8FAFC; border-radius: 24px; border-left: 5px solid ${COLORS.primary};">
                    <h4 style="margin: 0 0 15px; font-size: 14px; text-transform: uppercase; color: ${COLORS.primary};">Proyección de Retiro / Fondos Especiales</h4>
                    <div style="font-size: 15px; line-height: 1.6; color: ${COLORS.textLight}; white-space: pre-wrap;">${data.proyeccionRetiro}</div>
                </div>
            ` : ''}
        </section>
        <section>
            <div class="summary-grid">
                <div class="summary-card"><div class="label">Aporte Mensual</div><div class="value">USD ${data.aporteMensual.toLocaleString()}</div></div>
                <div class="summary-card"><div class="label">Horizonte</div><div class="value">${data.horizonteMeses} Meses</div></div>
                <div class="summary-card"><div class="label">Meta Proyectada</div><div class="value">USD ${metaTotal.toLocaleString()}</div></div>
                <div class="summary-card"><div class="label">Edad Actual</div><div class="value">${data.edad} Años</div></div>
            </div>

            <div class="section-header">
                <div class="num">03</div>
                <h2>Visión Estratégica</h2>
            </div>
            <div style="font-size: 17px; line-height: 1.8; color: ${COLORS.textLight}; margin-bottom: 50px;">
                El presente plan ha sido estructurado bajo criterios de <strong>modern portfolio theory</strong>, buscando maximizar el retorno esperado para un nivel de riesgo moderado. Priorizamos la exposición a moneda dura (USD) para proteger el poder adquisitivo de largo plazo, complementado con instrumentos de renta fija local para optimizar la liquidez de corto plazo.
            </div>

            <div class="allocation-box">
                <div class="chart-container">
                    <h4 style="margin-bottom: 24px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: ${COLORS.primary};">Asignación por Horizontes</h4>
                    ${data.asignacionEstrategica.map((asig, idx) => `
                        <div class="bar-item">
                            <div class="bar-info"><span>${asig.horizonte}</span><span>${asig.porcentaje}%</span></div>
                            <div class="bar-bg"><div class="bar-fill" style="width: ${asig.porcentaje}%; background: ${idx === 0 ? COLORS.accent : COLORS.primaryLight};"></div></div>
                        </div>
                    `).join('')}
                </div>
                <div class="chart-container">
                    <h4 style="margin-bottom: 24px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: ${COLORS.primary};">Exposición por Moneda</h4>
                    <div class="bar-item">
                        <div class="bar-info"><span>Dólares (USD)</span><span>${totalUSD}%</span></div>
                        <div class="bar-bg"><div class="bar-fill" style="width: ${totalUSD}%; background: ${COLORS.usd};"></div></div>
                    </div>
                    <div class="bar-item">
                        <div class="bar-info"><span>Pesos (ARS)</span><span>${totalARS}%</span></div>
                        <div class="bar-bg"><div class="bar-fill" style="width: ${totalARS}%; background: ${COLORS.ars};"></div></div>
                    </div>
                    <p style="font-size: 12px; color: ${COLORS.textLight}; margin-top: 20px; line-height: 1.6; font-style: italic;">
                        Su portafolio presenta una fuerte inclinación hacia la dolarización (${totalUSD}%), alineada con los objetivos de preservación de valor real.
                    </p>
                </div>
            </div>
        </section>

        <section>
            <div class="section-header">
                <div class="num">04</div>
                <h2>Arquitectura de Cartera</h2>
            </div>
            <div class="portfolio-grid">
                ${data.instruments.map(inst => `
                    <div class="inst-card">
                        <div class="header">
                            <div class="weight">${inst.asignacion}%</div>
                            <div class="currency">${inst.moneda}</div>
                        </div>
                        <h4>${inst.nombre}</h4>
                        <div class="type">${inst.tipo}</div>
                        <div class="goal">${inst.objetivo}</div>
                    </div>
                `).join('')}
            </div>
        </section>

        <section>
            <div class="section-header">
                <div class="num">05</div>
                <h2>Renta Fija Corporativa (ONs)</h2>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Emisor</th>
                            <th>Ticker</th>
                            <th>Cupón</th>
                            <th>Vencimiento</th>
                            <th>Frecuencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.obligacionesNegociables.map(on => `
                            <tr>
                                <td><strong>${on.emisor}</strong></td>
                                <td><span class="ticker">${on.ticker}</span></td>
                                <td style="font-weight: 700;">${on.cupon}</td>
                                <td>${on.vencimiento}</td>
                                <td>${on.pago}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>

        <section>
            <div class="section-header">
                <div class="num">06</div>
                <h2>Eficiencia Fiscal</h2>
            </div>
            <div class="tax-grid">
                ${data.beneficiosFiscales.map((b, i) => `
                    <div class="tax-item">
                        <div class="tax-icon">${i+1}</div>
                        <div style="font-size: 15px; font-weight: 500; color: #166534; line-height: 1.5;">${b}</div>
                    </div>
                `).join('')}
            </div>
        </section>

        <div class="executive-advice">
            <blockquote>"La paciencia y la disciplina son los mayores activos de un inversor exitoso. Este plan es el mapa, pero su constancia es el motor."</blockquote>
            <div class="author">${data.asesorNombre || 'Consultoría Cactus'}</div>
        </div>

        <div class="footer-links">
            <div class="socials">
                ${data.socialLinks?.map(link => `<a href="${link.url}">${link.name}</a>`).join('') || ''}
            </div>
            <p style="font-weight: 700; color: ${COLORS.primary};">www.cactusportfolios.com</p>
            <div class="disclaimer">
                AVISO LEGAL: El presente documento constituye una propuesta técnica basada en la información proporcionada. Los instrumentos financieros mencionados conllevan riesgos de mercado, crédito y liquidez. Rendimientos pasados no garantizan resultados futuros. Se recomienda la consulta continua con su asesor financiero.
            </div>
        </div>
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
