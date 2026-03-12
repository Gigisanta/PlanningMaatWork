import { create } from 'zustand';

// ============================================================
// TIPOS ESPECÍFICOS DEL DOMINIO
// ============================================================

export type Horizonte = 'Corto (0-12m)' | 'Medio (12-24m)' | 'Largo (24-36m)' | 'Estrategico';

export type PerfilRiesgo = 'Conservador' | 'Moderado' | 'Agresivo';

export type TipoAporte = 'mensual' | 'unico' | 'semanal' | 'quincenal';

export type InstrumentoTipo = 'Corporativo USD' | 'Soberano USD' | 'Equity Internacional';

export type ViewMode = 'preview' | 'edit';

export interface Instrument {
  nombre: string;
  tipo: InstrumentoTipo;
  asignacion: number;
  moneda: string;
  objetivo: string;
  locked?: boolean;
}

export interface AsignacionEstrategica {
  horizonte: Horizonte;
  porcentaje: number;
  sector: string;
  objetivo: string;
  locked?: boolean;
}

export interface ObligacionNegociable {
  emisor: string;
  cupon: string;
  vencimiento: string;
  ticker: string;
  moneda: string;
  pago: string;
}

export interface Riesgo {
  riesgo: string;
  nivel: 'Bajo' | 'Medio' | 'Alto';
  mitigacion: string;
}

export interface MetaVida {
  id?: string;
  categoria: string;
  descripcion: string;
  monto?: number;
  fechaObjetivo?: string;
}

export interface ConfigurableLink {
  name: string;
  url: string;
  icon?: 'link' | 'instagram' | 'whatsapp';
}

export interface AttachedFile {
  name: string;
  type: string;
  data: string;
  size: number;
}

// ============================================================
// ESTADO DE LA APLICACIÓN
// ============================================================

interface PortfolioState {
  // Cliente
  edad: number;
  profesion: string;
  objetivo: string;
  perfilRiesgo: PerfilRiesgo;
  aporteInicial: number;
  
  // Salud Financiera
  ingresosMensuales: number;
  gastosMensuales: number;
  fondoEmergenciaMeses: number;
  fondoEmergenciaActual: number;
  patrimonioActivos: number;
  patrimonioDeudas: number;
  
  // Metas
  metasVida: MetaVida[];
  proyeccionRetiro: string;
  
  // Portafolio
  wizardStep: number;
  asignacionEstrategica: AsignacionEstrategica[];
  instruments: Instrument[];
  obligacionesNegociables: ObligacionNegociable[];
  riesgos: Riesgo[];
  beneficiosFiscales: string[];
  
  // Otros
  gastosPrincipales: string;
  observaciones: string;
  terminoFinanciero: string;
  usarTerminoIA: boolean;
  consejoFinal: string;
  usarConsejoIA: boolean;
  
  // Configuración adicional
  webUrl?: string;
  asesorTelefono?: string;
  asesorMensajePredefinido?: string;
  tipoAporte?: TipoAporte;
  asesorNombre?: string;
  asesorRecomendacion?: boolean;
  platformLinks?: { name: string; url: string }[];
  socialLinks?: { name: string; url: string; icon?: string }[];
  
  // Branding
  colorPrincipal?: string;
  colorAcento?: string;
  logoUrl?: string;

  // Biblioteca
  portfolioLibrary: any[];
  isLibraryOpen: boolean;
  saveName: string;
  
  // UI
  activeSection: string;
  generatedHTML: string;
  editableHTML: string;
  viewMode: ViewMode;
  isLoading: boolean;
  isDownloadingPdf: boolean;
  copied: boolean;
  configSaved: boolean;
  attachedFiles: AttachedFile[];
}

interface PortfolioActions {
  // Setters - Cliente
  setEdad: (edad: number) => void;
  setAporteInicial: (aporte: number) => void;
  setProfesion: (profesion: string) => void;
  setObjetivo: (objetivo: string) => void;
  setPerfilRiesgo: (perfilRiesgo: PerfilRiesgo) => void;
  
  // Setters - Salud Financiera
  setIngresosMensuales: (ingresos: number) => void;
  setGastosMensuales: (gastos: number) => void;
  setFondoEmergenciaMeses: (meses: number) => void;
  setFondoEmergenciaActual: (actual: number) => void;
  setPatrimonioActivos: (activos: number) => void;
  setPatrimonioDeudas: (deudas: number) => void;
  
  // Setters - Metas
  setMetasVida: (metas: MetaVida[]) => void;
  setProyeccionRetiro: (proyeccion: string) => void;
  
  // Setters - Portafolio
  setWizardStep: (step: number) => void;
  setAsignacionEstrategica: (asignacion: AsignacionEstrategica[]) => void;
  setInstruments: (instruments: Instrument[]) => void;
  setRiesgos: (riesgos: Riesgo[]) => void;
  setBeneficiosFiscales: (beneficios: string[]) => void;
  
