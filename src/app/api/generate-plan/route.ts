import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

// ============================================================
// TYPES & INTERFACES
// ============================================================

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

interface AttachedFile {
  name: string;
  type: string;
  data: string;
  size: number;
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
  attachedFiles?: AttachedFile[];
}

// ============================================================
// COLOR PALETTE - MODERN SOFT FANCY
// ============================================================

const COLORS = {
  // Primary - Soft Sage Green
  primaryDark: '#2D5A4A',
  primary: '#3D7A5F',
  primaryLight: '#5A9E7F',
  primaryPale: '#8BC4A8',
  primaryMuted: '#B8DBC8',
  
  // Accent - Warm Terracotta
  accent: '#C4846C',
  accentLight: '#D9A58B',
  accentPale: '#F0DFD5',
  
  // Neutrals - Soft Cream
  background: '#FAFAF8',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F4F0',
  border: '#E8E6E0',
  borderLight: '#F0EEE8',
  
  // Text
  textDark: '#1F2D26',
  textMedium: '#4A5B50',
  textLight: '#7A8B80',
  textMuted: '#A0ACA5',
  
  // Status
  success: '#5A9E7F',
  warning: '#D4A574',
  danger: '#C4746C',
  
  // Social
  instagram: '#E1306C',
  whatsapp: '#25D366',
  
  // Gradients
  gradientPrimary: 'linear-gradient(135deg, #2D5A4A 0%, #3D7A5F 100%)',
  gradientAccent: 'linear-gradient(135deg, #C4846C 0%, #D9A58B 100%)',
  gradientSoft: 'linear-gradient(135deg, #F5F4F0 0%, #FFFFFF 100%)',
};

// ============================================================
// HTML GENERATION FUNCTIONS
// ============================================================

