// Paleta de colores CACTUS
const COLORS = {
  cactusDark: '#2D5A3D',
  cactusMedium: '#4A7C59',
  cactusLight: '#6B9B7A',
  sandLight: '#F5F0E8',
  sandMedium: '#E8DFD0',
  sandDark: '#D4C5A9',
  terracotta: '#C17F59',
  white: '#FFFFFF',
  text: '#333333',
};

export interface PlanData {
  edad: number;
  profesion: string;
  objetivo: string;
  aporteMensual: number;
  perfilRiesgo: string;
  horizonteMeses: number;
  gastosPrincipales: string;
  observaciones?: string;
}

export function generatePlanHTML(data: PlanData): string {
  const fecha = new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const montoObjetivo = data.aporteMensual * data.horizonteMeses;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plan Financiero Personal - ${data.profesion}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: ${COLORS.text};
      background-color: ${COLORS.sandLight};
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, ${COLORS.cactusDark}, ${COLORS.cactusMedium});
      color: white;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header .subtitle {
      font-size: 16px;
      opacity: 0.9;
    }
    .header .meta {
      margin-top: 15px;
      font-size: 14px;
      opacity: 0.8;
    }
    .section {
      background: white;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 25px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border-left: 4px solid ${COLORS.cactusMedium};
    }
    .section-title {
      font-size: 20px;
      color: ${COLORS.cactusDark};
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid ${COLORS.sandMedium};
    }
    .objetivo-box {
      background: linear-gradient(135deg, ${COLORS.sandLight}, ${COLORS.sandMedium});
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
      border-left: 4px solid ${COLORS.terracotta};
    }
    .objetivo-box h3 {
      color: ${COLORS.cactusDark};
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid ${COLORS.sandDark};
    }
    th {
      background-color: ${COLORS.cactusDark};
      color: white;
      font-weight: 600;
    }
    tr:nth-child(even) {
      background-color: ${COLORS.sandMedium};
    }
    tr:hover {
      background-color: ${COLORS.sandLight};
    }
    ul {
      margin: 15px 0;
      padding-left: 25px;
    }
    li {
      margin-bottom: 10px;
    }
    .instrument-badge {
      display: inline-block;
      background: ${COLORS.cactusLight};
      color: white;
      padding: 3px 10px;
      border-radius: 15px;
      font-size: 12px;
      margin-left: 5px;
    }
    .definition-box {
      background: ${COLORS.sandLight};
      padding: 15px 20px;
      border-radius: 8px;
      margin: 15px 0;
      font-style: italic;
      border-left: 3px solid ${COLORS.cactusMedium};
    }
    .resumen-cartera {
      background: linear-gradient(135deg, ${COLORS.cactusDark}, ${COLORS.cactusMedium});
      color: white;
      padding: 20px;
      border-radius: 10px;
      margin-top: 20px;
    }
    .consejo-box {
      background: linear-gradient(135deg, ${COLORS.terracotta}, #D4956B);
      color: white;
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      margin-top: 20px;
    }
    .consejo-box h4 {
      font-size: 18px;
      margin-bottom: 10px;
    }
    .badge-conservador { background: ${COLORS.cactusLight}; }
    .badge-moderado { background: ${COLORS.cactusMedium}; }
    .badge-agresivo { background: ${COLORS.terracotta}; }
    .footer {
      text-align: center;
      padding: 20px;
      color: ${COLORS.cactusMedium};
      font-size: 12px;
      border-top: 1px solid ${COLORS.sandDark};
      margin-top: 30px;
    }
    .highlight {
      color: ${COLORS.terracotta};
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Plan Financiero Personal</h1>
      <div class="subtitle">${data.profesion} | ${data.edad} años | Perfil ${data.perfilRiesgo}</div>
      <div class="meta">Generado el ${fecha}</div>
    </div>

    <!-- Sección 1: Estrategia Principal -->
    <div class="section">
      <h2 class="section-title">🏦 Estrategia Principal</h2>
      
      <div class="objetivo-box">
        <h3>Objetivo Inicial</h3>
        <p><strong>${data.objetivo}</strong></p>
        <p style="margin-top: 10px;">
          Meta financiera: <span class="highlight">USD ${montoObjetivo.toLocaleString()}</span> 
          en <span class="highlight">${data.horizonteMeses} meses</span> 
          con aportes mensuales de <span class="highlight">USD ${data.aporteMensual.toLocaleString()}</span>
        </p>
      </div>

      <h4 style="color: ${COLORS.cactusMedium}; margin-bottom: 15px;">Instrumentos Recomendados</h4>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Liquidez</th>
            <th>Riesgo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Balanz Ahorro USD</td>
            <td>Fondo Común de Inversión</td>
            <td>24-48 hs</td>
            <td><span class="instrument-badge badge-conservador">Bajo</span></td>
          </tr>
          <tr>
            <td>FCI Dólar Linked</td>
            <td>Fondo Común de Inversión</td>
            <td>24-48 hs</td>
            <td><span class="instrument-badge badge-conservador">Bajo-Medio</span></td>
          </tr>
          <tr>
            <td>FCI CER</td>
            <td>Fondo Común de Inversión</td>
            <td>24-48 hs</td>
            <td><span class="instrument-badge badge-moderado">Medio</span></td>
          </tr>
          <tr>
            <td>Cauciones Bursátiles</td>
            <td>Instrumento de Renta Fija</td>
            <td>1-7 días</td>
            <td><span class="instrument-badge badge-conservador">Bajo</span></td>
          </tr>
          <tr>
            <td>CEDEARs (ETFs USA)</td>
            <td>Renta Variable Internacional</td>
            <td>48 hs (T+2)</td>
            <td><span class="instrument-badge badge-agresivo">Medio-Alto</span></td>
          </tr>
        </tbody>
      </table>

      <div class="definition-box">
        <strong>💡 Término clave:</strong> <strong>Dólar MEP</strong> - Es la cotización del dólar obtenida mediante operaciones bursátiles en Argentina. Permite acceder a dólares financieros de forma legal, operando con bonos o CEDEARs. Es ideal para inversores que buscan dolarizar sus ahorros sin restricciones.
      </div>
    </div>

    <!-- Sección 2: Asignación Estratégica -->
    <div class="section">
      <h2 class="section-title">📊 Asignación Estratégica</h2>
      
      <table>
        <thead>
          <tr>
            <th>Horizonte</th>
            <th>% Cartera</th>
            <th>Sector</th>
            <th>Objetivo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Corto (0-12m)</td>
            <td>40%</td>
            <td>Liquidez y Renta Fija</td>
            <td>Fondo de emergencia + preservación</td>
          </tr>
          <tr>
            <td>Medio (12-24m)</td>
            <td>35%</td>
            <td>Renta Fija Indexada</td>
            <td>Protección inflacionaria</td>
          </tr>
          <tr>
            <td>Largo (24-36m)</td>
            <td>20%</td>
            <td>Renta Variable</td>
            <td>Crecimiento de capital</td>
          </tr>
          <tr>
            <td>Estratégico</td>
            <td>5%</td>
            <td>Oportunidades</td>
            <td>Flexibilidad táctica</td>
          </tr>
        </tbody>
      </table>

      <ul>
        <li><strong>Liquidez y Renta Fija (40%):</strong> Fondos de dinero y cauciones para disponibilidad inmediata. Prioriza seguridad y liquidez sobre rentabilidad. Ideal para el fondo de emergencia.</li>
        <li><strong>Renta Fija Indexada (35%):</strong> Instrumentos atados a CER (inflación) o dólar. Protege el poder adquisitivo a mediano plazo. Menor volatilidad que renta variable.</li>
        <li><strong>Renta Variable (20%):</strong> CEDEARs de ETFs diversificados (SPY, QQQ). Mayor potencial de crecimiento. Volatilidad esperada pero con horizonte de inversión largo.</li>
        <li><strong>Oportunidades (5%):</strong> Reserva táctica para aprovechar oportunidades de mercado. Flexibilidad ante movimientos inesperados.</li>
      </ul>
    </div>

    <!-- Sección 3: Cartera Sugerida -->
    <div class="section">
      <h2 class="section-title">🧱 Cartera Sugerida</h2>
      
      <table>
        <thead>
          <tr>
            <th>Instrumento</th>
            <th>Tipo</th>
            <th>Asignación</th>
            <th>Moneda</th>
            <th>Objetivo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Balanz Ahorro USD</td>
            <td>FCI Money Market</td>
            <td>25%</td>
            <td>USD</td>
            <td>Liquidez inmediata</td>
          </tr>
          <tr>
            <td>FCI Dólar Linked</td>
            <td>FCI Renta Fija</td>
            <td>15%</td>
            <td>USD</td>
            <td>Protección cambiaria</td>
          </tr>
          <tr>
            <td>FCI CER</td>
            <td>FCI Indexado</td>
            <td>20%</td>
            <td>ARS</td>
            <td>Cobertura inflación</td>
          </tr>
          <tr>
            <td>Cauciones</td>
            <td>Renta Fija Corto</td>
            <td>15%</td>
            <td>ARS/USD</td>
            <td>Rentabilidad corta</td>
          </tr>
          <tr>
            <td>CEDEAR SPY (S&P500)</td>
            <td>ETF Internacional</td>
            <td>10%</td>
            <td>USD</td>
            <td>Diversificación global</td>
          </tr>
          <tr>
            <td>CEDEAR QQQ (Nasdaq100)</td>
            <td>ETF Tecnología</td>
            <td>10%</td>
            <td>USD</td>
            <td>Crecimiento tech</td>
          </tr>
          <tr>
            <td>CEDEAR KO (Coca-Cola)</td>
            <td>Acción Dividendos</td>
            <td>5%</td>
            <td>USD</td>
            <td>Ingreso pasivo</td>
          </tr>
        </tbody>
      </table>

      <div class="resumen-cartera">
        <h4 style="margin-bottom: 10px;">📈 Resumen de la Cartera</h4>
        <p><strong>Exposición USD:</strong> 65% | <strong>Exposición ARS:</strong> 35%</p>
        <p style="margin-top: 5px;"><strong>Renta Fija:</strong> 75% | <strong>Renta Variable:</strong> 25%</p>
        <p style="margin-top: 5px;"><strong>Liquidez promedio:</strong> 24-48 horas</p>
      </div>
    </div>

    <!-- Sección 4: ONs en USD -->
    <div class="section">
      <h2 class="section-title">🏷️ Obligaciones Negociables en USD</h2>
      
      <p style="margin-bottom: 15px;">Instrumentos de renta fija corporativa en dólares para inversores con perfil ${data.perfilRiesgo}:</p>
      
      <table>
        <thead>
          <tr>
            <th>Emisor</th>
            <th>Cupón</th>
            <th>Vencimiento</th>
            <th>ISIN</th>
            <th>Moneda</th>
            <th>Pago</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>YPF S.A.</td>
            <td>7.50%</td>
            <td>2027</td>
            <td>ARSEYP7D2800</td>
            <td>USD</td>
            <td>Semestral</td>
          </tr>
          <tr>
            <td>Pampa Energía</td>
            <td>6.875%</td>
            <td>2028</td>
            <td>USG9184LAW19</td>
            <td>USD</td>
            <td>Semestral</td>
          </tr>
          <tr>
            <td>Central Puerto</td>
            <td>6.50%</td>
            <td>2027</td>
            <td>ARGENT8P2705</td>
            <td>USD</td>
            <td>Semestral</td>
          </tr>
          <tr>
            <td>TGS (Transportadora)</td>
            <td>7.00%</td>
            <td>2028</td>
            <td>US87264AAS68</td>
            <td>USD</td>
            <td>Semestral</td>
          </tr>
          <tr>
            <td>IRSA Inversiones</td>
            <td>7.25%</td>
            <td>2026</td>
            <td>US44982LAA67</td>
            <td>USD</td>
            <td>Semestral</td>
          </tr>
        </tbody>
      </table>

      <div class="definition-box">
        <strong>💡 Nota:</strong> Las ONs en USD son una excelente alternativa para dolarizar carteras con renta fija. Ofrecen cupones regulares y capital en moneda dura. Requieren cuenta comitente en BYMA.
      </div>
    </div>

    <!-- Sección 5: Beneficio Fiscal -->
    <div class="section">
      <h2 class="section-title">🧾 Beneficio Fiscal Argentina</h2>
      
      <ul>
        <li><strong>FCI sin impuesto a la ganancia:</strong> Los fondos comunes de inversión no tributan impuesto a las ganancias mientras los fondos permanezcan invertidos. Solo se tributa al rescate.</li>
        <li><strong>Exención hasta $9.8M ARS:</strong> Los primeros $9,808,275 ARS de ganancias anuales están exentos de impuesto a las ganancias (2024). Monto actualizado anualmente por inflación.</li>
        <li><strong>CEDEARs y Bienes Personales:</strong> Los CEDEARs están exentos del impuesto a los Bienes Personales. Ideal para planificación patrimonial de largo plazo.</li>
        <li><strong>Cauciones y percepción:</strong> Las cauciones en USD vía MEP no tienen percepción de impuestos. Liquidez eficiente sin costos fiscales adicionales.</li>
        <li><strong>Blanqueo fiscal 2024:</strong> Oportunidad de regularizar activos con beneficios fiscales excepcionales. Consultar con contador para casos específicos.</li>
      </ul>
    </div>

    <!-- Sección 6: Educación y Riesgos -->
    <div class="section">
      <h2 class="section-title">📚 Educación y Riesgos</h2>
      
      <h4 style="color: ${COLORS.cactusMedium}; margin-bottom: 15px;">Riesgos Identificados y Mitigación</h4>
      
      <table>
        <thead>
          <tr>
            <th>Riesgo</th>
            <th>Nivel</th>
            <th>Mitigación</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Riesgo Cambiario</td>
            <td><span class="instrument-badge badge-moderado">Medio</span></td>
            <td>Diversificación USD/ARS, uso de dólar MEP</td>
          </tr>
          <tr>
            <td>Riesgo Inflacionario</td>
            <td><span class="instrument-badge badge-agresivo">Alto</span></td>
            <td>FCI CER, activos atados a inflación</td>
          </tr>
          <tr>
            <td>Riesgo de Mercado</td>
            <td><span class="instrument-badge badge-moderado">Medio</span></td>
            <td>Horizonte de inversión de ${data.horizonteMeses} meses, diversificación</td>
          </tr>
          <tr>
            <td>Riesgo de Liquidez</td>
            <td><span class="instrument-badge badge-conservador">Bajo</span></td>
            <td>Instrumentos con liquidez 24-48hs, fondo de emergencia</td>
          </tr>
          <tr>
            <td>Riesgo Político/Económico</td>
            <td><span class="instrument-badge badge-moderado">Medio</span></td>
            <td>Exposición internacional vía CEDEARs, diversificación geográfica</td>
          </tr>
        </tbody>
      </table>

      <div class="consejo-box">
        <h4>🎯 Consejo Final</h4>
        <p style="font-size: 16px; margin-top: 10px;">
          A tus ${data.edad} años y con un perfil <strong>${data.perfilRiesgo}</strong>, tienes la ventaja del tiempo. 
          La constancia en los aportes de USD ${data.aporteMensual}/mes durante ${data.horizonteMeses} meses te permitirá 
          construir un patrimonio sólido. Recuerda: <em>el mejor momento para empezar fue ayer, el segundo mejor momento es hoy.</em>
        </p>
        <p style="margin-top: 15px; font-size: 14px; opacity: 0.9;">
          Gastos principales identificados: ${data.gastosPrincipales}
        </p>
        ${data.observaciones ? `<p style="margin-top: 10px; font-size: 14px; opacity: 0.9;">Notas adicionales: ${data.observaciones}</p>` : ''}
      </div>
    </div>

    <div class="footer">
      <p>Plan financiero generado automáticamente | ${fecha}</p>
      <p>Este documento es orientativo y no constituye asesoramiento financiero personalizado.</p>
    </div>
  </div>
</body>
</html>`;
}
