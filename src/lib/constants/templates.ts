// ============================================================
// PLANTILLAS OFICIALES
// ============================================================

export interface Template {
  id: string;
  name: string;
  description: string;
  riskProfile: PerfilRiesgo;
  icon: any;
  strategicAllocation: {
    short: number;
    medium: number;
    long: number;
    strategic: number;
  };
  instruments: Instrument[];
}

export const OFFICIAL_TEMPLATES: Template[] = [
  {
    id: "conservador",
    name: "Conservador (Renta Fija USD)",
    description: "Enfocado en preservación de capital y renta en dólares.",
    riskProfile: "Conservador",
    icon: "ShieldCheck",
    strategicAllocation: { short: 40, medium: 40, long: 15, strategic: 5 },
    instruments: [
      { nombre: "ON YPF 2026", tipo: "Corporativo USD", asignacion: 25, moneda: "USD", objetivo: "Renta segura 7%" },
      { nombre: "ON Pampa 2026", tipo: "Corporativo USD", asignacion: 25, moneda: "USD", objetivo: "Baja volatilidad" },
      { nombre: "ON Pan American Energy", tipo: "Corporativo USD", asignacion: 20, moneda: "USD", objetivo: "Preservación" },
      { nombre: "BOPREAL Serie 3", tipo: "Soberano USD", asignacion: 30, moneda: "USD", objetivo: "Renta y liquidez" }
    ]
  },
  {
    id: "moderado",
    name: "Moderado (Equilibrado)",
    description: "Balance entre renta fija y crecimiento moderado.",
    riskProfile: "Moderado",
    icon: "Briefcase",
    strategicAllocation: { short: 20, medium: 50, long: 25, strategic: 5 },
    instruments: [
      { nombre: "ON YPF 2027", tipo: "Corporativo USD", asignacion: 20, moneda: "USD", objetivo: "Renta 8%" },
      { nombre: "ON Pampa 2026", tipo: "Corporativo USD", asignacion: 20, moneda: "USD", objetivo: "Estabilidad" },
      { nombre: "CEDEAR SPY", tipo: "Equity Internacional", asignacion: 30, moneda: "USD", objetivo: "Crecimiento LP" }
    ]
  },
  {
    id: "agresivo",
    name: "Agresivo (Alto Retorno)",
    description: "Máxima exposición a growth con aceptación de volatilidad más alta.",
    riskProfile: "Agresivo",
    icon: "Zap",
    strategicAllocation: { short: 10, medium: 30, long: 50, strategic: 10 },
    instruments: [
      { nombre: "ON YPF 2028", tipo: "Corporativo USD", asignacion: 10, moneda: "USD", objetivo: "Alpha Generation" },
      { nombre: "ON Pampa 2028", tipo: "Corporativo USD", asignacion: 10, moneda: "USD", objetivo: "Tech Growth" },
      { nombre: "ON AMZN", tipo: "Corporativo USD", asignacion: 20, moneda: "USD", objetivo: "Growth" },
      { nombre: "ON Pampa 2026", tipo: "Corporativo USD", asignacion: 20, moneda: "USD", objetivo: "Alpha Generation" }
    ]
  }
]
