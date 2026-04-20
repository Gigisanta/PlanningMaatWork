import { expect, test } from "bun:test";
import { generatePlanHTML } from "../generatePlan";

test("generatePlanHTML should correctly calculate portfolio summaries", () => {
  const data = {
    edad: 30,
    profesion: "Developer",
    objetivo: "Retirement",
    aporteMensual: 500,
    perfilRiesgo: "Agresivo",
    horizonteMeses: 120,
    gastosPrincipales: "Rent",
    instruments: [
      { nombre: "S&P 500", tipo: "Equity - Index", asignacion: 60, moneda: "USD", objetivo: "Growth", locked: false },
      { nombre: "Bono ARS", tipo: "Renta Fija - Soberano", asignacion: 30, moneda: "ARS", objetivo: "Income", locked: false },
      { nombre: "FCI Mixto", tipo: "Renta Mixta", asignacion: 10, moneda: "Mix", objetivo: "Diversification", locked: false }
    ]
  };

  const html = generatePlanHTML(data as any);

  // Check Exposición USD (60%)
  expect(html).toContain('<div class="value">60%</div>');

  // Check Exposición ARS (30%)
  expect(html).toContain('<div class="value">30%</div>');

  // Check Mixto (10%)
  expect(html).toContain('<div class="value">10%</div>');

  // Check Renta Fija (30%)
  expect(html).toContain('<div class="value">30%</div>');

  // Check Renta Variable (Equity) (60%)
  expect(html).toContain('<div class="value">60%</div>');
});