  // Setters - Otros
  setGastosPrincipales: (gastos: string) => void;
  setObservaciones: (observaciones: string) => void;
  setTerminoFinanciero: (termino: string) => void;
  setUsarTerminoIA: (usar: boolean) => void;
  setConsejoFinal: (consejo: string) => void;
  setUsarConsejoIA: (usar: boolean) => void;
  
  // Setters - Configuración adicional
  setWebUrl: (webUrl?: string) => void;
  setAsesorTelefono: (telefono?: string) => void;
  setAsesorMensajePredefinido: (mensaje?: string) => void;
  setTipoAporte: (tipo?: TipoAporte) => void;
  setAsesorNombre: (nombre?: string) => void;
  setAsesorRecomendacion: (recomendacion: boolean) => void;
  setPlatformLinks: (links?: { name: string; url: string }[]) => void;
  setSocialLinks: (links?: { name: string; url: string; icon?: string }[]) => void;
  
  // Setters - Branding
  setColorPrincipal: (color?: string) => void;
  setColorAcento: (color?: string) => void;
  setLogoUrl: (url?: string) => void;

  // Setters - Biblioteca
  setPortfolioLibrary: (library: any[]) => void;
  setIsLibraryOpen: (open: boolean) => void;
  setSaveName: (name: string) => void;
  
