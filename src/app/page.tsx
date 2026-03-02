'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Copy,
  FileText,
  Loader2,
  Check,
  Download,
  FileDown,
  Plus,
  Trash2,
  TrendingUp,
  Shield,
  Target,
  PiggyBank,
  Building2,
  Scale,
  Lightbulb,
  Heart,
  Settings,
  ExternalLink,
  Instagram,
  MessageCircle,
  Link2,
  Edit3,
  Eye,
  Save,
  RotateCcw,
  Sparkles,
  FileUp,
  Paperclip,
  User,
  DollarSign,
  Calendar,
  Briefcase,
  ChevronDown,
  X,
  Menu,
  FileCode,
  ClipboardList,
} from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface Instrument {
  nombre: string
  tipo: string
  asignacion: number
  moneda: string
  objetivo: string
}

interface AsignacionEstrategica {
  horizonte: string
  porcentaje: number
  sector: string
  objetivo: string
}

interface ObligacionNegociable {
  emisor: string
  cupon: string
  vencimiento: string
  ticker: string
  moneda: string
  pago: string
}

interface Riesgo {
  riesgo: string
  nivel: 'Bajo' | 'Medio' | 'Alto'
  mitigacion: string
}

interface ConfigurableLink {
  name: string
  url: string
  icon: 'link' | 'instagram' | 'whatsapp'
}

interface AttachedFile {
  name: string
  type: string
  data: string
  size: number
}

// ============================================================
// STORAGE & DEFAULTS
// ============================================================

const STORAGE_KEY = 'cactus-plan-config'

const defaultAsignacionEstrategica: AsignacionEstrategica[] = [
  { horizonte: 'Corto (0-12m)', porcentaje: 40, sector: 'Liquidez y Renta Fija', objetivo: 'Fondo de emergencia' },
  { horizonte: 'Medio (12-24m)', porcentaje: 35, sector: 'Renta Fija Indexada', objetivo: 'Proteccion inflacion' },
  { horizonte: 'Largo (24-36m)', porcentaje: 20, sector: 'Renta Variable', objetivo: 'Crecimiento' },
  { horizonte: 'Estrategico', porcentaje: 5, sector: 'Oportunidades', objetivo: 'Flexibilidad' },
]

const defaultInstruments: Instrument[] = [
  { nombre: 'FCI Ahorro', tipo: 'Money Market', asignacion: 25, moneda: 'USD', objetivo: 'Liquidez' },
  { nombre: 'FCI Dolar Linked', tipo: 'Renta Fija', asignacion: 15, moneda: 'USD', objetivo: 'Proteccion cambiaria' },
  { nombre: 'FCI CER', tipo: 'Indexado', asignacion: 20, moneda: 'ARS', objetivo: 'Cobertura inflacion' },
  { nombre: 'Cauciones', tipo: 'Renta Fija', asignacion: 15, moneda: 'ARS/USD', objetivo: 'Rentabilidad corta' },
  { nombre: 'CEDEAR SPY', tipo: 'ETF S&P500', asignacion: 10, moneda: 'USD', objetivo: 'Diversificacion' },
  { nombre: 'CEDEAR QQQ', tipo: 'ETF Nasdaq', asignacion: 10, moneda: 'USD', objetivo: 'Crecimiento tech' },
  { nombre: 'CEDEAR KO', tipo: 'Dividendos', asignacion: 5, moneda: 'USD', objetivo: 'Ingreso pasivo' },
]

const defaultObligacionesNegociables: ObligacionNegociable[] = [
  { emisor: 'YPF', cupon: '7.50%', vencimiento: '2027', ticker: 'YPF27', moneda: 'USD', pago: 'Semestral' },
  { emisor: 'Pampa', cupon: '6.875%', vencimiento: '2028', ticker: 'PAMP28', moneda: 'USD', pago: 'Semestral' },
  { emisor: 'Central Puerto', cupon: '6.50%', vencimiento: '2027', ticker: 'CEPU27', moneda: 'USD', pago: 'Semestral' },
]

const defaultRiesgos: Riesgo[] = [
  { riesgo: 'Cambiario', nivel: 'Medio', mitigacion: 'Diversificacion USD/ARS' },
  { riesgo: 'Inflacionario', nivel: 'Alto', mitigacion: 'FCI CER, activos indexados' },
  { riesgo: 'Mercado', nivel: 'Medio', mitigacion: 'Horizonte largo, diversificacion' },
  { riesgo: 'Liquidez', nivel: 'Bajo', mitigacion: 'Instrumentos liquidos 24-48hs' },
]

const defaultBeneficiosFiscales: string[] = [
  'FCI sin impuesto a la ganancia mientras permanezcan invertidos.',
  'Exencion hasta $9.8M ARS de ganancias anuales (2024).',
  'CEDEARs exentos de Bienes Personales.',
  'Cauciones USD via MEP sin percepcion de impuestos.',
]

const defaultPlatformLinks: ConfigurableLink[] = [
  { name: 'Cocos Capital', url: 'https://cocos.capital', icon: 'link' },
  { name: 'Balanz', url: 'https://balanz.com', icon: 'link' },
]

const defaultSocialLinks: ConfigurableLink[] = [
  { name: 'Instagram', url: 'https://instagram.com/tu_usuario', icon: 'instagram' },
  { name: 'WhatsApp', url: 'https://wa.me/5491112345678', icon: 'whatsapp' },
]

// ============================================================
// HELPERS
// ============================================================

const getStoredConfig = () => {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch { return null }
}

