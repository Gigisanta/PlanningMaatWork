import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { usePortfolioStore } from '@/stores/portfolio-store'

let _mockStorage: Record<string, string> = {};
globalThis.localStorage = {
  getItem: (key: string) => _mockStorage[key] || null,
  setItem: (key: string, value: any) => { _mockStorage[key] = value.toString() },
  removeItem: (key: string) => { delete _mockStorage[key] },
  clear: () => { _mockStorage = {} },
  length: 0,
  key: (n: number) => null
};

describe('Zustand Store Integration Tests', () => {
  beforeEach(() => {
    globalThis.localStorage.clear()
    usePortfolioStore.persistHydration = false
  })
  
  afterEach(() => {
    globalThis.localStorage.clear()
    usePortfolioStore.persistHydration = true
  })

  describe('Store Initialization', () => {
    it('should initialize with default values', () => {
      const state = usePortfolioStore.getState()
      expect(state.edad).toBe(30)
      expect(state.profesion).toBe('')
      expect(state.objetivo).toBe('')
      expect(state.perfilRiesgo).toBe('Moderado')
      expect(state.ingresosMensuales).toBe(5000)
      expect(state.gastosMensuales).toBe(3000)
      expect(state.fondoEmergenciaMeses).toBe(3)
      expect(state.fondoEmergenciaActual).toBe(0)
      expect(state.metasVida).toEqual([])
      expect(state.proyeccionRetiro).toBe('65')
      expect(state.patrimonioActivos).toBe(0)
      expect(state.patrimonioDeudas).toBe(0)

      expect(state.wizardStep).toBe(0)
      expect(state.activeSection).toBe('cliente')
      expect(state.instruments).toEqual([])
      expect(state.asignacionEstrategica).toEqual([])

      // Branding
      expect(state.colorPrincipal).toBeUndefined()
      expect(state.colorAcento).toBeUndefined()
      expect(state.logoUrl).toBeUndefined()
    })
  })

  describe('Store Actions', () => {
    it('should update state via actions', () => {
      usePortfolioStore.getState().setEdad(40)
      expect(usePortfolioStore.getState().edad).toBe(40)

      usePortfolioStore.getState().setProfesion('Arquitecto')
      expect(usePortfolioStore.getState().profesion).toBe('Arquitecto')

      usePortfolioStore.getState().setWizardStep(1)
      expect(usePortfolioStore.getState().wizardStep).toBe(1)

      usePortfolioStore.getState().setColorPrincipal('#ff0000')
      expect(usePortfolioStore.getState().colorPrincipal).toBe('#ff0000')

      usePortfolioStore.getState().setLogoUrl('https://example.com/logo.png')
      expect(usePortfolioStore.getState().logoUrl).toBe('https://example.com/logo.png')
    })
  })

  describe('State Persistence', () => {
    it('should save to localStorage', () => {
      usePortfolioStore.getState().setEdad(45)
      usePortfolioStore.getState().setColorPrincipal('#123456')
      usePortfolioStore.getState().saveToLocalStorage()

      const loaded = localStorage.getItem('cactus-plan-config')
      expect(loaded).toBeDefined()
      const parsed = JSON.parse(loaded!)
      expect(parsed.edad).toBe(45)
      expect(parsed.colorPrincipal).toBe('#123456')
    })

    it('should load from localStorage', () => {
      localStorage.setItem('cactus-plan-config', JSON.stringify({
        edad: 50,
        colorAcento: '#654321'
      }))

      usePortfolioStore.getState().loadFromLocalStorage()
      expect(usePortfolioStore.getState().edad).toBe(50)
      expect(usePortfolioStore.getState().colorAcento).toBe('#654321')
    })
    
    it('should reset config', () => {
      usePortfolioStore.getState().setEdad(50)
      usePortfolioStore.getState().setColorPrincipal('#ff0000')

      usePortfolioStore.getState().resetConfig()
      expect(usePortfolioStore.getState().edad).toBe(30)
      expect(usePortfolioStore.getState().colorPrincipal).toBeUndefined()
    })
  })
})