  // Setters - UI
  setActiveSection: (section: string) => void;
  setGeneratedHTML: (html: string) => void;
  setEditableHTML: (html: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setIsLoading: (loading: boolean) => void;
  setIsDownloadingPdf: (downloading: boolean) => void;
  setCopied: (copied: boolean) => void;
  setConfigSaved: (saved: boolean) => void;
  setAttachedFiles: (files: AttachedFile[]) => void;
  
  // Acciones compuestas - Persistencia
  loadFromLocalStorage: () => void;
  saveToLocalStorage: () => void;
  resetConfig: () => void;
  
  // Acciones compuestas - Biblioteca
  applyTemplate: (template: any) => void;
  addPortfolioToLibrary: (portfolio: any) => void;
  deletePortfolioFromLibrary: (id: string) => void;
  
  // Acciones compuestas - PDF
  generatePDF: () => Promise<void>;
  setCopiedToClipboard: () => Promise<void>;
}

// ============================================================
// CONSTANTES DE LOCALSTORAGE
// ============================================================

const STORAGE_KEY = 'cactus-plan-config';
const LIBRARY_KEY = 'cactus-portfolio-library';

// ============================================================
// ZUSTAND STORE - ESTADO GLOBAL CENTRALIZADO
// ============================================================

export const usePortfolioStore = create<PortfolioState & PortfolioActions>((set) => ({
  // ============================================================
  // ESTADO INICIAL
  // ============================================================
  
  // Cliente
  edad: 30,
  aporteInicial: 0,
  profesion: '',
  objetivo: '',
  perfilRiesgo: 'Moderado',
  
  // Salud Financiera
  ingresosMensuales: 5000,
  gastosMensuales: 3000,
  fondoEmergenciaMeses: 3,
  fondoEmergenciaActual: 0,
  patrimonioActivos: 0,
  patrimonioDeudas: 0,
  
  // Metas
  metasVida: [],
  proyeccionRetiro: '65',
  
  // Portafolio
  wizardStep: 0,
  asignacionEstrategica: [],
  instruments: [],
  obligacionesNegociables: [],
  riesgos: [],
  beneficiosFiscales: [],
  
  // Otros
  gastosPrincipales: '',
  observaciones: '',
  terminoFinanciero: '',
  usarTerminoIA: false,
  consejoFinal: '',
  usarConsejoIA: false,
  
  // Configuración adicional
  webUrl: undefined,
  asesorTelefono: undefined,
  asesorMensajePredefinido: undefined,
  asesorNombre: undefined,
  asesorRecomendacion: false,
  platformLinks: undefined,
  socialLinks: undefined,
  // Branding
  colorPrincipal: undefined,
  colorAcento: undefined,
  logoUrl: undefined,
  
  // Biblioteca
  portfolioLibrary: [] as any[],
  isLibraryOpen: false,
  saveName: "",
  
  // UI
  activeSection: 'cliente',
  generatedHTML: '',
  editableHTML: '',
  viewMode: 'edit',
  isLoading: false,
  isDownloadingPdf: false,
  copied: false,
  configSaved: false,
  attachedFiles: [],
  
  // ============================================================
  // SETTERS - CLIENTE
  // ============================================================
  
  setEdad: (edad) => set({ edad }),
  setAporteInicial: (aporteInicial) => set({ aporteInicial }),
  setProfesion: (profesion) => set({ profesion }),
  setObjetivo: (objetivo) => set({ objetivo }),
  setPerfilRiesgo: (perfilRiesgo) => set({ perfilRiesgo }),
  
  // ============================================================
  // SETTERS - SALUD FINANCIERA
  // ============================================================
  
  setIngresosMensuales: (ingresos) => set({ ingresosMensuales: ingresos }),
  setGastosMensuales: (gastos) => set({ gastosMensuales: gastos }),
  setFondoEmergenciaMeses: (meses) => set({ fondoEmergenciaMeses: meses }),
  setFondoEmergenciaActual: (actual) => set({ fondoEmergenciaActual: actual }),
  setPatrimonioActivos: (activos) => set({ patrimonioActivos: activos }),
  setPatrimonioDeudas: (deudas) => set({ patrimonioDeudas: deudas }),
  
  // ============================================================
  // SETTERS - METAS
  // ============================================================
  
  setMetasVida: (metas) => set({ metasVida: metas }),
  setProyeccionRetiro: (proyeccion) => set({ proyeccionRetiro: proyeccion }),
  
  // ============================================================
  // SETTERS - PORTAFOLIO
  // ============================================================
  
  setWizardStep: (step) => set({ wizardStep: step }),
  setAsignacionEstrategica: (asignacion) => set({ asignacionEstrategica: asignacion }),
  setInstruments: (instruments) => set({ instruments: instruments }),
  setRiesgos: (riesgos) => set({ riesgos: riesgos }),
  setBeneficiosFiscales: (beneficios) => set({ beneficiosFiscales: beneficios }),
  
  // ============================================================
  // SETTERS - OTROS
  // ============================================================
  
  setGastosPrincipales: (gastos) => set({ gastosPrincipales: gastos }),
  setObservaciones: (observaciones) => set({ observaciones: observaciones }),
  setTerminoFinanciero: (termino) => set({ terminoFinanciero: termino }),
  setUsarTerminoIA: (usar) => set({ usarTerminoIA: usar }),
  setConsejoFinal: (consejo) => set({ consejoFinal: consejo }),
  setUsarConsejoIA: (usar) => set({ usarConsejoIA: usar }),
  
  // ============================================================
  // SETTERS - CONFIGURACIÓN ADICIONAL
  // ============================================================
  
  setWebUrl: (webUrl) => set({ webUrl }),
  setAsesorTelefono: (telefono) => set({ asesorTelefono: telefono }),
  setAsesorMensajePredefinido: (mensaje) => set({ asesorMensajePredefinido: mensaje }),
  setTipoAporte: (tipo) => set({ tipoAporte: tipo }),
  setAsesorNombre: (nombre) => set({ asesorNombre: nombre }),
  setAsesorRecomendacion: (recomendacion) => set({ asesorRecomendacion: recomendacion }),
  setPlatformLinks: (links) => set({ platformLinks: links }),
  setSocialLinks: (links) => set({ socialLinks: links }),
  
  // Branding
  setColorPrincipal: (colorPrincipal) => set({ colorPrincipal }),
  setColorAcento: (colorAcento) => set({ colorAcento }),
  setLogoUrl: (logoUrl) => set({ logoUrl }),

  // ============================================================
  // SETTERS - BIBLIOTECA
  // ============================================================
  
  setPortfolioLibrary: (library) => set({ portfolioLibrary: library }),
  setIsLibraryOpen: (open) => set({ isLibraryOpen: open }),
  setSaveName: (name) => set({ saveName: name }),
  
  // ============================================================
  // SETTERS - UI
  // ============================================================
  
  setActiveSection: (section) => set({ activeSection: section }),
  setGeneratedHTML: (html) => set({ generatedHTML: html }),
  setEditableHTML: (html) => set({ editableHTML: html }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsDownloadingPdf: (downloading) => set({ isDownloadingPdf: downloading }),
  setCopied: (copied) => set({ copied: copied }),
  setConfigSaved: (saved) => set({ configSaved: saved }),
  setAttachedFiles: (files) => set({ attachedFiles: files }),
  
  // ============================================================
  // ACCIONES COMPUESTAS - PERSISTENCIA
  // ============================================================
  
  loadFromLocalStorage: () => {
    const config = localStorage.getItem(STORAGE_KEY);
    if (config) {
      try {
        const parsed = JSON.parse(config);
        set(parsed);
      } catch (error) {
        console.error('Error loading localStorage:', error);
      }
    }
  },
  
  saveToLocalStorage: () => {
    const state = usePortfolioStore.getState();
    const configToSave = {
      edad: state.edad,
      aporteInicial: state.aporteInicial,
      profesion: state.profesion,
      objetivo: state.objetivo,
      perfilRiesgo: state.perfilRiesgo,
      ingresosMensuales: state.ingresosMensuales,
      gastosMensuales: state.gastosMensuales,
      fondoEmergenciaMeses: state.fondoEmergenciaMeses,
      fondoEmergenciaActual: state.fondoEmergenciaActual,
      patrimonioActivos: state.patrimonioActivos,
      patrimonioDeudas: state.patrimonioDeudas,
      metasVida: state.metasVida,
      proyeccionRetiro: state.proyeccionRetiro,
      gastosPrincipales: state.gastosPrincipales,
      observaciones: state.observaciones,
      terminoFinanciero: state.terminoFinanciero,
      usarTerminoIA: state.usarTerminoIA,
      consejoFinal: state.consejoFinal,
      usarConsejoIA: state.usarConsejoIA,
      wizardStep: state.wizardStep,
      asignacionEstrategica: state.asignacionEstrategica,
      instruments: state.instruments,
      obligacionesNegociables: state.obligacionesNegociables,
      riesgos: state.riesgos,
      beneficiosFiscales: state.beneficiosFiscales,
      webUrl: state.webUrl,
      asesorTelefono: state.asesorTelefono,
      asesorMensajePredefinido: state.asesorMensajePredefinido,
      tipoAporte: state.tipoAporte,
      asesorNombre: state.asesorNombre,
      asesorRecomendacion: state.asesorRecomendacion,
      platformLinks: state.platformLinks,
      socialLinks: state.socialLinks,
      colorPrincipal: state.colorPrincipal,
      colorAcento: state.colorAcento,
      logoUrl: state.logoUrl,
      activeSection: state.activeSection,
      generatedHTML: state.generatedHTML,
      editableHTML: state.editableHTML,
      viewMode: state.viewMode,
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
      usePortfolioStore.getState().setConfigSaved(true);
      setTimeout(() => usePortfolioStore.getState().setConfigSaved(false), 2000);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  resetConfig: () => {
    set({
      edad: 30,
  aporteInicial: 0,
      profesion: '',
      objetivo: '',
      perfilRiesgo: 'Moderado',
      ingresosMensuales: 5000,
      gastosMensuales: 3000,
      fondoEmergenciaMeses: 3,
      fondoEmergenciaActual: 0,
      patrimonioActivos: 0,
      patrimonioDeudas: 0,
      metasVida: [],
      proyeccionRetiro: '65',
      gastosPrincipales: '',
      observaciones: '',
      terminoFinanciero: '',
      usarTerminoIA: false,
      consejoFinal: '',
      usarConsejoIA: false,
      wizardStep: 0,
      asignacionEstrategica: [],
      instruments: [],
      obligacionesNegociables: [],
      riesgos: [],
      beneficiosFiscales: [],
      webUrl: undefined,
  asesorTelefono: undefined,
  asesorMensajePredefinido: undefined,
      tipoAporte: 'mensual',
      asesorNombre: undefined,
      asesorRecomendacion: false,
      platformLinks: undefined,
      socialLinks: undefined,
  // Branding
  colorPrincipal: undefined,
  colorAcento: undefined,
  logoUrl: undefined,
      portfolioLibrary: [] as any[],
      isLibraryOpen: false,
      saveName: "",
      activeSection: 'cliente',
      generatedHTML: '',
      editableHTML: '',
      viewMode: 'edit',
      isLoading: false,
      isDownloadingPdf: false,
      copied: false,
      configSaved: false,
      attachedFiles: [],
    });
  },
  
  // ============================================================
  // ACCIONES COMPUESTAS - BIBLIOTECA
  // ============================================================
  
  applyTemplate: (template) => {
    set({
      asignacionEstrategica: template.asignacionEstrategica,
      instruments: template.instruments,
      perfilRiesgo: template.riskProfile,
    });
  },
  
  addPortfolioToLibrary: (portfolio) => {
    const library = usePortfolioStore.getState().portfolioLibrary || [];
    set({ portfolioLibrary: [...library, portfolio] });
  },
  
  deletePortfolioFromLibrary: (id: string) => {
    const library = usePortfolioStore.getState().portfolioLibrary || [];
    set({ portfolioLibrary: library.filter(p => p.id !== id) });
  },
  
  // ============================================================
  // ACCIONES COMPUESTAS - PDF
  // ============================================================
  
  generatePDF: async () => {
    set({ isLoading: true });
    
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usePortfolioStore.getState()),
      });
      
      const data = await response.json();
      
      set({ 
        generatedHTML: data.html,
        isLoading: false,
      });
      
      set({ editableHTML: data.html, generatedHTML: data.html });
    } catch (error) {
      console.error('Error generating PDF:', error);
      set({ isLoading: false });
    }
  },
  
  setCopiedToClipboard: async () => {
    try {
      await navigator.clipboard.writeText(usePortfolioStore.getState().generatedHTML);
      set({ copied: true });
      setTimeout(() => set({ copied: false }), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  },
}));
