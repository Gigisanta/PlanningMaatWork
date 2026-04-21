'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  TrendingUp,
  Check,
  RotateCcw,
  Sparkles,
  Settings,
  Instagram,
  MessageCircle,
  X,
  ClipboardList,
  Eye,
  Loader2,
  Save,
  FolderOpen,
  Trash2,
  Briefcase,
  ShieldCheck,
  Zap
} from 'lucide-react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Instrument,
  AsignacionEstrategica,
  ObligacionNegociable,
  Riesgo,
  ConfigurableLink,
  AttachedFile
} from '@/components/portfolio/types'
import { PortfolioEditor } from '@/components/portfolio/PortfolioEditor'
import { PortfolioPreview } from '@/components/portfolio/PortfolioPreview'
import { toast } from 'sonner'

// ============================================================
// STORAGE & DEFAULTS
// ============================================================

const STORAGE_KEY = 'cactus-plan-config'
const LIBRARY_KEY = 'cactus-portfolio-library'

interface SavedPortfolio {
    id: string;
    name: string;
    date: string;
    data: any;
}

const defaultAsignacionEstrategica: AsignacionEstrategica[] = [
  { horizonte: 'Corto (0-12m)', porcentaje: 40, sector: 'Liquidez y Renta Fija', objetivo: 'Fondo de emergencia' },
  { horizonte: 'Medio (12-24m)', porcentaje: 35, sector: 'Renta Fija Indexada', objetivo: 'Proteccion inflacion' },
  { horizonte: 'Largo (24-36m)', porcentaje: 20, sector: 'Renta Variable', objetivo: 'Crecimiento' },
  { horizonte: 'Estrategico', porcentaje: 5, sector: 'Oportunidades', objetivo: 'Flexibilidad' },
]

const OFFICIAL_TEMPLATES = [
  {
    name: "Conservador (Renta Fija USD)",
    description: "Enfocado en preservación de capital y renta en dólares.",
    riskProfile: "Conservador",
    icon: ShieldCheck,
    strategicAllocation: { short: 40, medium: 40, long: 15, strategic: 5 },
    instruments: [
      { name: "ON YPF 2026", weight: 25, currency: "USD", type: "Corporativo USD", objective: "Renta segura 7%" },
      { name: "ON Pampa 2026", weight: 25, currency: "USD", type: "Corporativo USD", objective: "Baja volatilidad" },
      { name: "ON Pan American Energy", weight: 20, currency: "USD", type: "Corporativo USD", objective: "Preservación" },
      { name: "BOPREAL Serie 3", weight: 30, currency: "USD", type: "Soberano USD", objective: "Renta y liquidez" }
    ]
  },
  {
    name: "Moderado (Equilibrado)",
    description: "Balance entre renta fija y crecimiento moderado.",
    riskProfile: "Moderado",
    icon: Briefcase,
    strategicAllocation: { short: 20, medium: 50, long: 25, strategic: 5 },
    instruments: [
      { name: "ON YPF 2027", weight: 20, currency: "USD", type: "Corporativo USD", objective: "Renta 8%" },
      { name: "ON Pampa 2026", weight: 20, currency: "USD", type: "Corporativo USD", objective: "Estabilidad" },
      { name: "CEDEAR SPY", weight: 30, currency: "USD", type: "Equity Internacional", objective: "Crecimiento LP" },
      { name: "CEDEAR QQQ", weight: 20, currency: "USD", type: "Equity Tech", objective: "Tech Growth" },
      { name: "BOPREAL", weight: 10, currency: "USD", type: "Soberano USD", objective: "Liquidez" }
    ]
  },
  {
    name: "Agresivo (Crecimiento)",
    description: "Maximización de retornos mediante exposición a equity.",
    riskProfile: "Agresivo",
    icon: Zap,
    strategicAllocation: { short: 10, medium: 30, long: 50, strategic: 10 },
    instruments: [
      { name: "CEDEAR SPY", weight: 30, currency: "USD", type: "Equity Internacional", objective: "Market Exposure" },
      { name: "CEDEAR QQQ", weight: 30, currency: "USD", type: "Equity Tech", objective: "Tech Growth" },
      { name: "CEDEAR NVDA", weight: 15, currency: "USD", type: "Equity Tech", objective: "Alpha Generation" },
      { name: "CEDEAR AMZN", weight: 15, currency: "USD", type: "Equity Tech", objective: "Growth" },
      { name: "ON YPF 2027", weight: 10, currency: "USD", type: "Corporativo USD", objective: "Cash Yield" }
    ]
  }
];

const defaultInstruments: Instrument[] = [
  { nombre: 'ON YPF 2026', tipo: 'Corporativo USD', asignacion: 25, moneda: 'USD', objetivo: 'Renta 7% anual', locked: false },
  { nombre: 'ON Pampa 2026', tipo: 'Corporativo USD', asignacion: 25, moneda: 'USD', objetivo: 'Renta estable', locked: false },
]

const defaultObligacionesNegociables: ObligacionNegociable[] = [
  { emisor: 'YPF', cupon: '8.5%', vencimiento: '2026', ticker: 'YPCUO', moneda: 'USD', pago: 'Semestral' },
  { emisor: 'Pampa Energia', cupon: '9.5%', vencimiento: '2026', ticker: 'MGC1O', moneda: 'USD', pago: 'Semestral' },
]

const defaultRiesgos: Riesgo[] = [
  { riesgo: 'Riesgo de Mercado', nivel: 'Medio', mitigacion: 'Diversificación en distintos sectores y emisores de primera línea.' },
  { riesgo: 'Riesgo de Crédito', nivel: 'Bajo', mitigacion: 'Selección de corporativos con sólidos fundamentos financieros.' }
]

const defaultBeneficiosFiscales = [
  'Exención en el Impuesto sobre los Bienes Personales para títulos públicos y ONs con oferta pública.',
  'Tratamiento preferencial en Ganancias para rentas de fuente extranjera vía CEDEARs (24544).'
]

const defaultPlatformLinks: ConfigurableLink[] = [
  { name: 'IOL invertironline', url: 'https://www.invertironline.com/', icon: 'link' },
  { name: 'Balanz', url: 'https://balanz.com/', icon: 'link' }
]

