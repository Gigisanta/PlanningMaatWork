import { PortfolioPreview } from '@/components/portfolio/PortfolioPreview'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import { usePortfolioStore } from '@/stores/portfolio-store'

// ============================================================
// SETUP: Mock localStorage
// ============================================================

const mockLocalStorage = {
  getItem: (key: string) => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  },
  setItem: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key)
  },
}

// ============================================================
// TESTS: ZUSTAND STORE
// ============================================================

describe('Zustand Store Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    mockLocalStorage.clear()
    usePortfolioStore.persistHydration = false
  })
  
  afterEach(() => {
    mockLocalStorage.clear()
    usePortfolioStore.persistHydration = true
  })
})

describe('Store Initialization', () => {
  it('should initialize with default values', () => {
    const state = usePortfolioStore.getState()
    
    expect(state.edad).toBe(30)
    expect(state.profesion).toBe('')
    expect(state.objetivo).toBe('Fondo de emergencia')
    expect(state.perfilRiesgo).toBe('Moderado')
    expect(state.ingresosMensuales).toBe(5000)
    expect(state.gastosMensuales).toBe(3000)
    expect(state.fondoEmergenciaMeses).toBe(6)
    expect(state.fondoEmergenciaActual).toBe(0)
    expect(state.patrimonioActivos).toBe(0)
    expect(state.patrimonioDeudas).toBe(0)
    expect(state.metasVida).toEqual([])
    expect(state.proyeccionRetiro).toBe('65')
    expect(state.wizardStep).toBe(0)
    expect(state.activeSection).toBe('cliente')
  })
  
  it('should load from localStorage', () => {
    usePortfolioStore.loadFromLocalStorage()
    
    const state = usePortfolioStore.getState()
    expect(state.edad).toBeDefined()
    expect(state.ingresosMensuales).toBeDefined()
    expect(state.gastosMensuales).toBeDefined()
    expect(state.fondoEmergenciaMeses).toBeDefined()
    expect(state.fondoEmergenciaActual).toBeDefined()
    expect(state.patrimonioActivos).toBeDefined()
    expect(state.patrimonioDeudas).toBeDefined()
    expect(state.metasVida).toBeDefined()
    expect(state.proyeccionRetiro).toBeDefined()
    expect(state.gastosPrincipales).toBeDefined()
    expect(state.observaciones).toBeDefined()
    expect(state.terminoFinanciero).toBeDefined()
    expect(state.usarTerminoIA).toBe(false)
    expect(state.consejoFinal).toBeDefined()
    expect(state.usarConsejoIA).toBe(false)
    expect(state.webUrl).toBeUndefined()
    expect(state.tipoAporte).toBeDefined()
    expect(state.asesorNombre).toBeUndefined()
    expect(state.asesorRecomendacion).toBe(false)
    expect(state.platformLinks).toBeUndefined()
    expect(state.socialLinks).toBeUndefined()
    expect(state.portfolioLibrary).toBeUndefined()
    expect(state.isLibraryOpen).toBe(false)
    expect(state.saveName).toBeUndefined()
    expect(state.configSaved).toBe(false)
    expect(state.generatedHTML).toBe('')
    expect(state.editableHTML).toBe('')
    expect(state.viewMode).toBe('edit')
    expect(state.isLoading).toBe(false)
    expect(state.isDownloadingPdf).toBe(false)
    expect(state.copied).toBe(false)
    expect(state.activeSection).toBe('cliente')
  })
})