const saveConfig = (data: object) => {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// ============================================================
// MOBILE SETTINGS SHEET COMPONENT
// ============================================================

interface MobileSettingsSheetProps {
  isOpen: boolean
  onClose: () => void
  asesorNombre: string
  setAsesorNombre: (v: string) => void
  platformLinks: ConfigurableLink[]
  setPlatformLinks: (v: ConfigurableLink[]) => void
  socialLinks: ConfigurableLink[]
  setSocialLinks: (v: ConfigurableLink[]) => void
  asesorRecomendacion: boolean
  setAsesorRecomendacion: (v: boolean) => void
  onReset: () => void
  onSave: () => void
  configSaved: boolean
}

function MobileSettingsSheet({
  isOpen,
  onClose,
  asesorNombre,
  setAsesorNombre,
  platformLinks,
  setPlatformLinks,
  socialLinks,
  setSocialLinks,
  asesorRecomendacion,
  setAsesorRecomendacion,
  onReset,
  onSave,
  configSaved,
}: MobileSettingsSheetProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-[#E8E6E0] rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-[#E8E6E0]">
          <h2 className="text-lg font-semibold text-[#1F2D26]">Configuración</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={onReset} 
              className="text-[#C4846C] text-sm h-9"
            >
              <RotateCcw className="w-4 h-4 mr-1" />Restaurar
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="h-9 w-9 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-4 space-y-5">
          {/* Tu nombre */}
          <div>
            <Label className="text-sm font-medium text-[#3D7A5F] mb-2 block">Tu nombre</Label>
            <Input 
              value={asesorNombre} 
              onChange={(e) => setAsesorNombre(e.target.value)} 
              placeholder="Juan Perez" 
              className="h-12 text-base rounded-xl" 
            />
          </div>
          
          {/* Plataformas */}
          <div>
            <Label className="text-sm font-medium text-[#3D7A5F] mb-2 block">Plataformas</Label>
            <div className="space-y-2">
              {platformLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <Input 
                    value={link.name} 
                    onChange={(e) => { const l = [...platformLinks]; l[i] = { ...l[i], name: e.target.value }; setPlatformLinks(l) }} 
                    className="h-11 text-base flex-1 rounded-xl" 
                    placeholder="Nombre"
                  />
                  <Input 
                    value={link.url} 
                    onChange={(e) => { const l = [...platformLinks]; l[i] = { ...l[i], url: e.target.value }; setPlatformLinks(l) }} 
                    className="h-11 text-base flex-[2] rounded-xl" 
                    placeholder="URL"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Redes */}
          <div>
            <Label className="text-sm font-medium text-[#3D7A5F] mb-2 block">Redes Sociales</Label>
            <div className="space-y-2">
              {socialLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    {link.icon === 'instagram' ? (
                      <Instagram className="w-5 h-5 text-[#E1306C] flex-shrink-0" />
                    ) : (
                      <MessageCircle className="w-5 h-5 text-[#25D366] flex-shrink-0" />
                    )}
                    <Input 
                      value={link.name} 
                      onChange={(e) => { const l = [...socialLinks]; l[i] = { ...l[i], name: e.target.value }; setSocialLinks(l) }} 
                      className="h-11 text-base rounded-xl" 
                    />
                  </div>
                  <Input 
                    value={link.url} 
                    onChange={(e) => { const l = [...socialLinks]; l[i] = { ...l[i], url: e.target.value }; setSocialLinks(l) }} 
                    className="h-11 text-base flex-[2] rounded-xl" 
                    placeholder="URL"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Checkbox */}
          <div className="flex items-center gap-3 py-2">
            <input 
              type="checkbox" 
              checked={asesorRecomendacion} 
              onChange={(e) => setAsesorRecomendacion(e.target.checked)} 
              className="w-5 h-5 rounded text-[#3D7A5F] accent-[#3D7A5F]" 
            />
            <Label className="text-base">Incluir recomendaciones</Label>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-[#E8E6E0] bg-[#F5F4F0]">
          <Button 
            onClick={() => { onSave(); onClose(); }} 
            className="w-full h-12 bg-[#2D5A4A] hover:bg-[#3D7A5F] rounded-xl text-base"
          >
            {configSaved ? (
              <><Check className="w-5 h-5 mr-2" />Guardado</>
            ) : (
              <><Save className="w-5 h-5 mr-2" />Guardar Configuración</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Home() {
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<'form' | 'preview'>('form')
  const [showMobileSettings, setShowMobileSettings] = useState(false)
  
  // Cliente (no persiste)
  const [edad, setEdad] = useState(24)
  const [profesion, setProfesion] = useState('Estudiante')
  const [objetivo, setObjetivo] = useState('Fondo de emergencia')
  const [aporteMensual, setAporteMensual] = useState(300)
  const [perfilRiesgo, setPerfilRiesgo] = useState('Moderado-Conservador')
  const [horizonteMeses, setHorizonteMeses] = useState(36)
  const [gastosPrincipales, setGastosPrincipales] = useState('')
  const [observaciones, setObservaciones] = useState('')

  // Configuracion (persiste)
  const [asignacionEstrategica, setAsignacionEstrategica] = useState(defaultAsignacionEstrategica)
  const [instruments, setInstruments] = useState(defaultInstruments)
  const [obligacionesNegociables, setObligacionesNegociables] = useState(defaultObligacionesNegociables)
  const [riesgos, setRiesgos] = useState(defaultRiesgos)
  const [beneficiosFiscales, setBeneficiosFiscales] = useState(defaultBeneficiosFiscales)
  const [terminoFinanciero, setTerminoFinanciero] = useState('')
  const [usarTerminoIA, setUsarTerminoIA] = useState(true)
  const [consejoFinal, setConsejoFinal] = useState('')
  const [usarConsejoIA, setUsarConsejoIA] = useState(true)
  const [platformLinks, setPlatformLinks] = useState(defaultPlatformLinks)
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks)
  const [asesorNombre, setAsesorNombre] = useState('')
  const [asesorRecomendacion, setAsesorRecomendacion] = useState(true)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])

  // UI State
  const [generatedHTML, setGeneratedHTML] = useState('')
  const [editableHTML, setEditableHTML] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview')
  const [configSaved, setConfigSaved] = useState(false)
  const [activeSection, setActiveSection] = useState('cliente')
  
  const previewRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Cargar config al iniciar
  useEffect(() => {
    const stored = getStoredConfig()
    if (stored) {
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
    }
  }, [])

  const handleSaveConfig = useCallback(() => {
    saveConfig({ asignacionEstrategica, instruments, obligacionesNegociables, riesgos, beneficiosFiscales, terminoFinanciero, usarTerminoIA, consejoFinal, usarConsejoIA, platformLinks, socialLinks, asesorNombre, asesorRecomendacion })
    setConfigSaved(true)
    setTimeout(() => setConfigSaved(false), 2000)
  }, [asignacionEstrategica, instruments, obligacionesNegociables, riesgos, beneficiosFiscales, terminoFinanciero, usarTerminoIA, consejoFinal, usarConsejoIA, platformLinks, socialLinks, asesorNombre, asesorRecomendacion])

  const handleResetConfig = useCallback(() => {
    setAsignacionEstrategica(defaultAsignacionEstrategica)
    setInstruments(defaultInstruments)
    setObligacionesNegociables(defaultObligacionesNegociables)
    setRiesgos(defaultRiesgos)
    setBeneficiosFiscales(defaultBeneficiosFiscales)
    setTerminoFinanciero('')
    setUsarTerminoIA(true)
    setConsejoFinal('')
    setUsarConsejoIA(true)
    setPlatformLinks(defaultPlatformLinks)
    setSocialLinks(defaultSocialLinks)
    setAsesorNombre('')
    setAsesorRecomendacion(true)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // File handlers
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach(file => {
      if (file.type !== 'application/pdf') { alert('Solo archivos PDF'); return }
      if (file.size > 10 * 1024 * 1024) { alert('Max 10MB'); return }
      const reader = new FileReader()
      reader.onload = (event) => {
        const data = event.target?.result as string
        setAttachedFiles(prev => [...prev, { name: file.name, type: file.type, data, size: file.size }])
      }
      reader.readAsDataURL(file)
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  // Computed
  const totalAsignacion = instruments.reduce((sum, i) => sum + i.asignacion, 0)
  const totalAsignacionEstrategica = asignacionEstrategica.reduce((sum, a) => sum + a.porcentaje, 0)
  const metaCalculada = aporteMensual * horizonteMeses
  const formatNumber = (num: number) => num.toLocaleString('es-AR')
  const exposicionUSD = instruments.filter(i => i.moneda.includes('USD')).reduce((sum, i) => sum + i.asignacion, 0)
  const exposicionARS = instruments.filter(i => i.moneda === 'ARS').reduce((sum, i) => sum + i.asignacion, 0)

  // Generate Plan
  const handleGeneratePlan = async () => {
    setIsLoading(true)
    try {
      const formData = { edad, profesion, objetivo, aporteMensual, perfilRiesgo, horizonteMeses, gastosPrincipales, observaciones, asignacionEstrategica, instruments, obligacionesNegociables, riesgos, beneficiosFiscales, terminoFinanciero, usarTerminoIA, consejoFinal, usarConsejoIA, platformLinks, socialLinks, asesorNombre, asesorRecomendacion, attachedFiles }
      const response = await fetch('/api/generate-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      const data = await response.json()
      if (data.html) { 
        setGeneratedHTML(data.html); 
        setEditableHTML(data.html); 
        setViewMode('preview');
        // Auto-switch to preview on mobile after generating
        if (isMobile) {
          setMobilePanel('preview')
        }
      }
    } catch (error) { console.error('Error:', error) } finally { setIsLoading(false) }
  }

  const handleCopyToClipboard = async () => {
    try { await navigator.clipboard.writeText(editableHTML); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  const handleDownloadHTML = () => {
    const blob = new Blob([editableHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `plan-${edad}anos.html`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return
    setIsDownloadingPdf(true)
    try {
      const iframe = previewRef.current.querySelector('iframe')
      if (!iframe || !iframe.contentDocument) throw new Error('No iframe')
      const canvas = await html2canvas(iframe.contentDocument.body, { scale: 2, useCORS: true, backgroundColor: '#FAFAF8', windowWidth: 900 })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const imgWidth = 210, pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight, position = 0
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      while (heightLeft > 0) { position = heightLeft - imgHeight; pdf.addPage(); pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); heightLeft -= pageHeight }
      pdf.save(`plan-${edad}anos.pdf`)
    } catch (error) { alert('Error al generar PDF') } finally { setIsDownloadingPdf(false) }
  }

  // Navigation tabs
  const tabs = [
    { id: 'cliente', label: 'Cliente', icon: User },
    { id: 'cartera', label: 'Cartera', icon: Building2 },
    { id: 'otros', label: 'Otros', icon: Settings },
  ]

  // Mobile bottom tabs
  const mobileBottomTabs = [
    { id: 'form', label: 'Formulario', icon: ClipboardList },
    { id: 'preview', label: 'Preview', icon: Eye },
  ]

  // Common input class for mobile
  const inputClass = isMobile 
    ? "h-12 text-base rounded-xl px-4" 
    : "h-8 text-sm"
  
  const textareaClass = isMobile
    ? "text-base rounded-xl p-4 min-h-[100px]"
    : "text-sm min-h-[50px]"
    
  const labelClass = isMobile
    ? "text-sm font-medium text-[#3D7A5F] mb-2 block"
    : "text-[10px] text-[#7A8B80] uppercase tracking-wide"

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      {/* Header */}
      <header className="bg-[#2D5A4A] text-white md:py-3 py-2.5 px-4 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <TrendingUp className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'}`} />
            </div>
            <div>
              <h1 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold`}>Cactus</h1>
              <p className="text-xs text-[#8BC4A8]">Generador de Planes</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Save button - hidden on mobile, shown in sheet */}
            {!isMobile && (
              <Button onClick={handleSaveConfig} variant="outline" size="sm" className="bg-white/10 border-white/15 text-white hover:bg-white/20 rounded-lg h-8">
                {configSaved ? <><Check className="w-3 h-3 mr-1" />Guardado</> : <><Save className="w-3 h-3 mr-1" />Guardar</>}
              </Button>
            )}

            {/* Settings - Popover on desktop, Sheet on mobile */}
            {isMobile ? (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setShowMobileSettings(true)}
                className="bg-white/10 border-white/15 text-white hover:bg-white/20 rounded-lg h-10 w-10"
              >
                <Settings className="w-5 h-5" />
              </Button>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-white/10 border-white/15 text-white hover:bg-white/20 rounded-lg h-8 w-8">
                    <Settings className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-white border-[#E8E6E0] shadow-xl rounded-xl" align="end">
                  <div className="space-y-3 p-1">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F0EEE8]">
                      <span className="font-medium text-sm">Configuracion</span>
                      <Button variant="ghost" size="sm" onClick={handleResetConfig} className="text-[#C4846C] text-xs h-6 px-2">
                        <RotateCcw className="w-3 h-3 mr-1" />Restaurar
                      </Button>
                    </div>
                    <div>
                      <Label className="text-xs text-[#3D7A5F]">Tu nombre</Label>
                      <Input value={asesorNombre} onChange={(e) => setAsesorNombre(e.target.value)} placeholder="Juan Perez" className="h-8 text-sm mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-[#3D7A5F]">Plataformas</Label>
                      {platformLinks.map((link, i) => (
                        <div key={i} className="flex gap-1 mt-1">
                          <Input value={link.name} onChange={(e) => { const l = [...platformLinks]; l[i] = { ...l[i], name: e.target.value }; setPlatformLinks(l) }} className="h-7 text-xs w-24" />
                          <Input value={link.url} onChange={(e) => { const l = [...platformLinks]; l[i] = { ...l[i], url: e.target.value }; setPlatformLinks(l) }} className="h-7 text-xs flex-1" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <Label className="text-xs text-[#3D7A5F]">Redes</Label>
                      {socialLinks.map((link, i) => (
                        <div key={i} className="flex gap-1 mt-1">
                          <div className="flex items-center gap-1 w-24">
                            {link.icon === 'instagram' ? <Instagram className="w-3 h-3 text-[#E1306C]" /> : <MessageCircle className="w-3 h-3 text-[#25D366]" />}
                            <Input value={link.name} onChange={(e) => { const l = [...socialLinks]; l[i] = { ...l[i], name: e.target.value }; setSocialLinks(l) }} className="h-7 text-xs flex-1" />
                          </div>
                          <Input value={link.url} onChange={(e) => { const l = [...socialLinks]; l[i] = { ...l[i], url: e.target.value }; setSocialLinks(l) }} className="h-7 text-xs flex-1" />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-[#F0EEE8]">
                      <input type="checkbox" checked={asesorRecomendacion} onChange={(e) => setAsesorRecomendacion(e.target.checked)} className="rounded text-[#3D7A5F]" />
                      <Label className="text-xs">Incluir recomendaciones</Label>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel Izquierdo - Formulario */}
        <div className={`
          ${isMobile 
            ? `fixed inset-0 top-[60px] bottom-[72px] z-40 bg-white transition-transform duration-300 ${mobilePanel === 'form' ? 'translate-x-0' : '-translate-x-full'}`
            : 'w-[380px] border-r border-[#E8E6E0] bg-white flex flex-col overflow-hidden'
          }
        `}>
          {/* Tabs de navegacion - Pills scrollable on mobile */}
          <div className={`
            ${isMobile 
              ? 'flex gap-2 p-3 overflow-x-auto bg-[#F5F4F0] border-b border-[#E8E6E0] scrollbar-hide' 
              : 'flex border-b border-[#E8E6E0] bg-[#F5F4F0]'
            }
          `}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`
                  ${isMobile 
                    ? `flex-shrink-0 py-2.5 px-4 text-sm font-medium flex items-center gap-2 rounded-full transition-colors ${
                        activeSection === tab.id 
                          ? 'bg-[#2D5A4A] text-white shadow-sm' 
                          : 'bg-white text-[#7A8B80] border border-[#E8E6E0]'
                      }`
                    : `flex-1 py-2.5 px-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                        activeSection === tab.id 
                          ? 'bg-white text-[#2D5A4A] border-b-2 border-[#2D5A4A]' 
                          : 'text-[#7A8B80] hover:text-[#1F2D26]'
                      }`
                  }
                `}
              >
                <tab.icon className={isMobile ? "w-4 h-4" : "w-3.5 h-3.5"} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenido del tab */}
          <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4 space-y-4' : 'p-3 space-y-3'}`}>
            {/* TAB: CLIENTE */}
            {activeSection === 'cliente' && (
              <>
                {/* Datos basicos en grid */}
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-2'}`}>
                  <div>
                    <Label className={labelClass}>Edad</Label>
                    <Input 
                      type="number" 
                      value={edad} 
                      onChange={(e) => setEdad(parseInt(e.target.value) || 0)} 
                      className={`${inputClass} mt-1`} 
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>Aporte USD</Label>
                    <Input 
                      type="number" 
                      value={aporteMensual} 
                      onChange={(e) => setAporteMensual(parseInt(e.target.value) || 0)} 
                      className={`${inputClass} mt-1`} 
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>Meses</Label>
                    <Input 
                      type="number" 
                      value={horizonteMeses} 
                      onChange={(e) => setHorizonteMeses(parseInt(e.target.value) || 0)} 
                      className={`${inputClass} mt-1`} 
                    />
                  </div>
                </div>

                <div>
                  <Label className={labelClass}>Profesión</Label>
                  <Input 
                    value={profesion} 
                    onChange={(e) => setProfesion(e.target.value)} 
                    className={`${inputClass} mt-1`} 
                  />
                </div>

                <div>
                  <Label className={labelClass}>Objetivo</Label>
                  <Textarea 
                    value={objetivo} 
                    onChange={(e) => setObjetivo(e.target.value)} 
                    className={`${textareaClass} mt-1`} 
                  />
                </div>

                <div>
                  <Label className={labelClass}>Perfil de Riesgo</Label>
                  <Select value={perfilRiesgo} onValueChange={setPerfilRiesgo}>
                    <SelectTrigger className={`${inputClass} mt-1`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conservador">Conservador</SelectItem>
                      <SelectItem value="Moderado-Conservador">Moderado-Conservador</SelectItem>
                      <SelectItem value="Moderado">Moderado</SelectItem>
                      <SelectItem value="Moderado-Agresivo">Moderado-Agresivo</SelectItem>
                      <SelectItem value="Agresivo">Agresivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className={labelClass}>Gastos principales</Label>
                  <Textarea 
                    value={gastosPrincipales} 
                    onChange={(e) => setGastosPrincipales(e.target.value)} 
                    className={`${textareaClass} mt-1`}
                    placeholder="Ej: Alquiler $150k/mes" 
                  />
                </div>

                {/* Meta calculada */}
                {aporteMensual > 0 && horizonteMeses > 0 && (
                  <div className={`p-4 bg-gradient-to-r from-[#F5F4F0] to-white rounded-xl border border-[#E8E6E0] ${isMobile ? '' : 'p-3 rounded-lg'}`}>
                    <div className="flex justify-between items-center">
                      <span className={`${isMobile ? 'text-sm' : 'text-xs'} font-medium text-[#1F2D26]`}>Meta</span>
                      <span className={`${isMobile ? 'text-2xl' : 'text-lg'} font-bold text-[#C4846C]`}>USD {formatNumber(metaCalculada)}</span>
                    </div>
                    <p className={`${isMobile ? 'text-xs' : 'text-[10px]'} text-[#5A9E7F] mt-1`}>
                      {horizonteMeses} meses × USD {formatNumber(aporteMensual)}
                    </p>
                  </div>
                )}

                {/* Archivos adjuntos */}
                <div>
                  <Label className={`${labelClass} flex items-center gap-2`}>
                    <Paperclip className="w-4 h-4" /> Documentos PDF
                  </Label>
                  <input ref={fileInputRef} type="file" accept="application/pdf" multiple onChange={handleFileUpload} className="hidden" />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()} 
                    className={`w-full ${isMobile ? 'h-12 text-base rounded-xl border-dashed mt-2' : 'h-8 text-xs mt-1 border-dashed'}`}
                  >
                    <FileUp className={`${isMobile ? 'w-5 h-5' : 'w-3 h-3'} mr-2`} /> Cargar PDF
                  </Button>
                  {attachedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachedFiles.map((file, i) => (
                        <div key={i} className={`flex items-center justify-between ${isMobile ? 'p-3' : 'p-2'} bg-[#F5F4F0] rounded-xl ${isMobile ? '' : 'rounded'} text-sm group`}>
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-[#C4846C] flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setAttachedFiles(prev => prev.filter((_, j) => j !== i))} 
                            className={`${isMobile ? 'h-10 w-10' : 'h-5 w-5 p-0 opacity-0 group-hover:opacity-100'}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* TAB: CARTERA */}
            {activeSection === 'cartera' && (
              <>
                {/* Resumen rapido */}
                <div className={`grid ${isMobile ? 'grid-cols-3 gap-3' : 'grid-cols-3 gap-2'}`}>
                  <div className={`${isMobile ? 'p-3' : 'p-2'} bg-[#F5F4F0] rounded-xl text-center`}>
                    <p className={`${isMobile ? 'text-xs' : 'text-[9px]'} text-[#7A8B80]`}>USD</p>
                    <p className={`font-bold ${isMobile ? 'text-lg' : 'text-sm'} text-[#3D7A5F]`}>{exposicionUSD}%</p>
                  </div>
                  <div className={`${isMobile ? 'p-3' : 'p-2'} bg-[#F5F4F0] rounded-xl text-center`}>
                    <p className={`${isMobile ? 'text-xs' : 'text-[9px]'} text-[#7A8B80]`}>ARS</p>
                    <p className={`font-bold ${isMobile ? 'text-lg' : 'text-sm'} text-[#C4846C]`}>{exposicionARS}%</p>
                  </div>
                  <div className={`${isMobile ? 'p-3' : 'p-2'} bg-[#F5F4F0] rounded-xl text-center`}>
                    <p className={`${isMobile ? 'text-xs' : 'text-[9px]'} text-[#7A8B80]`}>Total</p>
                    <p className={`font-bold ${isMobile ? 'text-lg' : 'text-sm'} ${totalAsignacion !== 100 ? 'text-red-500' : 'text-[#2D5A4A]'}`}>{totalAsignacion}%</p>
                  </div>
                </div>

                {/* Instrumentos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className={labelClass}>Instrumentos</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setInstruments(prev => [...prev, { nombre: '', tipo: '', asignacion: 0, moneda: 'USD', objetivo: '' }])} 
                      className={`${isMobile ? 'h-10 text-sm' : 'h-5 text-[10px]'} text-[#3D7A5F]`}
                    >
                      <Plus className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />Agregar
                    </Button>
                  </div>
                  <div className={`space-y-2 max-h-[${isMobile ? '350px' : '280px'}] overflow-y-auto pr-1`}>
                    {instruments.map((inst, i) => (
                      <div key={i} className={`${isMobile ? 'p-3' : 'p-2'} bg-[#F5F4F0] rounded-xl group relative`}>
                        <div className={`flex items-center ${isMobile ? 'gap-3 flex-wrap' : 'gap-2'}`}>
                          <Badge className={`bg-[#2D5A4A] ${isMobile ? 'text-xs h-6' : 'text-[9px] h-4'}`}>{inst.asignacion}%</Badge>
                          <Input 
                            value={inst.nombre} 
                            onChange={(e) => { const arr = [...instruments]; arr[i] = { ...arr[i], nombre: e.target.value }; setInstruments(arr) }} 
                            className={`${isMobile ? 'h-11 text-base flex-[2]' : 'h-6 text-xs flex-1'}`} 
                            placeholder="Nombre" 
                          />
                          <Select value={inst.moneda} onValueChange={(v) => { const arr = [...instruments]; arr[i] = { ...arr[i], moneda: v }; setInstruments(arr) }}>
                            <SelectTrigger className={`${isMobile ? 'w-20 h-11 text-sm' : 'w-14 h-6 text-[10px]'}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="ARS">ARS</SelectItem>
                              <SelectItem value="ARS/USD">Mix</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setInstruments(prev => prev.filter((_, j) => j !== i))} 
                            className={`${isMobile ? 'h-10 w-10' : 'h-5 w-5 p-0 opacity-0 group-hover:opacity-100'}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Asignacion estrategica */}
                <div>
                  <Label className={labelClass}>Asignación Estratégica ({totalAsignacionEstrategica}%)</Label>
                  <div className={`space-y-2 mt-2`}>
                    {asignacionEstrategica.map((asig, i) => (
                      <div key={i} className={`flex items-center ${isMobile ? 'gap-3 p-3' : 'gap-2 p-1.5'} bg-[#F5F4F0] rounded-xl`}>
                        <Badge className={`bg-[#3D7A5F] ${isMobile ? 'text-xs h-6' : 'text-[9px] h-4'}`}>{asig.porcentaje}%</Badge>
                        <span className={`${isMobile ? 'text-sm' : 'text-xs'} flex-1 truncate`}>{asig.horizonte}</span>
                        <Input 
                          type="number" 
                          value={asig.porcentaje} 
                          onChange={(e) => { const arr = [...asignacionEstrategica]; arr[i] = { ...arr[i], porcentaje: parseInt(e.target.value) || 0 }; setAsignacionEstrategica(arr) }} 
                          className={`${isMobile ? 'w-16 h-11 text-base' : 'w-12 h-6 text-[10px]'}`} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TAB: OTROS */}
            {activeSection === 'otros' && (
              <>
                {/* ONs */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className={labelClass}>ONs en USD ({obligacionesNegociables.length})</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setObligacionesNegociables(prev => [...prev, { emisor: '', cupon: '', vencimiento: '', ticker: '', moneda: 'USD', pago: 'Semestral' }])} 
                      className={`${isMobile ? 'h-10 text-sm' : 'h-5 text-[10px]'} text-[#3D7A5F]`}
                    >
                      <Plus className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />Agregar
                    </Button>
                  </div>
                  <div className={`space-y-2 max-h-[${isMobile ? '200px' : '120px'}] overflow-y-auto`}>
                    {obligacionesNegociables.map((on, i) => (
                      <div key={i} className={`${isMobile ? 'grid-cols-5 gap-2 p-3' : 'grid-cols-4 gap-1 p-1.5'} grid bg-[#F5F4F0] rounded-xl group`}>
                        <Input 
                          value={on.emisor} 
                          onChange={(e) => { const arr = [...obligacionesNegociables]; arr[i] = { ...arr[i], emisor: e.target.value }; setObligacionesNegociables(arr) }} 
                          className={`${isMobile ? 'h-11 text-sm' : 'h-6 text-[10px]'}`} 
                          placeholder="Emisor" 
                        />
                        <Input 
                          value={on.cupon} 
                          onChange={(e) => { const arr = [...obligacionesNegociables]; arr[i] = { ...arr[i], cupon: e.target.value }; setObligacionesNegociables(arr) }} 
                          className={`${isMobile ? 'h-11 text-sm' : 'h-6 text-[10px]'}`} 
                          placeholder="Cupón" 
                        />
                        <Input 
                          value={on.ticker} 
                          onChange={(e) => { const arr = [...obligacionesNegociables]; arr[i] = { ...arr[i], ticker: e.target.value }; setObligacionesNegociables(arr) }} 
                          className={`${isMobile ? 'h-11 text-sm' : 'h-6 text-[10px]'}`} 
                          placeholder="Ticker" 
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setObligacionesNegociables(prev => prev.filter((_, j) => j !== i))} 
                          className={`${isMobile ? 'h-11 w-11' : 'h-6 w-6 p-0 opacity-0 group-hover:opacity-100'}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Riesgos */}
                <div>
                  <Label className={`${labelClass} mt-2`}>Riesgos ({riesgos.length})</Label>
                  <div className={`space-y-2 mt-2 max-h-[${isMobile ? '200px' : '100px'}] overflow-y-auto`}>
                    {riesgos.map((r, i) => (
                      <div key={i} className={`${isMobile ? 'grid-cols-1 gap-2 p-3' : 'grid-cols-3 gap-1 p-1.5'} grid bg-[#F5F4F0] rounded-xl`}>
                        <Input 
                          value={r.riesgo} 
                          onChange={(e) => { const arr = [...riesgos]; arr[i] = { ...arr[i], riesgo: e.target.value }; setRiesgos(arr) }} 
                          className={`${isMobile ? 'h-11 text-sm' : 'h-6 text-[10px]'}`} 
                          placeholder="Riesgo" 
                        />
                        <Select value={r.nivel} onValueChange={(v: 'Bajo' | 'Medio' | 'Alto') => { const arr = [...riesgos]; arr[i] = { ...arr[i], nivel: v }; setRiesgos(arr) }}>
                          <SelectTrigger className={`${isMobile ? 'h-11 text-sm' : 'h-6 text-[10px]'}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bajo">Bajo</SelectItem>
                            <SelectItem value="Medio">Medio</SelectItem>
                            <SelectItem value="Alto">Alto</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input 
                          value={r.mitigacion} 
                          onChange={(e) => { const arr = [...riesgos]; arr[i] = { ...arr[i], mitigacion: e.target.value }; setRiesgos(arr) }} 
                          className={`${isMobile ? 'h-11 text-sm' : 'h-6 text-[10px]'}`} 
                          placeholder="Mitigación" 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Beneficios fiscales */}
                <div>
                  <Label className={`${labelClass} mt-2`}>Beneficios Fiscales</Label>
                  <div className={`space-y-2 mt-2 max-h-[${isMobile ? '150px' : '80px'}] overflow-y-auto`}>
                    {beneficiosFiscales.map((b, i) => (
                      <Textarea 
                        key={i} 
                        value={b} 
                        onChange={(e) => { const arr = [...beneficiosFiscales]; arr[i] = e.target.value; setBeneficiosFiscales(arr) }} 
                        className={`${isMobile ? 'text-sm min-h-[50px] p-3' : 'text-[10px] min-h-[30px] py-1'} rounded-xl`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Termino y Consejo */}
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-2'} mt-2`}>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <input 
                        type="checkbox" 
                        checked={usarTerminoIA} 
                        onChange={(e) => setUsarTerminoIA(e.target.checked)} 
                        className={`rounded text-[#3D7A5F] ${isMobile ? 'w-5 h-5' : ''}`} 
                      />
                      <Label className={`${isMobile ? 'text-sm' : 'text-[10px]'}`}>Término IA</Label>
                    </div>
                    {!usarTerminoIA && (
                      <Textarea 
                        value={terminoFinanciero} 
                        onChange={(e) => setTerminoFinanciero(e.target.value)} 
                        className={`${isMobile ? 'text-sm min-h-[80px] p-3' : 'text-[10px] min-h-[40px]'} rounded-xl`} 
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <input 
                        type="checkbox" 
                        checked={usarConsejoIA} 
                        onChange={(e) => setUsarConsejoIA(e.target.checked)} 
                        className={`rounded text-[#3D7A5F] ${isMobile ? 'w-5 h-5' : ''}`} 
                      />
                      <Label className={`${isMobile ? 'text-sm' : 'text-[10px]'}`}>Consejo IA</Label>
                    </div>
                    {!usarConsejoIA && (
                      <Textarea 
                        value={consejoFinal} 
                        onChange={(e) => setConsejoFinal(e.target.value)} 
                        className={`${isMobile ? 'text-sm min-h-[80px] p-3' : 'text-[10px] min-h-[40px]'} rounded-xl`} 
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Boton generar fijo al pie */}
          <div className={`${isMobile ? 'p-4' : 'p-3'} border-t border-[#E8E6E0] bg-white flex-shrink-0`}>
            <Button 
              onClick={handleGeneratePlan} 
              disabled={isLoading} 
              className={`w-full bg-[#2D5A4A] hover:bg-[#3D7A5F] ${isMobile ? 'h-14 text-base' : 'h-10'} rounded-xl`}
            >
              {isLoading ? (
                <><Loader2 className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} animate-spin mr-2`} />Generando...</>
              ) : (
                <><Sparkles className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} mr-2`} />Generar Plan</>
              )}
            </Button>
          </div>
        </div>

        {/* Panel Derecho - Preview */}
        <div className={`
          ${isMobile 
            ? `fixed inset-0 top-[60px] bottom-[72px] z-40 bg-[#F5F4F0] transition-transform duration-300 ${mobilePanel === 'preview' ? 'translate-x-0' : 'translate-x-full'}`
            : 'flex-1 flex flex-col bg-[#F5F4F0] overflow-hidden'
          }
        `}>
          {/* Header preview */}
          <div className={`flex items-center justify-between ${isMobile ? 'px-4 py-3' : 'px-4 py-2'} bg-white border-b border-[#E8E6E0] flex-shrink-0`}>
            <span className={`${isMobile ? 'text-base' : 'text-sm'} font-medium text-[#1F2D26]`}>Vista Previa</span>
            {generatedHTML && (
              <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-1'}`}>
                {/* View mode toggle */}
                <div className={`flex bg-[#F5F4F0] rounded-xl ${isMobile ? 'p-1 mr-2' : 'p-0.5 mr-2'}`}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setViewMode('preview')} 
                    className={`${isMobile ? 'h-10 text-sm px-3' : 'h-7 text-xs'} rounded-lg ${viewMode === 'preview' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Eye className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />Vista
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setViewMode('edit')} 
                    className={`${isMobile ? 'h-10 text-sm px-3' : 'h-7 text-xs'} rounded-lg ${viewMode === 'edit' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Edit3 className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />Editar
                  </Button>
                </div>
                
                {/* Action buttons - horizontal scroll on mobile */}
                <div className={`flex ${isMobile ? 'overflow-x-auto scrollbar-hide gap-2' : 'gap-1'}`}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopyToClipboard} 
                    className={`${isMobile ? 'h-10 text-sm px-3 flex-shrink-0' : 'h-7 text-xs'} border-[#5A9E7F] text-[#5A9E7F] rounded-xl`}
                  >
                    {copied ? (
                      <><Check className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />Listo</>
                    ) : (
                      <><Copy className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />Copiar</>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownloadHTML} 
                    className={`${isMobile ? 'h-10 text-sm px-3 flex-shrink-0' : 'h-7 text-xs'} border-[#C4846C] text-[#C4846C] rounded-xl`}
                  >
                    <FileCode className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />HTML
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownloadPDF} 
                    disabled={isDownloadingPdf} 
                    className={`${isMobile ? 'h-10 text-sm px-3 flex-shrink-0' : 'h-7 text-xs'} border-[#2D5A4A] text-[#2D5A4A] rounded-xl`}
                  >
                    {isDownloadingPdf ? (
                      <><Loader2 className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} animate-spin mr-1`} />...</>
                    ) : (
                      <><FileDown className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />PDF</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Contenido preview */}
          <div className={`flex-1 overflow-auto ${isMobile ? 'p-2' : 'p-4'}`} ref={previewRef}>
            {generatedHTML ? (
              viewMode === 'preview' ? (
                <div className="bg-white rounded-xl shadow-sm border border-[#E8E6E0] overflow-hidden h-full">
                  <iframe 
                    srcDoc={editableHTML} 
                    title="Preview" 
                    className={`w-full ${isMobile ? 'h-full min-h-[500px]' : 'h-[calc(100vh-180px)]'} bg-[#FAFAF8]`} 
                  />
                </div>
              ) : (
                <Textarea 
                  value={editableHTML} 
                  onChange={(e) => setEditableHTML(e.target.value)} 
                  className={`font-mono ${isMobile ? 'text-xs min-h-[500px] p-3' : 'text-[10px] min-h-[calc(100vh-180px)]'} bg-white rounded-xl`} 
                  placeholder="HTML..." 
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#7A8B80]">
                <FileText className={`${isMobile ? 'w-20 h-20' : 'w-16 h-16'} mb-4 opacity-30`} />
                <p className={`${isMobile ? 'text-lg' : 'font-medium'}`}>Sin plan generado</p>
                <p className={`${isMobile ? 'text-base mt-2' : 'text-sm mt-1'}`}>Completa el formulario y genera el plan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E6E0] z-50 safe-area-bottom">
          <div className="flex">
            {mobileBottomTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setMobilePanel(tab.id as 'form' | 'preview')}
                className={`
                  flex-1 py-3 px-4 flex flex-col items-center justify-center gap-1 transition-colors relative
                  ${mobilePanel === tab.id 
                    ? 'text-[#2D5A4A]' 
                    : 'text-[#7A8B80]'
                  }
                `}
              >
                {mobilePanel === tab.id && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#2D5A4A] rounded-b-full" />
                )}
                <tab.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{tab.label}</span>
                {tab.id === 'preview' && generatedHTML && (
                  <div className="absolute top-2 right-1/4 w-2 h-2 bg-[#3D7A5F] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Settings Sheet */}
      <MobileSettingsSheet
        isOpen={showMobileSettings}
        onClose={() => setShowMobileSettings(false)}
        asesorNombre={asesorNombre}
        setAsesorNombre={setAsesorNombre}
        platformLinks={platformLinks}
        setPlatformLinks={setPlatformLinks}
        socialLinks={socialLinks}
        setSocialLinks={setSocialLinks}
        asesorRecomendacion={asesorRecomendacion}
        setAsesorRecomendacion={setAsesorRecomendacion}
        onReset={handleResetConfig}
        onSave={handleSaveConfig}
        configSaved={configSaved}
      />

      {/* Hide scrollbar for pills on mobile */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
      `}</style>
    </div>
  )
}