const defaultSocialLinks: ConfigurableLink[] = [
  { name: '@cactus.inversiones', url: 'https://instagram.com/', icon: 'instagram' },
  { name: 'Asesoría WhatsApp', url: 'https://wa.me/', icon: 'whatsapp' }
]

function getStoredConfig() {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

function saveConfig(config: any) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

function adjustWeights<T>(items: T[], changedIndex: number, newValue: number, key: keyof T): T[] {
  const newItems = [...items]
  const item = newItems[changedIndex] as any
  const oldValue = item[key] as number
  item[key] = newValue

  const unlockedItems = newItems.filter((_, i) => i !== changedIndex && !(newItems[i] as any).locked)
  if (unlockedItems.length === 0) return newItems

  const diff = newValue - oldValue
  const diffPerItem = diff / unlockedItems.length
  unlockedItems.forEach(ui => { (ui as any)[key] = Math.max(0, (ui as any)[key] - diffPerItem) })

  return newItems
}

function normalizeWeights<T>(items: T[], key: keyof T): T[] {
  const newItems = [...items]
  const total = newItems.reduce((sum, item) => sum + (item[key] as number), 0)
  if (total === 0) return newItems

  const factor = 100 / total
  newItems.forEach(item => {
    if (!(item as any).locked) {
        (item as any)[key] = Math.round((item[key] as number) * factor)
    }
  })

  const finalTotal = newItems.reduce((sum, item) => sum + (item[key] as number), 0)
  const diff = 100 - finalTotal
  if (diff !== 0) {
    const firstUnlocked = newItems.find(item => !(item as any).locked)
    if (firstUnlocked) (firstUnlocked as any)[key] += diff
  }

  return newItems
}

function MobileSettingsSheet({ isOpen, onClose, asesorNombre, setAsesorNombre, asesorTelefono, setAsesorTelefono, asesorMensajePredefinido, setAsesorMensajePredefinido, platformLinks, setPlatformLinks, socialLinks, setSocialLinks, asesorRecomendacion, setAsesorRecomendacion, colorPrincipal, setColorPrincipal, colorAcento, setColorAcento, logoUrl, setLogoUrl, onReset, configSaved }: any) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="p-4 border-b border-[#E8E6E0] flex items-center justify-between bg-[#F5F4F0]">
        <h2 className="text-lg font-bold text-[var(--primary)]">Configuración</h2>
        <Button variant="ghost" size="icon" aria-label="Cerrar configuración" onClick={onClose}><X className="w-6 h-6" /></Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex items-center justify-between p-4 bg-[#F5F4F0] rounded-2xl">
          <div><p className="font-bold text-[#1F2D26]">Sesión</p><p className="text-xs text-[#7A8B80]">Limpia todos los campos</p></div>
          <Button variant="outline" onClick={onReset} className="text-red-500 border-red-100 hover:bg-red-50">Borrar Todo</Button>
        </div>
        <div className="space-y-4">
          <div><Label className="text-sm font-medium text-[var(--primary-light)] mb-2 block">Tu Nombre</Label><Input value={asesorNombre} onChange={(e) => setAsesorNombre(e.target.value)} className="h-12 text-base rounded-xl" /></div>
          <div><Label className="text-sm font-medium text-[var(--primary-light)] mb-2 block">Teléfono WhatsApp</Label><Input value={asesorTelefono} onChange={(e) => setAsesorTelefono(e.target.value)} placeholder="+54 9 11 1234-5678" className="h-12 text-base rounded-xl" /></div>
          <div><Label className="text-sm font-medium text-[var(--primary-light)] mb-2 block">Mensaje Recomendar</Label><Textarea value={asesorMensajePredefinido} onChange={(e) => setAsesorMensajePredefinido(e.target.value)} className="text-base rounded-xl min-h-[80px] p-3" /></div>
          <div><Label className="text-sm font-medium text-[var(--primary-light)] mb-2 block">Plataformas de Inversión</Label><div className="space-y-2">{platformLinks.map((link: any, i: number) => (<div key={i} className="flex gap-2"><Input value={link.name} onChange={(e) => { const l = [...platformLinks]; l[i] = { ...l[i], name: e.target.value }; setPlatformLinks(l) }} className="h-11 text-base flex-1 rounded-xl" placeholder="Nombre" /><Input value={link.url} onChange={(e) => { const l = [...platformLinks]; l[i] = { ...l[i], url: e.target.value }; setPlatformLinks(l) }} className="h-11 text-base flex-[2] rounded-xl" placeholder="URL" /></div>))}</div></div>
          <div><Label className="text-sm font-medium text-[var(--primary-light)] mb-2 block">Redes Sociales</Label><div className="space-y-2">{socialLinks.map((link: any, i: number) => (<div key={i} className="flex gap-2"><div className="flex items-center gap-2 flex-1">{link.icon === 'instagram' ? <Instagram className="w-5 h-5 text-[#E1306C] flex-shrink-0" /> : <MessageCircle className="w-5 h-5 text-[#25D366] flex-shrink-0" />}<Input value={link.name} onChange={(e) => { const l = [...socialLinks]; l[i] = { ...l[i], name: e.target.value }; setSocialLinks(l) }} className="h-11 text-base rounded-xl" /></div><Input value={link.url} onChange={(e) => { const l = [...socialLinks]; l[i] = { ...l[i], url: e.target.value }; setSocialLinks(l) }} className="h-11 text-base flex-[2] rounded-xl" placeholder="URL" /></div>))}</div></div>
          <div className="flex items-center gap-3 py-2"><input type="checkbox" id="asesorRecomendacion-mobile" checked={asesorRecomendacion} onChange={(e) => setAsesorRecomendacion(e.target.checked)} className="w-5 h-5 rounded text-[var(--primary-light)] accent-[#3D7A5F] cursor-pointer" /><Label htmlFor="asesorRecomendacion-mobile" className="text-base cursor-pointer">Incluir recomendaciones</Label></div>
          <div className="pt-4 border-t border-[#E8E6E0]">
            <Label className="text-sm font-medium text-[var(--primary-light)] mb-4 block">Personalización de Marca</Label>
            <div className="space-y-4">
              <div><Label className="text-xs text-[#7A8B80] mb-1 block">Color Principal (Fondo, Botones)</Label><div className="flex gap-2"><Input type="color" value={colorPrincipal} onChange={(e) => setColorPrincipal(e.target.value)} className="h-10 w-16 p-1 rounded-xl cursor-pointer" /><Input value={colorPrincipal} onChange={(e) => setColorPrincipal(e.target.value)} className="h-10 flex-1 text-base rounded-xl uppercase" /></div></div>
              <div><Label className="text-xs text-[#7A8B80] mb-1 block">Color Acento (Destacados)</Label><div className="flex gap-2"><Input type="color" value={colorAcento} onChange={(e) => setColorAcento(e.target.value)} className="h-10 w-16 p-1 rounded-xl cursor-pointer" /><Input value={colorAcento} onChange={(e) => setColorAcento(e.target.value)} className="h-10 flex-1 text-base rounded-xl uppercase" /></div></div>
              <div><Label className="text-xs text-[#7A8B80] mb-1 block">URL Logo Asesor (Opcional)</Label><Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." className="h-10 text-base rounded-xl" /></div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-[#E8E6E0] bg-[#F5F4F0]"><div className="flex items-center justify-center py-2 px-4 bg-[#E8F5E9] text-[var(--primary)] rounded-xl border border-[#C8E6C9] animate-in fade-in zoom-in duration-300"><Check className="w-5 h-5 mr-2" /><span className="font-medium">Cambios guardados automáticamente</span></div><Button onClick={onClose} className="w-full h-12 mt-4 bg-[var(--primary)] hover:bg-[var(--primary-light)] rounded-xl text-base">Listo</Button></div>
      </div>
    </div>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<"form" | "preview">("form")
  const [showMobileSettings, setShowMobileSettings] = useState(false)
  
  // Financial Planning States
  const [wizardStep, setWizardStep] = useState(0)
  const [ingresosMensuales, setIngresosMensuales] = useState(1000)
  const [gastosMensuales, setGastosMensuales] = useState(700)
  const [fondoEmergenciaMeses, setFondoEmergenciaMeses] = useState(6)
  const [fondoEmergenciaActual, setFondoEmergenciaActual] = useState(0)
  const [metasVida, setMetasVida] = useState([{ id: "1", descripcion: "Comprar casa", monto: 50000, plazo: 60 }])
  const [proyeccionRetiro, setProyeccionRetiro] = useState("")
  const [patrimonioActivos, setPatrimonioActivos] = useState(0)
  const [patrimonioDeudas, setPatrimonioDeudas] = useState(0)

  const [edad, setEdad] = useState(24)
  const [aporteInicial, setAporteInicial] = useState(0)
  const [profesion, setProfesion] = useState("Estudiante")
  const [objetivo, setObjetivo] = useState("Fondo de emergencia")
  const [aporteMensual, setAporteMensual] = useState(300)
  const [perfilRiesgo, setPerfilRiesgo] = useState("Moderado-Conservador")
  const [horizonteMeses, setHorizonteMeses] = useState(36)
  const [gastosPrincipales, setGastosPrincipales] = useState("")
  const [observaciones, setObservaciones] = useState("")

  const [asignacionEstrategica, setAsignacionEstrategica] = useState(defaultAsignacionEstrategica)
  const [instruments, setInstruments] = useState(defaultInstruments)
  const [obligacionesNegociables, setObligacionesNegociables] = useState(defaultObligacionesNegociables)
  const [riesgos, setRiesgos] = useState(defaultRiesgos)
  const [beneficiosFiscales, setBeneficiosFiscales] = useState(defaultBeneficiosFiscales)
  const [terminoFinanciero, setTerminoFinanciero] = useState("")
  const [usarTerminoIA, setUsarTerminoIA] = useState(true)
  const [consejoFinal, setConsejoFinal] = useState("")
  const [usarConsejoIA, setUsarConsejoIA] = useState(true)
  const [platformLinks, setPlatformLinks] = useState(defaultPlatformLinks)
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks)
  const [asesorNombre, setAsesorNombre] = useState("")
  const [asesorRecomendacion, setAsesorRecomendacion] = useState(true)
  const [asesorTelefono, setAsesorTelefono] = useState("")
  const [asesorMensajePredefinido, setAsesorMensajePredefinido] = useState("¡Hola! Te recomiendo a mi asesor financiero.")
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])

  // Branding
  const [colorPrincipal, setColorPrincipal] = useState("#2D5A4A")
  const [colorAcento, setColorAcento] = useState("#C4846C")
  const [logoUrl, setLogoUrl] = useState("")

  const [generatedHTML, setGeneratedHTML] = useState("")
  const [editableHTML, setEditableHTML] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<"preview" | "edit">("preview")
  const [configSaved, setConfigSaved] = useState(false)
  const [activeSection, setActiveSection] = useState("cliente")
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  // Library state
  const [portfolioLibrary, setPortfolioLibrary] = useState<SavedPortfolio[]>([])
  const [saveName, setSaveName] = useState("")

  const previewRef = useRef<HTMLDivElement>(null as any)
  const fileInputRef = useRef<HTMLInputElement>(null as any)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = await Promise.all(
      Array.from(files).map(async (file) => {
        return new Promise<AttachedFile>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              name: file.name,
              size: file.size,
              type: file.type,
              data: e.target?.result as string || "",
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setAttachedFiles(prev => [...prev, ...newFiles])
  }
  // ⚡ Bolt: Consolidated 3 separate array passes (2x filter + 3x reduce) into a single O(N) reduce pass
  // Reduces unnecessary iterations over the instruments array when calculating portfolio exposures.
  const { exposicionUSD, exposicionARS, totalAsignacion } = useMemo(() => {
    return instruments.reduce((acc, i) => {
      acc.totalAsignacion += i.asignacion;
      if (i.moneda.includes('USD')) acc.exposicionUSD += i.asignacion;
      if (i.moneda === 'ARS') acc.exposicionARS += i.asignacion;
      return acc;
    }, { exposicionUSD: 0, exposicionARS: 0, totalAsignacion: 0 });
  }, [instruments]);
  const totalAsignacionEstrategica = useMemo(() => asignacionEstrategica.reduce((sum, a) => sum + a.porcentaje, 0), [asignacionEstrategica])
  const metaCalculada = useMemo(() => aporteInicial + (aporteMensual * horizonteMeses), [aporteInicial, aporteMensual, horizonteMeses])
  const formatNumber = useCallback((num: number) => num.toLocaleString('es-AR'), [])

  const applyTemplate = (template: typeof OFFICIAL_TEMPLATES[0]) => {
    const newInstruments = template.instruments.map((inst: any) => ({
      nombre: inst.name,
      tipo: inst.type,
      asignacion: inst.weight,
      moneda: inst.currency,
      objetivo: inst.objective,
      locked: false
    }));

    const newStrategic = defaultAsignacionEstrategica.map(item => {
      let pct = item.porcentaje;
      if (item.horizonte.includes('Corto')) pct = template.strategicAllocation.short;
      if (item.horizonte.includes('Medio')) pct = template.strategicAllocation.medium;
      if (item.horizonte.includes('Largo')) pct = template.strategicAllocation.long;
      if (item.horizonte.includes('Estrategico')) pct = template.strategicAllocation.strategic;
      return { ...item, porcentaje: pct };
    });

    setPerfilRiesgo(template.riskProfile);
    setInstruments(newInstruments);
    setAsignacionEstrategica(newStrategic);
    toast.success(`Plantilla "${template.name}" aplicada`);
    setIsLibraryOpen(false);
  };

  const handleSaveToLibrary = () => {
    if (!saveName) return;
    const newEntry: SavedPortfolio = {
        id: crypto.randomUUID(),
        name: saveName,
        date: new Date().toLocaleString(),
        data: { edad, profesion, objetivo, aporteInicial, aporteMensual, perfilRiesgo, horizonteMeses, gastosPrincipales, asignacionEstrategica, instruments, obligacionesNegociables, riesgos, beneficiosFiscales, terminoFinanciero, usarTerminoIA, consejoFinal, usarConsejoIA }, colorPrincipal, colorAcento, logoUrl
    }
    const updated = [...portfolioLibrary, newEntry]
    setPortfolioLibrary(updated)
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(updated))
    setSaveName('')
    toast.success('Cartera guardada en tu biblioteca')
  }

  const handleLoadFromLibrary = (id: string) => {
    const entry = portfolioLibrary.find(p => p.id === id)
    if (!entry) return;
    const d = entry.data
    if (d.edad !== undefined) setEdad(d.edad)
    if (d.profesion) setProfesion(d.profesion)
    if (d.objetivo) setObjetivo(d.objetivo)
    if (d.aporteMensual !== undefined) setAporteMensual(d.aporteMensual)
    if (d.perfilRiesgo) setPerfilRiesgo(d.perfilRiesgo)
    if (d.horizonteMeses !== undefined) setHorizonteMeses(d.horizonteMeses)
    if (d.gastosPrincipales) setGastosPrincipales(d.gastosPrincipales)
    if (d.asignacionEstrategica) setAsignacionEstrategica(d.asignacionEstrategica)
    if (d.instruments) setInstruments(d.instruments)
    if (d.obligacionesNegociables) setObligacionesNegociables(d.obligacionesNegociables)
    if (d.riesgos) setRiesgos(d.riesgos)
    if (d.beneficiosFiscales) setBeneficiosFiscales(d.beneficiosFiscales)
    if (d.terminoFinanciero !== undefined) setTerminoFinanciero(d.terminoFinanciero)
    if (d.usarTerminoIA !== undefined) setUsarTerminoIA(d.usarTerminoIA)
    if (d.consejoFinal !== undefined) setConsejoFinal(d.consejoFinal)
    if (d.usarConsejoIA !== undefined) setUsarConsejoIA(d.usarConsejoIA)
    if (d.colorPrincipal) setColorPrincipal(d.colorPrincipal)
    if (d.colorAcento) setColorAcento(d.colorAcento)
    if (d.logoUrl) setLogoUrl(d.logoUrl)
    toast.success(`Cartera "${entry.name}" cargada`)
  }

  const handleDeleteFromLibrary = (id: string) => {
    const updated = portfolioLibrary.filter(p => p.id !== id)
    setPortfolioLibrary(updated)
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(updated))
  }

  const handleGeneratePlan = async () => {
    setIsLoading(true)
    try {
      const formData = { edad, profesion, objetivo, aporteInicial, aporteMensual, perfilRiesgo, horizonteMeses, gastosPrincipales, observaciones, asignacionEstrategica, instruments, obligacionesNegociables, riesgos, beneficiosFiscales, terminoFinanciero, usarTerminoIA, consejoFinal, usarConsejoIA, platformLinks, socialLinks, asesorNombre, asesorRecomendacion, asesorTelefono, asesorMensajePredefinido, attachedFiles, colorPrincipal, colorAcento, logoUrl }
      const response = await fetch('/api/generate-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      const data = await response.json()
      if (data.html) { setGeneratedHTML(data.html); setEditableHTML(data.html); setViewMode('preview'); if (isMobile) setMobilePanel('preview') }
    } catch (error) { console.error('Error:', error) } finally { setIsLoading(false) }
  }

  // ⚡ Bolt: Memoize PortfolioPreview callbacks to prevent heavy iframe re-renders during form input
  const handleCopyToClipboard = useCallback(async () => {
    try { await navigator.clipboard.writeText(editableHTML); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }, [editableHTML]);

  const handleDownloadHTML = useCallback(() => {
    const blob = new Blob([editableHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `plan-${edad}anos.html`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
  }, [editableHTML, edad]);

  const handleDownloadPDF = useCallback(async () => {
    if (!previewRef.current) return
    setIsDownloadingPdf(true)
    try {
      const [{ default: html2pdf }] = await Promise.all([import('html2pdf.js')])
      const iframe = previewRef.current.querySelector('iframe')
      if (!iframe || !iframe.contentDocument) throw new Error('No iframe')

      const originalHeight = iframe.style.height;
      iframe.style.height = iframe.contentDocument.documentElement.scrollHeight + "px";
      const content = iframe.contentDocument.body

      let waContainer = null;
      if (asesorTelefono || asesorMensajePredefinido) {
        waContainer = iframe.contentDocument.createElement('div');
        waContainer.style.marginTop = '20px';
        waContainer.style.paddingTop = '10px';
        waContainer.style.borderTop = '1px solid #eaeaea';
        waContainer.style.textAlign = 'right';
        waContainer.style.pageBreakInside = 'avoid';

        const msg = asesorMensajePredefinido || `Hola, te comparto el contacto de mi asesor financiero ${asesorNombre} (Tel: ${asesorTelefono || ''}).`;
        const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;

        const waLink = iframe.contentDocument.createElement('a');
        waLink.href = url;
        waLink.target = '_blank';
        waLink.style.color = '#25D366';
        waLink.style.textDecoration = 'none';
        waLink.style.fontSize = '12px';
        waLink.style.display = 'inline-block';
        waLink.style.fontFamily = 'sans-serif';
        waLink.innerHTML = 'Recomendar asesor 💬';

        const hr = iframe.contentDocument.createElement('div');
        hr.style.height = '1px';
        hr.style.width = '120px';
        hr.style.backgroundColor = '#25D366';
        hr.style.marginTop = '2px';
        hr.style.display = 'inline-block';

        waContainer.appendChild(waLink);
        waContainer.appendChild(iframe.contentDocument.createElement('br'));
        waContainer.appendChild(hr);

        content.appendChild(waContainer);
      }

      const opt = {
        margin:       10,
        filename:     `plan-${profesion.replace(/\s+/g, '_')}-${edad}.pdf`,
        image:        { type: 'jpeg' as 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, allowTaint: true, logging: false, windowWidth: 850 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as 'portrait' | 'landscape' },
        pagebreak:    { mode: ['css', 'legacy'] }
      };

      await html2pdf().set(opt).from(content).save();

      if (waContainer) {
        content.removeChild(waContainer);
      }
      iframe.style.height = originalHeight;
    } catch (error) { console.error('Error al generar PDF:', error); alert('Error al generar PDF') } finally { setIsDownloadingPdf(false) }
  }, [asesorTelefono, asesorMensajePredefinido, asesorNombre, profesion, edad]);




  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    const stored = getStoredConfig()
    if (stored) {
      setTimeout(() => {
        if (stored.edad !== undefined) setEdad(stored.edad)
        if (stored.aporteInicial !== undefined) setAporteInicial(stored.aporteInicial)
        if (stored.profesion) setProfesion(stored.profesion)
        if (stored.objetivo) setObjetivo(stored.objetivo)
        if (stored.aporteMensual !== undefined) setAporteMensual(stored.aporteMensual)
        if (stored.perfilRiesgo) setPerfilRiesgo(stored.perfilRiesgo)
        if (stored.horizonteMeses !== undefined) setHorizonteMeses(stored.horizonteMeses)
        if (stored.gastosPrincipales) setGastosPrincipales(stored.gastosPrincipales)
        if (stored.ingresosMensuales !== undefined) setIngresosMensuales(stored.ingresosMensuales)
        if (stored.gastosMensuales !== undefined) setGastosMensuales(stored.gastosMensuales)
        if (stored.fondoEmergenciaMeses !== undefined) setFondoEmergenciaMeses(stored.fondoEmergenciaMeses)
        if (stored.fondoEmergenciaActual !== undefined) setFondoEmergenciaActual(stored.fondoEmergenciaActual)
        if (stored.metasVida) setMetasVida(stored.metasVida)
        if (stored.proyeccionRetiro) setProyeccionRetiro(stored.proyeccionRetiro)
        if (stored.patrimonioActivos !== undefined) setPatrimonioActivos(stored.patrimonioActivos)
        if (stored.patrimonioDeudas !== undefined) setPatrimonioDeudas(stored.patrimonioDeudas)
        if (stored.asignacionEstrategica) setAsignacionEstrategica(stored.asignacionEstrategica)
        if (stored.instruments) setInstruments(stored.instruments)
        if (stored.obligacionesNegociables) setObligacionesNegociables(stored.obligacionesNegociables)
        if (stored.riesgos) setRiesgos(stored.riesgos)
        if (stored.beneficiosFiscales) setBeneficiosFiscales(stored.beneficiosFiscales)
        if (stored.terminoFinanciero !== undefined) setTerminoFinanciero(stored.terminoFinanciero)
        if (stored.usarTerminoIA !== undefined) setUsarTerminoIA(stored.usarTerminoIA)
        if (stored.consejoFinal !== undefined) setConsejoFinal(stored.consejoFinal)
        if (stored.usarConsejoIA !== undefined) setUsarConsejoIA(stored.usarConsejoIA)
        if (stored.platformLinks) setPlatformLinks(stored.platformLinks)
        if (stored.socialLinks) setSocialLinks(stored.socialLinks)
        if (stored.asesorNombre !== undefined) setAsesorNombre(stored.asesorNombre)
        if (stored.asesorRecomendacion !== undefined) setAsesorRecomendacion(stored.asesorRecomendacion)
        if (stored.asesorTelefono !== undefined) setAsesorTelefono(stored.asesorTelefono)
        if (stored.asesorMensajePredefinido !== undefined) setAsesorMensajePredefinido(stored.asesorMensajePredefinido)
        if (stored.colorPrincipal) setColorPrincipal(stored.colorPrincipal)
        if (stored.colorAcento) setColorAcento(stored.colorAcento)
        if (stored.logoUrl !== undefined) setLogoUrl(stored.logoUrl)
      }, 0);
    }

    try {
        const lib = localStorage.getItem(LIBRARY_KEY)
        if (lib) {
            const parsed = JSON.parse(lib);
            setTimeout(() => setPortfolioLibrary(parsed), 0);
        }
    } catch (e) {}

    setTimeout(() => setIsLoaded(true), 0);
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    const timer = setTimeout(() => {
      saveConfig({ edad, profesion, objetivo, aporteInicial, aporteMensual, perfilRiesgo, horizonteMeses, gastosPrincipales, ingresosMensuales, gastosMensuales, fondoEmergenciaMeses, fondoEmergenciaActual, metasVida, proyeccionRetiro, patrimonioActivos, patrimonioDeudas, asignacionEstrategica, instruments, obligacionesNegociables, riesgos, beneficiosFiscales, terminoFinanciero, usarTerminoIA, consejoFinal, usarConsejoIA, platformLinks, socialLinks, asesorNombre, asesorRecomendacion, asesorTelefono, asesorMensajePredefinido, colorPrincipal, colorAcento, logoUrl })
      setConfigSaved(true)
      setTimeout(() => setConfigSaved(false), 2000)
    }, 1000)
    return () => clearTimeout(timer)
  }, [isLoaded, edad, profesion, objetivo, aporteInicial, aporteMensual, perfilRiesgo, horizonteMeses, gastosPrincipales, ingresosMensuales, gastosMensuales, fondoEmergenciaMeses, fondoEmergenciaActual, metasVida, proyeccionRetiro, patrimonioActivos, patrimonioDeudas, asignacionEstrategica, instruments, obligacionesNegociables, riesgos, beneficiosFiscales, terminoFinanciero, usarTerminoIA, consejoFinal, usarConsejoIA, platformLinks, socialLinks, asesorNombre, asesorRecomendacion, colorPrincipal, colorAcento, logoUrl])

  const handleResetConfig = useCallback(() => {
    setEdad(24)
    setAporteInicial(0)
    setProfesion("Estudiante")
    setObjetivo("Fondo de emergencia")
    setAporteMensual(300)
    setPerfilRiesgo("Moderado-Conservador")
    setHorizonteMeses(36)
    setGastosPrincipales("")
    setIngresosMensuales(1000)
    setGastosMensuales(700)
    setFondoEmergenciaMeses(6)
    setFondoEmergenciaActual(0)
    setMetasVida([{ id: "1", descripcion: "Comprar casa", monto: 50000, plazo: 60 }])
    setProyeccionRetiro("")
    setPatrimonioActivos(0)
    setPatrimonioDeudas(0)
    setAsignacionEstrategica(defaultAsignacionEstrategica)
    setInstruments(defaultInstruments)
    setObligacionesNegociables(defaultObligacionesNegociables)
    setRiesgos(defaultRiesgos)
    setBeneficiosFiscales(defaultBeneficiosFiscales)
    setTerminoFinanciero("")
    setUsarTerminoIA(true)
    setConsejoFinal("")
    setUsarConsejoIA(true)
    setPlatformLinks(defaultPlatformLinks)
    setSocialLinks(defaultSocialLinks)
    setAsesorNombre("")
    setAsesorRecomendacion(true)
    setAsesorTelefono("")
    setAsesorMensajePredefinido("¡Hola! Te recomiendo a mi asesor financiero.")
    setColorPrincipal("#2D5A4A")
    setColorAcento("#C4846C")
    setLogoUrl("")
    localStorage.removeItem(STORAGE_KEY)
  }, [])
  const editorProps = {
    isMobile, activeSection, setActiveSection, wizardStep, setWizardStep,
    ingresosMensuales, setIngresosMensuales, gastosMensuales, setGastosMensuales,
    fondoEmergenciaMeses, setFondoEmergenciaMeses, fondoEmergenciaActual, setFondoEmergenciaActual,
    metasVida, setMetasVida, proyeccionRetiro, setProyeccionRetiro,
    patrimonioActivos, setPatrimonioActivos, patrimonioDeudas, setPatrimonioDeudas,
    edad, setEdad, aporteInicial, setAporteInicial, aporteMensual, setAporteMensual, horizonteMeses, setHorizonteMeses,
    profesion, setProfesion, objetivo, setObjetivo, perfilRiesgo, setPerfilRiesgo,
    gastosPrincipales, setGastosPrincipales, attachedFiles, setAttachedFiles,
    handleFileUpload, fileInputRef, instruments, setInstruments,
    asignacionEstrategica, setAsignacionEstrategica, exposicionUSD, exposicionARS,
    totalAsignacion, totalAsignacionEstrategica, adjustWeights, normalizeWeights,
    obligacionesNegociables, setObligacionesNegociables, riesgos, setRiesgos,
    beneficiosFiscales, setBeneficiosFiscales, usarTerminoIA, setUsarTerminoIA,
    terminoFinanciero, setTerminoFinanciero, usarConsejoIA, setUsarConsejoIA,
    consejoFinal, setConsejoFinal, metaCalculada, formatNumber,
    colorPrincipal, setColorPrincipal, colorAcento, setColorAcento, logoUrl, setLogoUrl
  }

  const previewProps = {
    isMobile, generatedHTML, viewMode, setViewMode, editableHTML, setEditableHTML, handleCopyToClipboard, handleDownloadHTML, handleDownloadPDF, isDownloadingPdf, copied, previewRef
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col" style={{"--primary": colorPrincipal || "#2D5A4A", "--primary-light": colorPrincipal ? `color-mix(in srgb, ${colorPrincipal} 80%, white)` : "#3D7A5F", "--primary-dark": colorPrincipal ? `color-mix(in srgb, ${colorPrincipal} 80%, black)` : "#1F4A3D", "--accent": colorAcento || "#C4846C", "--accent-light": colorAcento ? `color-mix(in srgb, ${colorAcento} 80%, white)` : "#D9A58B", "--accent-dark": colorAcento ? `color-mix(in srgb, ${colorAcento} 80%, black)` : "#A36D59"} as React.CSSProperties}>
      <header className="bg-[var(--primary)] text-white md:py-3 py-2.5 px-4 shadow-sm flex-shrink-0 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="p-2 bg-white/10 rounded-xl"><TrendingUp className="w-5 h-5" /></div><div>{logoUrl ? <img src={logoUrl} alt="Logo" className="h-8 object-contain" /> : <div className="flex flex-col"><h1 className="md:text-lg text-base font-bold">MaatWork</h1><p className="text-[10px] opacity-80">Model Portfolios</p></div>}</div></div>
          {!isMobile && <div className="hidden md:flex flex-col items-center justify-center opacity-60 text-[10px] font-bold tracking-widest uppercase ml-4"><span>Powered by</span><span>MaatWork</span></div>}

          <div className="flex items-center gap-2 md:gap-4">
            <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
                <DialogTrigger asChild><Button variant="outline" size="sm" className="bg-white/10 border-white/15 text-white hover:bg-white/20 rounded-lg h-9 px-3"><FolderOpen className="w-4 h-4 mr-2" />Biblioteca</Button></DialogTrigger>
                <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden rounded-2xl">
                    <div className="flex flex-col h-[600px]">
                        <div className="p-6 border-b border-[#E8E6E0] bg-[#F5F4F0]">
                            <h2 className="text-xl font-bold text-[#1F2D26]">Gestión de Carteras</h2>
                            <p className="text-xs text-[#7A8B80] mt-1">Carga plantillas oficiales o guarda tus configuraciones personalizadas.</p>
                        </div>
                        <div className="flex flex-1 overflow-hidden">
                            {/* Left: Official Templates */}
                            <div className="w-1/2 border-r border-[#E8E6E0] p-6 overflow-y-auto">
                                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--primary-light)] mb-4">Plantillas Oficiales</h3>
                                <div className="space-y-3">
                                    {OFFICIAL_TEMPLATES.map((tmpl, i) => (
                                        <div key={i} onClick={() => applyTemplate(tmpl)} className="p-4 bg-white border border-[#E8E6E0] rounded-2xl hover:border-[var(--primary-light)] cursor-pointer transition-all group">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 bg-[#F5F4F0] rounded-xl flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                                                    <tmpl.icon className="w-5 h-5" />
                                                </div>
                                                <h4 className="font-bold text-[#1F2D26]">{tmpl.name}</h4>
                                            </div>
                                            <p className="text-[10px] text-[#7A8B80] leading-relaxed">{tmpl.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Right: Saved Library */}
                            <div className="w-1/2 p-6 overflow-y-auto bg-[#FAFAF8]">
                                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--accent)] mb-4">Mis Guardados</h3>
                                <div className="space-y-3">
                                    {portfolioLibrary.length === 0 ? <p className="text-center py-8 text-[#7A8B80] text-xs">No hay carteras guardadas.</p> :
                                        portfolioLibrary.map(item => (
                                            <div key={item.id} className="p-3 bg-white rounded-xl flex items-center justify-between border border-[#E8E6E0] hover:border-[var(--accent)] transition-colors group">
                                                <div className="cursor-pointer flex-1" onClick={() => handleLoadFromLibrary(item.id)}>
                                                    <h4 className="font-semibold text-sm text-[#1F2D26]">{item.name}</h4>
                                                    <p className="text-[9px] text-[#7A8B80]">{item.date}</p>
                                                </div>
                                                <Button variant="ghost" size="sm" aria-label="Eliminar de biblioteca" onClick={() => handleDeleteFromLibrary(item.id)} className="text-red-400 opacity-0 group-hover:opacity-100 h-8 w-8 p-0"><Trash2 className="w-3.5 h-3.5"/></Button>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-[#E8E6E0] bg-white">
                            <Label className="text-[10px] font-bold uppercase mb-2 block text-[#7A8B80]">Guardar configuración actual</Label>
                            <div className="flex gap-2">
                                <Input value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="Ej: Juan Perez - Moderado" className="h-10 text-sm rounded-xl"/>
                                <Button onClick={handleSaveToLibrary} className="bg-[var(--primary)] hover:bg-[var(--primary-light)] rounded-xl px-6 font-bold shadow-lg shadow-[#2D5A4A]/20 transition-all active:scale-95"><Save className="w-4 h-4 mr-2"/>Guardar</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {!isMobile && <div className={`flex items-center text-xs transition-opacity duration-500 ${configSaved ? 'opacity-100' : 'opacity-40'} text-[#8BC4A8]`}><Check className="w-3 h-3 mr-1" />Auto-guardado</div>}

            {isMobile ? (
              <Button variant="outline" size="icon" aria-label="Abrir configuración" onClick={() => setShowMobileSettings(true)} className="bg-white/10 border-white/15 text-white hover:bg-white/20 rounded-lg h-10 w-10"><Settings className="w-5 h-5" /></Button>
            ) : (
              <Popover>
                <PopoverTrigger asChild><Button variant="outline" size="icon" aria-label="Abrir configuración" className="bg-white/10 border-white/15 text-white hover:bg-white/20 rounded-lg h-9 w-9"><Settings className="w-4 h-4" /></Button></PopoverTrigger>
                <PopoverContent className="w-80 bg-white border-[#E8E6E0] shadow-xl rounded-xl" align="end">
                  <div className="space-y-3 p-1">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F0EEE8]"><span className="font-medium text-sm">Configuracion Asesor</span><Button variant="ghost" size="sm" onClick={handleResetConfig} className="text-[var(--accent)] text-xs h-6 px-2"><RotateCcw className="w-3 h-3 mr-1" />Restaurar</Button></div>
                    <div><Label className="text-xs text-[var(--primary-light)]">Tu nombre</Label><Input value={asesorNombre} onChange={(e) => setAsesorNombre(e.target.value)} placeholder="Juan Perez" className="h-8 text-sm mt-1" /></div>
                    <div><Label className="text-xs text-[var(--primary-light)]">Teléfono WhatsApp</Label><Input value={asesorTelefono} onChange={(e) => setAsesorTelefono(e.target.value)} placeholder="+54911..." className="h-8 text-sm mt-1" /></div>
                    <div><Label className="text-xs text-[var(--primary-light)]">Mensaje Recomendar</Label><Textarea value={asesorMensajePredefinido} onChange={(e) => setAsesorMensajePredefinido(e.target.value)} className="text-sm mt-1 min-h-[60px] p-2" /></div>
                    <div><Label className="text-xs text-[var(--primary-light)]">Plataformas</Label>{platformLinks.map((link, i) => (<div key={i} className="flex gap-1 mt-1"><Input value={link.name} onChange={(e) => { const l = [...platformLinks]; l[i] = { ...l[i], name: e.target.value }; setPlatformLinks(l) }} className="h-7 text-xs w-24" /><Input value={link.url} onChange={(e) => { const l = [...platformLinks]; l[i] = { ...l[i], url: e.target.value }; setPlatformLinks(l) }} className="h-7 text-xs flex-1" /></div>))}</div>
                    <div><Label className="text-xs text-[var(--primary-light)]">Redes</Label>{socialLinks.map((link, i) => (<div key={i} className="flex gap-1 mt-1"><div className="flex items-center gap-1 w-24">{link.icon === 'instagram' ? <Instagram className="w-3 h-3 text-[#E1306C]" /> : <MessageCircle className="w-3 h-3 text-[#25D366]" />}<Input value={link.name} onChange={(e) => { const l = [...socialLinks]; l[i] = { ...l[i], name: e.target.value }; setSocialLinks(l) }} className="h-7 text-xs flex-1" /></div><Input value={link.url} onChange={(e) => { const l = [...socialLinks]; l[i] = { ...l[i], url: e.target.value }; setSocialLinks(l) }} className="h-7 text-xs flex-1" /></div>))}</div>
                    <div className="flex items-center gap-2 pt-2 border-t border-[#F0EEE8]"><input type="checkbox" id="asesorRecomendacion-desktop" checked={asesorRecomendacion} onChange={(e) => setAsesorRecomendacion(e.target.checked)} className="rounded text-[var(--primary-light)] cursor-pointer" /><Label htmlFor="asesorRecomendacion-desktop" className="text-xs cursor-pointer">Incluir recomendaciones</Label></div>
                    <div className="pt-2 border-t border-[#F0EEE8] mt-2">
                      <span className="font-medium text-xs text-[#1F2D26] mb-2 block">Personalización de Marca</span>
                      <div className="space-y-2">
                        <div><Label className="text-[10px] text-[#7A8B80]">Color Principal</Label><div className="flex gap-1"><Input type="color" value={colorPrincipal} onChange={(e) => setColorPrincipal(e.target.value)} className="h-7 w-12 p-0.5 cursor-pointer rounded" /><Input value={colorPrincipal} onChange={(e) => setColorPrincipal(e.target.value)} className="h-7 text-xs flex-1 uppercase" /></div></div>
                        <div><Label className="text-[10px] text-[#7A8B80]">Color Acento</Label><div className="flex gap-1"><Input type="color" value={colorAcento} onChange={(e) => setColorAcento(e.target.value)} className="h-7 w-12 p-0.5 cursor-pointer rounded" /><Input value={colorAcento} onChange={(e) => setColorAcento(e.target.value)} className="h-7 text-xs flex-1 uppercase" /></div></div>
                        <div><Label className="text-[10px] text-[#7A8B80]">Logo URL</Label><Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." className="h-7 text-xs mt-0.5" /></div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {!isMobile ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={30} minSize={25} maxSize={45}>
              <div className="h-full bg-white flex flex-col overflow-hidden border-r border-[#E8E6E0]">
                <PortfolioEditor {...editorProps} />
                <div className="p-4 border-t border-[#E8E6E0] bg-[#F5F4F0] flex-shrink-0">
                  <Button
                    onClick={handleGeneratePlan}
                    disabled={isLoading}
                    className="w-full bg-[var(--accent)] hover:bg-[var(--accent-dark)] h-12 text-base font-black rounded-xl shadow-lg shadow-[#C4846C]/20 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest"
                  >
                    {isLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Generando...</> : <><Sparkles className="w-5 h-5 mr-2" />Finalizar y Generar PDF</>}
                  </Button>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-[#E8E6E0] w-1.5 hover:bg-[var(--primary-light)]/20 transition-colors" />
            <ResizablePanel defaultSize={70}>
              <PortfolioPreview {...previewProps} />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <>
            <div className={`fixed inset-0 top-[60px] z-40 bg-white flex flex-col transition-transform duration-300 ${mobilePanel === 'form' ? 'translate-x-0' : '-translate-x-full'}`} style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}>
              <PortfolioEditor {...editorProps} />
              <div className="p-4 border-t border-[#E8E6E0] bg-white flex-shrink-0">
                <Button onClick={handleGeneratePlan} disabled={isLoading} className="w-full bg-[var(--accent)] hover:bg-[var(--accent-dark)] h-14 text-base font-black rounded-xl shadow-lg shadow-[#C4846C]/20 uppercase tracking-widest">
                  {isLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Generando...</> : <><Sparkles className="w-5 h-5 mr-2" />Finalizar Plan</>}
                </Button>
              </div>
            </div>
            <div className={`fixed inset-0 top-[60px] z-40 bg-[#F5F4F0] flex flex-col transition-transform duration-300 ${mobilePanel === 'preview' ? 'translate-x-0' : 'translate-x-full'}`} style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}>
              <PortfolioPreview {...previewProps} />
            </div>
          </>
        )}
      </div>

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E6E0] z-50 safe-area-bottom h-[calc(64px+env(safe-area-inset-bottom,0px))]">
          <div className="flex h-16">
            <button onClick={() => setMobilePanel('form')} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors relative ${mobilePanel === 'form' ? 'text-[var(--primary)]' : 'text-[#7A8B80]'}`}>
              {mobilePanel === 'form' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[var(--primary)] rounded-b-full" />}
              <ClipboardList className="w-6 h-6" /><span className="text-xs font-medium">Formulario</span>
            </button>
            <button onClick={() => setMobilePanel('preview')} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors relative ${mobilePanel === 'preview' ? 'text-[var(--primary)]' : 'text-[#7A8B80]'}`}>
              {mobilePanel === 'preview' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[var(--primary)] rounded-b-full" />}
              <Eye className="w-6 h-6" /><span className="text-xs font-medium">Preview</span>
              {generatedHTML && <div className="absolute top-2 right-1/4 w-2 h-2 bg-[var(--primary-light)] rounded-full animate-pulse" />}
            </button>
          </div>
        </div>
      )}

      <MobileSettingsSheet isOpen={showMobileSettings} onClose={() => setShowMobileSettings(false)} asesorNombre={asesorNombre} setAsesorNombre={setAsesorNombre} asesorTelefono={asesorTelefono} setAsesorTelefono={setAsesorTelefono} asesorMensajePredefinido={asesorMensajePredefinido} setAsesorMensajePredefinido={setAsesorMensajePredefinido} platformLinks={platformLinks} setPlatformLinks={setPlatformLinks} socialLinks={socialLinks} setSocialLinks={setSocialLinks} asesorRecomendacion={asesorRecomendacion} setAsesorRecomendacion={setAsesorRecomendacion} colorPrincipal={colorPrincipal} setColorPrincipal={setColorPrincipal} colorAcento={colorAcento} setColorAcento={setColorAcento} logoUrl={logoUrl} setLogoUrl={setLogoUrl} onReset={handleResetConfig} configSaved={configSaved} />

      <style jsx global>{`
        * { scroll-behavior: smooth; }
        .overflow-y-auto::-webkit-scrollbar { width: 6px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: #E8E6E0; border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #D8D6D0; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 0); }
        body { overscroll-behavior-y: none; }
      `}</style>
    </div>
  )
}