describe('State Persistence', () => {
  beforeEach(() => {
    usePortfolioStore.saveToLocalStorage()
  })
  
  it('should save to localStorage', () => {
    const state = usePortfolioStore.getState()
    const saved = {
      edad: 45,
      profesion: 'Arquitecto',
      objetivo: 'Nueva meta',
      perfilRiesgo: 'Moderado',
      ingresosMensuales: 8000,
      gastosMensuales: 5000,
      fondoEmergenciaMeses: 6,
      fondoEmergenciaActual: 100000,
      patrimonioActivos: 150000,
      patrimonioDeudas: 0,
      metasVida: [],
      proyeccionRetiro: '80',
      gastosPrincipales: '',
      observaciones: '',
      terminoFinanciero: 'Jubilación',
      usarTerminoIA: false,
      consejoFinal: '',
      usarConsejoIA: false,
      wizardStep: 3,
      asignacionEstrategica: [],
      instruments: [],
      obligacionesNegociables: [],
      riesgos: [],
      beneficiosFiscales: [],
    }
    
    usePortfolioStore.saveToLocalStorage()
    
    const configSaved = usePortfolioStore.getState().configSaved
    expect(configSaved).toBe(true)
    
    // Verify save
    const loaded = localStorage.getItem('cactus-plan-config')
    expect(loaded).toBeDefined()
    const parsed = JSON.parse(loaded)
    expect(parsed.edad).toBe(45)
    expect(parsed.profesion).toBe('Arquitecto')
    expect(parsed.objetivo).toBe('Nueva meta')
    expect(parsed.perfilRiesgo).toBe('Moderado')
    expect(parsed.ingresosMensuales).toBe(8000)
    expect(parsed.fondoEmergenciaMeses).toBe(6)
    expect(parsed.fondoEmergenciaActual).toBe(100000)
    expect(parsed.patrimonioActivos).toBe(150000)
    expect(parsed.patrimonioDeudas).toBe(0)
    expect(parsed.metasVida).toEqual([])
    expect(parsed.proyeccionRetiro).toBe('80')
    expect(parsed.gastosPrincipales).toBe('')
    expect(parsed.observaciones).toBe('')
    expect(parsed.terminoFinanciero).toBe('Jubilación')
    expect(parsed.usarTerminoIA).toBe(false)
    expect(parsed.consejoFinal).toBe('')
    expect(parsed.usarConsejoIA).toBe(false)
    expect(parsed.terminoFinanciero).toBeDefined()
    expect(parsed.webUrl).toBeUndefined()
    expect(parsed.tipoAporte).toBe('mensual')
    expect(parsed.asesorNombre).toBeUndefined()
    expect(parsed.asesorRecomendacion).toBe(false)
    expect(parsed.platformLinks).toBeUndefined()
    expect(parsed.socialLinks).toBeUndefined()
    expect(parsed.portfolioLibrary).toBeUndefined()
    expect(parsed.isLibraryOpen).toBe(false)
    expect(parsed.saveName).toBeUndefined()
    expect(parsed.configSaved).toBe(false)
    expect(parsed.generatedHTML).toBe('')
    expect(parsed.editableHTML).toBe('')
    expect(parsed.viewMode).toBe('edit')
    expect(parsed.isLoading).toBe(false)
    expect(parsed.isDownloadingPdf).toBe(false)
    expect(parsed.copied).toBe(false)
    expect(parsed.activeSection).toBe('cliente')
  })
})

describe('Template Application', () => {
  beforeEach(() => {
    const mockTemplates = {
      conservador: {
        id: 'conservador',
        strategicAllocation: { short: 40, medium: 40, long: 15, strategic: 5 },
        instruments: [
          { nombre: 'ON YPF 2026', tipo: 'Corporativo USD', asignacion: 25, moneda: 'USD', objetivo: 'Renta segura 7%' },
        ]
      }
    }
    
    usePortfolioStore.applyTemplate(mockTemplates.conservador)
    
    const stateAfter = usePortfolioStore.getState()
    expect(stateAfter.ingresosMensuales).toBe(8000)
    expect(stateAfter.ingresosMensuales).toBeUndefined()
    expect(stateAfter.asignacionEstrategica).toEqual(mockTemplates.conservador.asignacionEstrategica)
    expect(stateAfter.instruments).toEqual(mockTemplates.conservador.instruments)
  })
})

describe('Portfolio Library Management', () => {
  beforeEach(() => {
    usePortfolioStore.persistHydration = false
  })
  
  it('should save portfolio', () => {
    const portfolioToSave = {
      id: 'test-' + Date.now().toString(),
      name: 'Test Portfolio',
      date: new Date().toISOString(),
      data: {
        edad: 30,
        profesion: 'Test Profesion',
        objetivo: 'Test Objective',
        perfilRiesgo: 'Test Perfil Riesgo',
        ingresosMensuales: 6000,
        gastosMensuales: 3000,
        fondoEmergenciaMeses: 6,
        fondoEmergenciaActual: 10000,
        patrimonioActivos: 150000,
        patrimonioDeudas: 0,
        metasVida: [],
        wizardStep: 3,
        asignacionEstrategica: mockTemplates.conservador.asignacionEstrategica,
        instruments: mockTemplates.conservador.instruments,
        obligacionesNegociables: mockTemplates.conservador.obligacionesNegociables,
        riesgos: mockTemplates.conservador.riesgos,
        beneficiosFiscales: mockTemplates.conservador.beneficiosFiscales,
      }
    }
    
    usePortfolioStore.addPortfolioToLibrary(portfolioToSave)
    
    const libraryAfter = usePortfolioStore.getState().portfolioLibrary
    expect(libraryAfter.length).toBe(1)
    expect(libraryAfter[0].id).toBe('test-' + Date.now().toString())
  })
  
  it('should delete portfolio', () => {
    usePortfolioStore.deletePortfolioFromLibrary('test-' + Date.now().toString())
    
    const libraryAfter = usePortfolioStore.getState().portfolioLibrary
    expect(libraryAfter.length).toBe(0)
  })
})