function generateBaseHTML(data: PlanData): string {
  const fecha = new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Plan Financiero - ${data.profesion}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary-dark: ${COLORS.primaryDark};
      --primary: ${COLORS.primary};
      --primary-light: ${COLORS.primaryLight};
      --primary-pale: ${COLORS.primaryPale};
      --primary-muted: ${COLORS.primaryMuted};
      --accent: ${COLORS.accent};
      --accent-light: ${COLORS.accentLight};
      --accent-pale: ${COLORS.accentPale};
      --background: ${COLORS.background};
      --surface: ${COLORS.surface};
      --surface-alt: ${COLORS.surfaceAlt};
      --border: ${COLORS.border};
      --border-light: ${COLORS.borderLight};
      --text-dark: ${COLORS.textDark};
      --text-medium: ${COLORS.textMedium};
      --text-light: ${COLORS.textLight};
      --text-muted: ${COLORS.textMuted};
      --success: ${COLORS.success};
      --warning: ${COLORS.warning};
      --danger: ${COLORS.danger};
      --instagram: ${COLORS.instagram};
      --whatsapp: ${COLORS.whatsapp};
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.7;
      color: var(--text-dark);
      background-color: var(--background);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .container {
      max-width: 880px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    /* ===== HEADER ===== */
    .header {
      background: linear-gradient(145deg, #1F4A3D 0%, #2D5A4A 50%, #3A6B58 100%);
      color: #FFFFFF;
      padding: 52px 44px;
      border-radius: 28px;
      margin-bottom: 32px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(45, 90, 74, 0.25);
    }

    .header::before {
      content: '';
      position: absolute;
      top: -60%;
      right: -25%;
      width: 70%;
      height: 220%;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
      border-radius: 50%;
    }

    .header::after {
      content: '🌵';
      position: absolute;
      bottom: 16px;
      right: 28px;
      font-size: 90px;
      opacity: 0.12;
    }

    .header-content {
      position: relative;
      z-index: 1;
      text-align: center;
    }

    .header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 38px;
      font-weight: 600;
      margin-bottom: 14px;
      letter-spacing: -0.5px;
      color: #FFFFFF;
    }

    .header .subtitle {
      font-size: 18px;
      opacity: 0.92;
      font-weight: 400;
      color: #FFFFFF;
    }

    .header .meta {
      margin-top: 22px;
      font-size: 13px;
      color: rgba(255,255,255,0.85);
      padding: 12px 24px;
      background: rgba(255,255,255,0.12);
      border-radius: 30px;
      display: inline-block;
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255,255,255,0.08);
    }

    /* ===== ACCOUNT SECTION ===== */
    .account-section {
      background: #FFFFFF;
      padding: 34px;
      border-radius: 22px;
      margin-bottom: 28px;
      box-shadow: 0 2px 20px rgba(0,0,0,0.04);
      border: 1px solid #E8E6E0;
    }

    .account-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 18px;
    }

    .account-header .icon {
      font-size: 30px;
    }

    .account-header h2 {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 600;
      color: #1F2D26;
    }

    .account-intro {
      font-size: 15px;
      color: #4A5B50;
      margin-bottom: 26px;
      line-height: 1.75;
    }

    .account-links {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .account-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 30px;
      background: linear-gradient(145deg, #2D5A4A 0%, #3D7A5F 100%);
      color: #FFFFFF;
      text-decoration: none;
      border-radius: 16px;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.2s ease;
      box-shadow: 0 6px 16px rgba(61, 122, 95, 0.3);
    }

    .account-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(61, 122, 95, 0.4);
      background: var(--primary-dark);
    }

    .account-link .link-icon {
      font-size: 18px;
    }

    /* ===== WELCOME SECTION ===== */
    .welcome-section {
      background: #F5F4F0;
      padding: 34px;
      border-radius: 22px;
      margin-bottom: 28px;
      border: 1px solid #E8E6E0;
      position: relative;
    }

    .welcome-section::before {
      content: '';
      position: absolute;
      left: 0;
      top: 24px;
      bottom: 24px;
      width: 4px;
      background: linear-gradient(180deg, #3D7A5F 0%, #5A9E7F 100%);
      border-radius: 4px;
    }

    .welcome-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 18px;
    }

    .welcome-emoji {
      font-size: 40px;
    }

    .welcome-title {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 600;
      color: #1F2D26;
    }

    .welcome-text {
      color: #4A5B50;
      font-size: 15px;
      line-height: 1.8;
    }

    .welcome-list {
      margin-top: 22px;
      padding-left: 0;
      list-style: none;
    }

    .welcome-list li {
      margin-bottom: 14px;
      color: #4A5B50;
      font-size: 14px;
      padding-left: 26px;
      position: relative;
    }

    .welcome-list li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: #3D7A5F;
      font-weight: 600;
    }

    .welcome-list li strong {
      color: #2D5A4A;
    }

    /* ===== RECOMMEND BOX ===== */
    .recommend-box {
      background: linear-gradient(135deg, #F0DFD5 0%, #FDF8F5 100%);
      padding: 26px;
      border-radius: 16px;
      margin: 24px 0;
      display: flex;
      align-items: center;
      gap: 16px;
      border: 1px solid #D9A58B;
    }

    .recommend-box .icon {
      font-size: 28px;
      flex-shrink: 0;
    }

    .recommend-box p {
      font-size: 14px;
      line-height: 1.65;
      color: #4A5B50;
    }

    .recommend-box strong {
      color: #C4846C;
    }

    /* ===== CLIENT CARDS ===== */
    .client-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 18px;
      margin-bottom: 32px;
    }

    .client-card {
      background: #FFFFFF;
      border-radius: 18px;
      padding: 26px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.04);
      border: 1px solid #F0EEE8;
      transition: all 0.2s ease;
    }

    .client-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(0,0,0,0.06);
    }

    .client-card .label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #3D7A5F;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .client-card .value {
      font-size: 24px;
      font-weight: 700;
      color: #1F2D26;
      font-family: 'DM Sans', sans-serif;
    }

    .client-card .value.accent {
      color: #C4846C;
    }

    /* ===== SECTION ===== */
    .section {
      background: #FFFFFF;
      border-radius: 22px;
      padding: 40px;
      margin-bottom: 28px;
      box-shadow: 0 2px 20px rgba(0,0,0,0.04);
      border: 1px solid #F0EEE8;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 30px;
      padding-bottom: 22px;
      border-bottom: 1px solid #F0EEE8;
    }

    .section-icon {
      width: 52px;
      height: 52px;
      background: linear-gradient(145deg, #2D5A4A 0%, #3D7A5F 50%, #5A9E7F 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      box-shadow: 0 6px 16px rgba(61, 122, 95, 0.25);
    }

    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 600;
      color: #1F2D26;
      letter-spacing: -0.3px;
    }

    .section-subtitle {
      font-size: 14px;
      color: #7A8B80;
      margin-top: 5px;
    }

    /* ===== OBJETIVO BOX ===== */
    .objetivo-box {
      background: linear-gradient(135deg, #F5F4F0 0%, #FFFFFF 100%);
      padding: 30px;
      border-radius: 18px;
      margin-bottom: 26px;
      border-left: 4px solid #C4846C;
      box-shadow: 0 2px 12px rgba(0,0,0,0.02);
    }

    .objetivo-box h3 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: #7A8B80;
      margin-bottom: 12px;
      font-weight: 600;
    }

    .objetivo-box .objetivo-text {
      font-size: 19px;
      font-weight: 500;
      color: #1F2D26;
      margin-bottom: 22px;
      line-height: 1.55;
    }

    .objetivo-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      margin-top: 22px;
    }

    .objetivo-meta-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .objetivo-meta-item .label {
      font-size: 13px;
      color: #7A8B80;
    }

    .objetivo-meta-item .value {
      font-size: 15px;
      font-weight: 600;
      color: #C4846C;
    }

    /* ===== INFO BOX ===== */
    .info-box {
      background: #F5F4F0;
      padding: 20px 24px;
      border-radius: 14px;
      margin: 22px 0;
      color: #4A5B50;
      font-size: 14px;
      line-height: 1.75;
      border: 1px solid #E8E6E0;
    }

    .info-box strong {
      color: #2D5A4A;
    }

    /* ===== TABLES ===== */
    .table-container {
      overflow-x: auto;
      margin: 20px 0;
      border-radius: 16px;
      border: 1px solid #E8E6E0;
      box-shadow: 0 2px 12px rgba(0,0,0,0.03);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    th {
      background: linear-gradient(135deg, #2D5A4A 0%, #3A6B58 100%);
      color: #FFFFFF;
      font-weight: 600;
      padding: 16px 20px;
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    th:first-child {
      border-radius: 15px 0 0 0;
    }

    th:last-child {
      border-radius: 0 15px 0 0;
    }

    td {
      padding: 16px 20px;
      border-bottom: 1px solid #F0EEE8;
      vertical-align: middle;
      color: #4A5B50;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:nth-child(even) {
      background: #FAFAF8;
    }

    tr:hover {
      background: rgba(61, 122, 95, 0.04);
    }

    /* ===== BADGES ===== */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .badge-bajo {
      background: rgba(90, 158, 127, 0.12);
      color: var(--primary-dark);
    }

    .badge-medio {
      background: rgba(212, 165, 116, 0.15);
      color: #A67C4A;
    }

    .badge-alto {
      background: rgba(196, 116, 108, 0.12);
      color: #A65D55;
    }

    .badge-moneda {
      background: var(--surface-alt);
      color: var(--text-dark);
      border: 1px solid var(--border);
    }

    /* ===== PROGRESS BARS ===== */
    .progress-container {
      margin: 20px 0;
    }

    .progress-item {
      margin-bottom: 16px;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
      color: var(--text-medium);
    }

    .progress-header strong {
      color: var(--text-dark);
    }

    .progress-bar {
      height: 10px;
      background: var(--surface-alt);
      border-radius: 5px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 5px;
      transition: width 0.3s ease;
      background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
    }

    /* ===== CARDS GRID ===== */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin: 20px 0;
    }

    .instrument-card {
      background: var(--surface-alt);
      border-radius: 14px;
      padding: 20px;
      border: 1px solid var(--border-light);
      transition: all 0.2s ease;
    }

    .instrument-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
    }

    .instrument-card .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      background: none;
      padding: 0;
      box-shadow: none;
      border-radius: 0;
    }

    .instrument-card .name {
      font-weight: 600;
      color: var(--text-dark);
      font-size: 15px;
    }

    .instrument-card .type {
      font-size: 13px;
      color: var(--text-light);
      margin-bottom: 12px;
    }

    .instrument-card .allocation {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .instrument-card .allocation-bar {
      flex: 1;
      height: 8px;
      background: var(--border);
      border-radius: 4px;
      overflow: hidden;
    }

    .instrument-card .allocation-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 4px;
    }

    .instrument-card .allocation-value {
      font-weight: 600;
      color: var(--primary-dark);
      min-width: 40px;
      text-align: right;
      font-size: 14px;
    }

    .instrument-card .objetivo {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 10px;
    }

    /* ===== RESUMEN CARTERA ===== */
    .resumen-cartera {
      background: linear-gradient(145deg, #1F4A3D 0%, #2D5A4A 50%, #3A6B58 100%);
      color: #FFFFFF;
      padding: 32px;
      border-radius: 20px;
      margin-top: 32px;
      box-shadow: 0 8px 32px rgba(45, 90, 74, 0.2);
    }

    .resumen-cartera h4 {
      font-size: 16px;
      margin-bottom: 24px;
      font-weight: 600;
      letter-spacing: 0.3px;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .resumen-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .resumen-item {
      text-align: center;
      padding: 16px;
      background: rgba(255,255,255,0.08);
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.06);
    }

    .resumen-item .label {
      font-size: 11px;
      opacity: 0.85;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .resumen-item .value {
      font-size: 26px;
      font-weight: 700;
      color: #FFFFFF;
    }

    /* ===== DEFINITION BOX ===== */
    .definition-box {
      background: #F5F4F0;
      padding: 26px;
      border-radius: 16px;
      margin: 26px 0;
      border-left: 4px solid #3D7A5F;
    }

    .definition-box .term {
      font-weight: 600;
      color: #2D5A4A;
      margin-bottom: 12px;
      display: block;
      font-size: 14px;
    }

    .definition-box .definition {
      color: #4A5B50;
      font-size: 14px;
      line-height: 1.75;
    }

    /* ===== BENEFICIOS LIST ===== */
    .beneficios-list {
      list-style: none;
      padding: 0;
    }

    .beneficios-list li {
      padding: 20px 24px;
      margin-bottom: 14px;
      background: #F5F4F0;
      border-radius: 14px;
      border-left: 3px solid #5A9E7F;
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    .beneficios-list li .icon {
      font-size: 18px;
      flex-shrink: 0;
      color: var(--primary);
    }

    .beneficios-list li .content {
      flex: 1;
      font-size: 14px;
      color: var(--text-medium);
      line-height: 1.6;
    }

    .beneficios-list li strong {
      color: var(--text-dark);
    }

    /* ===== CONSEJO BOX ===== */
    .consejo-box {
      background: linear-gradient(145deg, #B8765A 0%, #C4846C 40%, #D99A7B 100%);
      color: #FFFFFF;
      padding: 44px 48px;
      border-radius: 24px;
      text-align: center;
      margin-top: 32px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(196, 132, 108, 0.35);
    }

    .consejo-box::before {
      content: '"';
      position: absolute;
      top: -15px;
      left: 18px;
      font-size: 130px;
      opacity: 0.06;
      font-family: 'Playfair Display', serif;
      line-height: 1;
      color: #FFFFFF;
    }

    .consejo-box::after {
      content: '"';
      position: absolute;
      bottom: -50px;
      right: 18px;
      font-size: 130px;
      opacity: 0.06;
      font-family: 'Playfair Display', serif;
      line-height: 1;
      color: #FFFFFF;
    }

    .consejo-box h4 {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #FFFFFF;
      letter-spacing: -0.3px;
      position: relative;
      z-index: 2;
    }

    .consejo-box p {
      font-size: 17px;
      line-height: 1.8;
      color: #FFFFFF;
      opacity: 0.98;
      position: relative;
      z-index: 2;
      max-width: 92%;
      margin: 0 auto;
    }

    .consejo-box .consejo-footer {
      margin-top: 24px;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.92);
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.28);
      font-style: italic;
      position: relative;
      z-index: 2;
    }

    .consejo-box .consejo-footer::before {
      content: '📌 ';
      font-style: normal;
    }

    /* ===== FOOTER WITH LINKS ===== */
    .footer {
      background: #FFFFFF;
      border-radius: 24px;
      padding: 40px;
      margin-top: 40px;
      border: 1px solid #E8E6E0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    }

    .footer-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .footer-header h4 {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      color: #1F2D26;
      margin-bottom: 10px;
    }

    .footer-header p {
      font-size: 14px;
      color: #7A8B80;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 28px;
    }

    .footer-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 32px;
      background: linear-gradient(145deg, #2D5A4A 0%, #3A6B58 100%);
      color: #FFFFFF;
      text-decoration: none;
      border-radius: 16px;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s ease;
      box-shadow: 0 6px 16px rgba(45, 90, 74, 0.3);
    }

    .footer-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(45, 90, 74, 0.4);
    }

    .footer-link .icon {
      font-size: 18px;
    }

    .footer-link.instagram {
      background: linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%);
      box-shadow: 0 6px 16px rgba(225, 48, 108, 0.35);
    }

    .footer-link.instagram:hover {
      box-shadow: 0 8px 24px rgba(225, 48, 108, 0.45);
    }

    .footer-link.whatsapp {
      background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
      box-shadow: 0 6px 16px rgba(37, 211, 102, 0.35);
    }

    .footer-link.whatsapp:hover {
      box-shadow: 0 8px 24px rgba(37, 211, 102, 0.45);
    }

    .footer-disclaimer {
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
      padding-top: 20px;
      border-top: 1px solid var(--border-light);
      line-height: 1.6;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
      .container {
        padding: 20px 16px;
      }
      .header {
        padding: 32px 24px;
      }
      .header h1 {
        font-size: 28px;
      }
      .section {
        padding: 24px;
      }
      .client-cards {
        grid-template-columns: 1fr 1fr;
      }
      .resumen-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .objetivo-meta {
        flex-direction: column;
        gap: 12px;
      }
      .footer-links {
        flex-direction: column;
        align-items: stretch;
      }
      .account-links {
        flex-direction: column;
      }
      .recommend-box {
        flex-direction: column;
        text-align: center;
      }
    }

    /* ===== ATTACHMENTS SECTION ===== */
    .attachments-section {
      background: var(--surface);
      border-radius: 20px;
      padding: 36px;
      margin-bottom: 24px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.04);
      border: 1px solid var(--border-light);
    }

    .attachments-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-light);
    }

    .attachments-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }

    .attachments-title {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 600;
      color: var(--text-dark);
    }

    .attachments-subtitle {
      font-size: 14px;
      color: var(--text-light);
      margin-top: 4px;
    }

    .attachment-card {
      background: var(--surface-alt);
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 16px;
      border: 1px solid var(--border-light);
    }

    .attachment-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .attachment-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .attachment-icon {
      width: 40px;
      height: 40px;
      background: var(--accent);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .attachment-name {
      font-weight: 600;
      color: var(--text-dark);
      font-size: 15px;
    }

    .attachment-size {
      font-size: 12px;
      color: var(--text-light);
      margin-top: 2px;
    }

    .attachment-download {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
      color: white;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 500;
      font-size: 13px;
      transition: all 0.2s ease;
    }

    .attachment-download:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(45, 90, 74, 0.3);
    }

    .attachment-preview {
      margin-top: 16px;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid var(--border);
    }

    .attachment-preview iframe {
      width: 100%;
      height: 300px;
      border: none;
    }

    /* ===== ANIMATIONS ===== */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .section {
      animation: fadeIn 0.4s ease-out;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-content">
        <h1>Tu Plan Financiero</h1>
        <div class="subtitle">${data.profesion} | ${data.edad} años | Perfil ${data.perfilRiesgo}</div>
        <div class="meta">Generado el ${fecha}</div>
      </div>
    </div>`;
}

function generateAccountSection(data: PlanData): string {
  const platformLinks = data.platformLinks || [
    { name: 'Cocos Capital', url: 'https://cocos.capital', icon: 'link' as const },
    { name: 'Balanz', url: 'https://balanz.com', icon: 'link' as const },
  ];

  const linksHTML = platformLinks.map(link => `
    <a href="${link.url}" target="_blank" class="account-link">
      <span class="link-icon">🔗</span>
      ${link.name}
    </a>`).join('');

  return `
    <!-- Account Section -->
    <div class="account-section">
      <div class="account-header">
        <span class="icon">🔐</span>
        <h2>Asegurate de tener tu cuenta</h2>
      </div>
      <p class="account-intro">
        Antes de empezar a invertir, necesitas tener una cuenta en una plataforma habilitada. 
        Estas son las plataformas recomendadas para ejecutar tu plan:
      </p>
      <div class="account-links">
        ${linksHTML}
      </div>
    </div>`;
}

function generateClientCards(data: PlanData): string {
  const metaCalculada = data.aporteMensual * data.horizonteMeses;

  return `
    <div class="client-cards">
      <div class="client-card">
        <div class="label">Edad</div>
        <div class="value">${data.edad} años</div>
      </div>
      <div class="client-card">
        <div class="label">Aporte Mensual</div>
        <div class="value">USD ${data.aporteMensual.toLocaleString()}</div>
      </div>
      <div class="client-card">
        <div class="label">Horizonte</div>
        <div class="value">${data.horizonteMeses} meses</div>
      </div>
      <div class="client-card">
        <div class="label">Meta Financiera</div>
        <div class="value accent">USD ${metaCalculada.toLocaleString()}</div>
      </div>
    </div>`;
}

function generateWelcomeSection(data: PlanData): string {
  return `
    <!-- Sección de Bienvenida -->
    <div class="welcome-section">
      <div class="welcome-header">
        <span class="welcome-emoji">👋</span>
        <h2 class="welcome-title">Bienvenido a tu Hoja de Ruta</h2>
      </div>
      <p class="welcome-text">
        Este documento es tu <strong>guía personalizada</strong> para alcanzar tus objetivos financieros. 
        Aquí encontrarás una estrategia diseñada específicamente para vos, considerando tu edad, 
        perfil de riesgo y metas a ${data.horizonteMeses} meses.
      </p>
      <ul class="welcome-list">
        <li><strong>Que incluye este plan:</strong> Una cartera diversificada, beneficios fiscales y una estrategia clara.</li>
        <li><strong>Como usarlo:</strong> Revisá cada sección, anotá tus dudas y consultá con tu asesor.</li>
        <li><strong>Que esperar:</strong> Este plan está pensado para crecer con vos, ajustalo según cambien tus necesidades.</li>
      </ul>
    </div>`;
}

function generateRecommendBox(data: PlanData): string {
  if (!data.asesorRecomendacion) return '';
  
  const asesorName = data.asesorNombre || 'tu asesor';
  
  return `
    <div class="recommend-box">
      <span class="icon">💬</span>
      <p>
        <strong>Te gustó este plan?</strong> Si tenés amigos o familiares que podrían beneficiarse de una planificación financiera, 
        no dudes en recomendar a <strong>${asesorName}</strong>. Las referencias son la mejor forma de agradecer!
      </p>
    </div>`;
}

function generateSection1(data: PlanData, aiContent: string): string {
  const metaCalculada = data.aporteMensual * data.horizonteMeses;

  return `
    <!-- Sección 1: Estrategia Principal -->
    <div class="section">
      <div class="section-header">
        <div class="section-icon">🏦</div>
        <div>
          <h2 class="section-title">Tu Estrategia Principal</h2>
          <p class="section-subtitle">El punto de partida de tu camino financiero</p>
        </div>
      </div>

      <div class="objetivo-box">
        <h3>🎯 Tu Objetivo</h3>
        <p class="objetivo-text">${data.objetivo}</p>
        <div class="objetivo-meta">
          <div class="objetivo-meta-item">
            <span class="label">Meta financiera:</span>
            <span class="value">USD ${metaCalculada.toLocaleString()}</span>
          </div>
          <div class="objetivo-meta-item">
            <span class="label">Horizonte:</span>
            <span class="value">${data.horizonteMeses} meses</span>
          </div>
          <div class="objetivo-meta-item">
            <span class="label">Aporte mensual:</span>
            <span class="value">USD ${data.aporteMensual.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div class="info-box">
        💡 <strong>Por qué esta estrategia:</strong> Basado en tu perfil <strong>${data.perfilRiesgo}</strong>, 
        diseñamos una cartera que balancea crecimiento y protección. Tu edad de ${data.edad} años 
        te permite aprovechar el poder del interés compuesto a largo plazo.
      </div>

      <div class="definition-box">
        <span class="term">📚 Término Clave del Mes</span>
        <p class="definition">${aiContent}</p>
      </div>
      
      ${generateRecommendBox(data)}
    </div>`;
}

function generateSection2(data: PlanData): string {
  const rows = data.asignacionEstrategica.map(asig => `
          <tr>
            <td><strong>${asig.horizonte}</strong></td>
            <td>${asig.porcentaje}%</td>
            <td>${asig.sector}</td>
            <td>${asig.objetivo}</td>
          </tr>`).join('');

  const progressBars = data.asignacionEstrategica.map(asig => `
    <div class="progress-item">
      <div class="progress-header">
        <span>${asig.horizonte}</span>
        <span><strong>${asig.porcentaje}%</strong></span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${asig.porcentaje}%"></div>
      </div>
      <p style="font-size: 12px; color: var(--text-muted); margin-top: 6px;">${asig.sector} - ${asig.objetivo}</p>
    </div>`).join('');

  return `
    <!-- Sección 2: Asignación Estratégica -->
    <div class="section">
      <div class="section-header">
        <div class="section-icon">📊</div>
        <div>
          <h2 class="section-title">Tu Asignación Estratégica</h2>
          <p class="section-subtitle">Cómo distribuir tus inversiones según el horizonte temporal</p>
        </div>
      </div>

      <div class="info-box">
        💡 <strong>Qué significa esto:</strong> No todo tu dinero debe estar invertido igual. 
        Dividimos tu cartera en "horizontes" según cuándo podrías necesitar cada parte. 
        El <strong>corto plazo</strong> es para tu fondo de emergencia, el <strong>largo plazo</strong> busca crecimiento.
      </div>

      <div class="table-container">
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
${rows}
          </tbody>
        </table>
      </div>

      <div class="progress-container">
        <h4 style="font-size: 14px; color: var(--text-dark); margin-bottom: 16px; font-weight: 600;">📈 Distribución Visual</h4>
${progressBars}
      </div>
    </div>`;
}

function generateSection3(data: PlanData): string {
  const instruments = data.instruments || [];
  const total = instruments.reduce((sum, i) => sum + i.asignacion, 0);

  const instrumentCards = instruments.map(inst => `
    <div class="instrument-card">
      <div class="header">
        <span class="name">${inst.nombre}</span>
        <span class="badge badge-moneda">${inst.moneda}</span>
      </div>
      <p class="type">${inst.tipo}</p>
      <div class="allocation">
        <div class="allocation-bar">
          <div class="allocation-fill" style="width: ${(inst.asignacion / total) * 100}%"></div>
        </div>
        <span class="allocation-value">${inst.asignacion}%</span>
      </div>
      <p class="objetivo">${inst.objetivo}</p>
    </div>`).join('');

  const exposicionUSD = instruments.filter(i => i.moneda.includes('USD')).reduce((sum, i) => sum + i.asignacion, 0);
  const exposicionARS = instruments.filter(i => i.moneda === 'ARS').reduce((sum, i) => sum + i.asignacion, 0);
  const rentaFija = instruments.filter(i => !i.tipo.includes('ETF') && !i.tipo.includes('Acción')).reduce((sum, i) => sum + i.asignacion, 0);
  const rentaVariable = instruments.filter(i => i.tipo.includes('ETF') || i.tipo.includes('Acción')).reduce((sum, i) => sum + i.asignacion, 0);

  return `
    <!-- Sección 3: Cartera Sugerida -->
    <div class="section">
      <div class="section-header">
        <div class="section-icon">🧱</div>
        <div>
          <h2 class="section-title">Tu Cartera de Inversiones</h2>
          <p class="section-subtitle">Los instrumentos específicos que recomendamos</p>
        </div>
      </div>

      <div class="info-box">
        💡 <strong>Cómo leer esto:</strong> Cada tarjeta representa un instrumento financiero. 
        El porcentaje indica cuánto de tu cartera debería estar ahí. 
        <strong>USD</strong> significa que está en dólares, <strong>ARS</strong> en pesos.
      </div>

      <div class="cards-grid">
${instrumentCards}
      </div>

      <div class="resumen-cartera">
        <h4>📈 Resumen de tu Cartera</h4>
        <div class="resumen-grid">
          <div class="resumen-item">
            <div class="label">Exposición USD</div>
            <div class="value">${exposicionUSD}%</div>
          </div>
          <div class="resumen-item">
            <div class="label">Exposición ARS</div>
            <div class="value">${exposicionARS}%</div>
          </div>
          <div class="resumen-item">
            <div class="label">Mixto</div>
            <div class="value">${100 - exposicionUSD - exposicionARS}%</div>
          </div>
        </div>
        <div class="resumen-grid" style="margin-top: 16px;">
          <div class="resumen-item">
            <div class="label">Renta Fija</div>
            <div class="value">${rentaFija}%</div>
          </div>
          <div class="resumen-item">
            <div class="label">Renta Variable</div>
            <div class="value">${rentaVariable}%</div>
          </div>
          <div class="resumen-item">
            <div class="label">Liquidez</div>
            <div class="value">24-48hs</div>
          </div>
        </div>
      </div>
    </div>`;
}

function generateSection4(data: PlanData): string {
  const ons = data.obligacionesNegociables || [];
  const rows = ons.map(on => `
          <tr>
            <td><strong>${on.emisor}</strong></td>
            <td>${on.cupon}</td>
            <td>${on.vencimiento}</td>
            <td><span class="badge badge-moneda">${on.ticker}</span></td>
            <td><span class="badge badge-moneda">${on.moneda}</span></td>
            <td>${on.pago}</td>
          </tr>`).join('');

  return `
    <!-- Sección 4: ONs en USD -->
    <div class="section">
      <div class="section-header">
        <div class="section-icon">🏷️</div>
        <div>
          <h2 class="section-title">Obligaciones Negociables en USD</h2>
          <p class="section-subtitle">Renta fija corporativa en dólares</p>
        </div>
      </div>

      <div class="info-box">
        💡 <strong>Qué son las ONs:</strong> Son préstamos que le hacés a empresas grandes. 
        Ellas te pagan intereses (cupón) y te devuelven el capital al vencimiento. 
        Es una forma de <strong>ahorrar en dólares con renta</strong>.
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Emisor</th>
              <th>Cupón</th>
              <th>Vencimiento</th>
              <th>Ticker</th>
              <th>Moneda</th>
              <th>Pago</th>
            </tr>
          </thead>
          <tbody>
${rows}
          </tbody>
        </table>
      </div>

      <div class="definition-box">
        <span class="term">📌 Consejo Práctico</span>
        <p class="definition">Para invertir en ONs necesitás una cuenta comitente en BYMA. Podés operarlas a través de tu agente de bolsa o ALyC. Las ONs en USD son ideales para dolarizar carteras con renta fija.</p>
      </div>
    </div>`;
}

function generateSection5(data: PlanData): string {
  const beneficios = data.beneficiosFiscales || [];
  const items = beneficios.map((beneficio) => `
    <li>
      <span class="icon">✓</span>
      <div class="content">${beneficio}</div>
    </li>`).join('');

  return `
    <!-- Sección 5: Beneficio Fiscal -->
    <div class="section">
      <div class="section-header">
        <div class="section-icon">🧾</div>
        <div>
          <h2 class="section-title">Beneficios Fiscales</h2>
          <p class="section-subtitle">Cómo optimizar tus impuestos en Argentina</p>
        </div>
      </div>

      <div class="info-box">
        💡 <strong>Por qué importa esto:</strong> Invertir inteligentemente no solo genera ganancias, 
        sino que también puede <strong>reducir tu carga impositiva</strong>. Estos son los beneficios 
        fiscales que podés aprovechar con esta cartera.
      </div>

      <ul class="beneficios-list">
${items}
      </ul>
      
      ${generateRecommendBox(data)}
    </div>`;
}

function generateAttachmentsSection(data: PlanData): string {
  const files = data.attachedFiles || [];
  
  if (files.length === 0) return '';
  
  const attachmentsHTML = files.map((file, index) => `
    <div class="attachment-card">
      <div class="attachment-header">
        <div class="attachment-info">
          <div class="attachment-icon">📄</div>
          <div>
            <div class="attachment-name">${file.name}</div>
            <div class="attachment-size">${(file.size / 1024).toFixed(1)} KB</div>
          </div>
        </div>
        <a href="${file.data}" download="${file.name}" class="attachment-download">
          📥 Descargar PDF
        </a>
      </div>
      <div class="attachment-preview">
        <iframe src="${file.data}" title="${file.name}"></iframe>
      </div>
    </div>`).join('');

  return `
    <!-- Documentos Adjuntos -->
    <div class="attachments-section">
      <div class="attachments-header">
        <div class="attachments-icon">📎</div>
        <div>
          <h2 class="attachments-title">Documentos Adjuntos</h2>
          <p class="attachments-subtitle">Archivos PDF incluidos en tu plan financiero</p>
        </div>
      </div>
      ${attachmentsHTML}
    </div>`;
}

function generateFooter(data: PlanData): string {
  const socialLinks = data.socialLinks || [
    { name: 'Instagram', url: 'https://instagram.com/tu_usuario', icon: 'instagram' as const },
    { name: 'WhatsApp', url: 'https://wa.me/5491112345678', icon: 'whatsapp' as const },
  ];

  const socialLinksHTML = socialLinks.map(link => {
    const iconClass = link.icon === 'instagram' ? 'instagram' : 'whatsapp';
    const icon = link.icon === 'instagram' ? '📸' : '💬';
    return `
    <a href="${link.url}" target="_blank" class="footer-link ${iconClass}">
      <span class="icon">${icon}</span>
      ${link.name}
    </a>`;
  }).join('');

  const asesorName = data.asesorNombre || 'tu asesor';
  const recommendText = data.asesorRecomendacion ? `
    <div class="recommend-box" style="margin-bottom: 24px;">
      <span class="icon">🌟</span>
      <p>
        Si este plan te pareció útil, <strong>compartilo</strong> Recomendá a <strong>${asesorName}</strong> con amigos y familiares. 
        Las referencias nos ayudan a seguir creciendo y llevando planificación financiera a más personas.
      </p>
    </div>` : '';

  return `
    <!-- Footer con Links -->
    <div class="footer">
      <div class="footer-header">
        <h4>📞 Contactá a tu Asesor</h4>
        <p>Seguime en redes para tips financieros</p>
      </div>
      
      ${recommendText}
      
      <div class="footer-links">
        ${socialLinksHTML}
      </div>
      <div class="footer-disclaimer">
        <p>Plan financiero generado el ${new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p style="margin-top: 8px;">Este documento es orientativo y no constituye asesoramiento financiero personalizado. Consultá con un profesional antes de tomar decisiones de inversión.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateSection6(data: PlanData, aiAdvice: string): string {
  const riesgos = data.riesgos || [];
  const rows = riesgos.map(r => {
    let badgeClass = 'badge-medio';
    if (r.nivel === 'Bajo') badgeClass = 'badge-bajo';
    if (r.nivel === 'Alto') badgeClass = 'badge-alto';

    return `
          <tr>
            <td><strong>${r.riesgo}</strong></td>
            <td><span class="badge ${badgeClass}">${r.nivel}</span></td>
            <td>${r.mitigacion}</td>
          </tr>`;
  }).join('');

  return `
    <!-- Sección 6: Riesgos y Mitigación -->
    <div class="section">
      <div class="section-header">
        <div class="section-icon">📚</div>
        <div>
          <h2 class="section-title">Riesgos y Mitigación</h2>
          <p class="section-subtitle">Conocer los riesgos es el primer paso para gestionarlos</p>
        </div>
      </div>

      <div class="info-box">
        💡 <strong>Por qué hablamos de riesgos:</strong> Toda inversión tiene riesgos, pero saber cuáles son 
        nos permite <strong>mitigarlos inteligentemente</strong>. No se trata de evitar riesgos, sino de 
        gestionarlos de forma consciente.
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Riesgo</th>
              <th>Nivel</th>
              <th>Estrategia de Mitigación</th>
            </tr>
          </thead>
          <tbody>
${rows}
          </tbody>
        </table>
      </div>

      <div class="consejo-box">
        <h4>💡 Consejo de tu Asesor</h4>
        <p>${aiAdvice}</p>
        <div class="consejo-footer">Recordá revisar tu plan cada 6 meses para ajustarlo según tus necesidades cambiantes.</div>
      </div>
    </div>`;
}

// ============================================================
// MAIN API HANDLER
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const data: PlanData = await request.json();

    // Generate AI content for term and advice
    let aiTermContent = data.terminoFinanciero;
    let aiAdviceContent = data.consejoFinal;

    if (data.usarTerminoIA || !aiTermContent) {
      try {
        const zai = await ZAI.create();
        const termResponse = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'Sos un experto en finanzas del mercado argentino. Explicá un término financiero relevante de forma simple y práctica en 2-3 oraciones. Respondé solo con la explicación, sin título ni formato adicional.'
            },
            {
              role: 'user',
              content: `Explicá brevemente un término financiero útil para un inversor de ${data.edad} años con perfil ${data.perfilRiesgo} en Argentina.`
            }
          ],
        });
        aiTermContent = termResponse.choices[0]?.message?.content || 'El interés compuesto es cuando tus ganancias generan más ganancias. Es como una bola de nieve que crece con el tiempo. En Argentina, empezarlo joven es una gran ventaja.';
      } catch (error) {
        console.error('Error generating AI term:', error);
        aiTermContent = 'El interés compuesto es cuando tus ganancias generan más ganancias. Es como una bola de nieve que crece con el tiempo. En Argentina, empezarlo joven es una gran ventaja.';
      }
    }

    if (data.usarConsejoIA || !aiAdviceContent) {
      try {
        const zai = await ZAI.create();
        const adviceResponse = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'Sos un asesor financiero experto en el mercado argentino. Dale un consejo práctico y motivador en 2-3 oraciones. Respondé solo con el consejo.'
            },
            {
              role: 'user',
              content: `Dale un consejo final a un cliente de ${data.edad} años con perfil ${data.perfilRiesgo} que está empezando a invertir en Argentina.`
            }
          ],
        });
        aiAdviceContent = adviceResponse.choices[0]?.message?.content || 'Empezar a invertir joven es la mejor decisión financiera que podés tomar. No busques la perfección, buscá la consistencia. Con tiempo y disciplina, incluso aportes pequeños pueden crecer significativamente.';
      } catch (error) {
        console.error('Error generating AI advice:', error);
        aiAdviceContent = 'Empezar a invertir joven es la mejor decisión financiera que podés tomar. No busques la perfección, buscá la consistencia. Con tiempo y disciplina, incluso aportes pequeños pueden crecer significativamente.';
      }
    }

    // Build HTML
    const html = `
${generateBaseHTML(data)}
${generateAccountSection(data)}
${generateWelcomeSection(data)}
${generateClientCards(data)}
${generateSection1(data, aiTermContent || '')}
${generateSection2(data)}
${generateSection3(data)}
${generateSection4(data)}
${generateSection5(data)}
${generateSection6(data, aiAdviceContent || '')}
${generateAttachmentsSection(data)}
${generateFooter(data)}
`;

    return NextResponse.json({ html });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'Error al generar el plan financiero' },
      { status: 500 }
    );
  }
}
