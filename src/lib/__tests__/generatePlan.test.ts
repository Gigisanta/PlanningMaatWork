import { test, expect, describe } from "bun:test";
import { generatePlanHTML, PlanData } from "../generatePlan";
import { Instrument } from "@/stores/portfolio-store";

describe("generatePlanHTML Performance", () => {
    test("baseline generation time", () => {
        const instruments: Instrument[] = Array(1000).fill(null).map((_, i) => ({
            id: `inst-${i}`,
            nombre: `Instrumento ${i}`,
            tipo: i % 2 === 0 ? "Renta Fija" : "Equity",
            moneda: i % 3 === 0 ? "USD" : i % 3 === 1 ? "ARS" : "Mix",
            asignacion: 0.1,
            objetivo: "test",
        }));

        const data: PlanData = {
            edad: 30,
            profesion: "Test",
            objetivo: "Test",
            aporteMensual: 1000,
            perfilRiesgo: "Moderado",
            horizonteMeses: 12,
            gastosPrincipales: "Test",
            instruments,
        };

        const start = performance.now();
        for (let i = 0; i < 100; i++) {
            generatePlanHTML(data);
        }
        const end = performance.now();
        const duration = end - start;
        console.log(`Baseline generation time (1000 instruments, 100 iterations): ${duration.toFixed(2)}ms`);
        expect(duration).toBeGreaterThan(0);
    });
});