describe('PDF Generation', () => {
  it('should generate PDF HTML', async () => {
    const testState = usePortfolioStore.getState()
    
    const testData = {
      edad: 35,
      profesion: 'Arquitecto',
      objetivo: 'Test Objective',
      perfilRiesgo: 'Moderado',
      ingresosMensuales: 5000,
      gastosMensuales: 3000,
      fondoEmergenciaMeses: 6,
      fondoEmergenciaActual: 10000,
      patrimonioActivos: 150000,
      patrimonioDeudas: 0,
      metasVida: [],
      proyeccionRetiro: '80',
      wizardStep: 4,
      asignacionEstrategica: [],
      instruments: [],
      obligacionesNegociables: [],
      riesgos: [],
      beneficiosFiscales: [],
      activeSection: 'portafolio',
      generatedHTML: '',
    }
    
    usePortfolioStore.saveToLocalStorage()
    
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(JSON.stringify(testState))
    
    const response = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testState),
    })
    
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/generate-plan',
      'POST',
      { 'Content-Type': 'application/json' },
      JSON.stringify(testState)
    )
    
    const responseData = await response.json()
    
    expect(responseData.html).toBeTruthy()
    
    fetchSpy.mockRestore()
  })
})

// ============================================================
// RUN TESTS
// ============================================================

describe('Zustand Store with PortfolioEditor', () => {
  beforeEach(() => {
    usePortfolioStore.persistHydration = false
    usePortfolioStore.persistHydration = false
  })
  
  it('should update edad', () => {
    usePortfolioStore.setEdad(40)
    const state = usePortfolioStore.getState()
    expect(state.edad).toBe(40)
  })
  
  it('should update profesion', () => {
    usePortfolioStore.setProfesion('Arquitecto')
    const state = usePortfolioStore.getState()
    expect(state.profesion).toBe('Arquitecto')
  })
  
  it('should update wizard step', () => {
    usePortfolioStore.setWizardStep(1)
    const state = usePortfolioStore.getState()
    expect(state.wizardStep).toBe(1)
  })
  
  it('should update section', () => {
    usePortfolioStore.setActiveSection('portafolio')
    const state = usePortfolioStore.getState()
    expect(state.activeSection).toBe('portafolio')
  })
  
  it('should update instruments', () => {
    const instruments = [
      { nombre: 'Test Instrument', tipo: 'Corporativo USD', asignacion: 25, moneda: 'USD', objetivo: 'Test Objective', locked: false }
    ]
    
    usePortfolioStore.setInstruments(instruments)
    
    const state = usePortfolioStore.getState()
    expect(state.instruments).toEqual(instruments)
  })
})

// ============================================================
// SNAPSHOTS
// ============================================================

describe('PortfolioEditor: Step 3', () => {
  beforeEach(() => {
    const state = usePortfolioStore.getState()
    
    expect(state.wizardStep).toBe(3)
  })
  
  it('should render profile form', () => {
    render(
      <div className="p-6 space-y-4">
        <div className="mb-4">
          <label>Edad</label>
          <input type="number" value={edad} onChange={setEdad} />
        </div>
        <div className="mb-4">
          <label>Profesión</label>
          <input type="text" value={profesion} onChange={setProfesion} />
        </div>
        <div className="mb-4">
          <label>Objetivo</label>
          <input type="text" value={objetivo} onChange={setObjetivo} />
        </div>
      </div>
    )
  })

  it('should render health form', () => {
    render(
      <div className="p-6 space-y-4">
        <div className="mb-4">
          <label>Ingresos Mensuales</label>
          <input type="number" value={ingresosMensuales} onChange={setIngresosMensuales} />
        </div>
        <div className="mb-4">
          <label>Gastos Mensuales</label>
          <input type="number" value={gastosMensuales} onChange={setGastosMensuales} />
        </div>
      </div>
    )
  })

// ============================================================
// RENDER HELPER COMPONENT
// ============================================================

describe('PortfolioPreview: Preview', () => {
  beforeEach(() => {
    const state = usePortfolioStore.getState()
    
    expect(state.generatedHTML).toBe('')
    expect(state.editableHTML).toBe('')
    expect(state.viewMode).toBe('preview')
  })
  
  it('should render with data', () => {
    const state = usePortfolioStore.getState()
    
    state.generatedHTML = '<div>Test content</div>'
    
    render(
      <PortfolioPreview
        {...state}
      />
    )
  })
})

// ============================================================
// UI COMPONENTS
// ============================================================

describe('Dialog Wrapper Component', () => {
  it('should open settings', () => {
    const state = usePortfolioStore.getState()
    
    render(
      <Dialog open={state.isLibraryOpen} onOpenChange={setIsLibraryOpen}>
        <DialogContent />
      </Dialog>
    )
  })
})

// ============================================================
// END OF TESTS
// ============================================================


})
