'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
} from 'lucide-react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

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

const normalizeWeights = <T extends { asignacion?: number; porcentaje?: number; locked?: boolean }>(
  items: T[],
  key: 'asignacion' | 'porcentaje'
): T[] => {
  if (items.length === 0) return items
  const currentTotal = items.reduce((sum, item) => sum + (Number(item[key]) || 0), 0)
  if (currentTotal === 0) {
    const perItem = Math.floor(100 / items.length)
    const newItems = items.map(item => ({ ...item, [key]: perItem }))
    let sum = newItems.reduce((s, i) => s + (Number(i[key]) || 0), 0)
    let i = 0
    while (sum < 100) {
      newItems[i % items.length][key] = (Number(newItems[i % items.length][key]) || 0) + 1
      sum++
      i++
    }
    return newItems
  }

  const factor = 100 / currentTotal
  const newItems = items.map(item => ({ ...item, [key]: Math.round((Number(item[key]) || 0) * factor) }))

  let currentSum = newItems.reduce((sum, item) => sum + (Number(item[key]) || 0), 0)
  let attempts = 0
  while (currentSum !== 100 && attempts < 100) {
    const diff = 100 - currentSum
    const step = diff > 0 ? 1 : -1
    for (let i = 0; i < newItems.length; i++) {
      const val = Number(newItems[i][key]) || 0
      if (val + step >= 0) {
        newItems[i][key] = val + step
        currentSum += step
        if (currentSum === 100) break
      }
    }
    attempts++
  }
  return newItems
}

const adjustWeights = <T extends { asignacion?: number; porcentaje?: number; locked?: boolean }>(
  items: T[],
  changedIndex: number,
  newValue: number,
  key: 'asignacion' | 'porcentaje'
): T[] => {
  const newItems = [...items]
  const oldItem = newItems[changedIndex]
  const cappedValue = Math.min(100, Math.max(0, newValue))
  newItems[changedIndex] = { ...oldItem, [key]: cappedValue }

  const unlockedItemsIndices = newItems
    .map((item, index) => ({ item, index }))
    .filter(({ item, index }) => index !== changedIndex && !item.locked)
    .map(({ index }) => index)

  if (unlockedItemsIndices.length === 0) return newItems

  const currentOtherTotal = newItems.reduce((sum, item, index) => {
    if (index === changedIndex) return sum
    return sum + (Number(item[key]) || 0)
  }, 0)

  const targetOtherTotal = 100 - cappedValue
  if (currentOtherTotal === 0) {
    const perItem = targetOtherTotal / unlockedItemsIndices.length
    unlockedItemsIndices.forEach(idx => {
      newItems[idx] = { ...newItems[idx], [key]: Math.round(perItem) }
    })
  } else {
    const factor = targetOtherTotal / currentOtherTotal
    unlockedItemsIndices.forEach(idx => {
      const val = Number(newItems[idx][key]) || 0
      newItems[idx] = { ...newItems[idx], [key]: Math.round(val * factor) }
    })
  }

  let currentSum = newItems.reduce((sum, item) => sum + (Number(item[key]) || 0), 0)
  let attempts = 0
  while (currentSum !== 100 && attempts < 10) {
    const diff = 100 - currentSum
    const step = diff > 0 ? 1 : -1
    for (const idx of unlockedItemsIndices) {
      const val = Number(newItems[idx][key]) || 0
      if (val + step >= 0) {
        newItems[idx] = { ...newItems[idx], [key]: val + step }
        currentSum += step
        if (currentSum === 100) break
      }
    }
    attempts++
  }
  return newItems
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
  configSaved: boolean
}

function MobileSettingsSheet({
  isOpen, onClose, asesorNombre, setAsesorNombre, platformLinks, setPlatformLinks, socialLinks, setSocialLinks, asesorRecomendacion, setAsesorRecomendacion, onReset, configSaved,
}: MobileSettingsSheetProps) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 bg-[#E8E6E0] rounded-full" /></div>
        <div className="flex items-center justify-between px-4 pb-3 border-b border-[#E8E6E0]">
          <h2 className="text-lg font-semibold text-[#1F2D26]">Configuración</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onReset} className="text-[#C4846C] text-sm h-9"><RotateCcw className="w-4 h-4 mr-1" />Restaurar</Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9 rounded-full"><X className="w-5 h-5" /></Button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-4 space-y-5">
          <div><Label className="text-sm font-medium text-[#3D7A5F] mb-2 block">Tu nombre</Label><Input value={asesorNombre} onChange={(e) => setAsesorNombre(e.target.value)} placeholder="Juan Perez" className="h-12 text-base rounded-xl" /></div>
          <div><Label className="text-sm font-medium text-[#3D7A5F] mb-2 block">Plataformas</Label><div className="space-y-2">{platformLinks.map((link, i) => (<div key={i} className="flex gap-2"><Input value={link.name} onChange={(e) => { const l = [...platformLinks]; l[i] = { ...l[i], name: e.target.value }; setPlatformLinks(l) }} className="h-11 text-base flex-1 rounded-xl" placeholder="Nombre" /><Input value={link.url} onChange={(e) => { const l = [...platformLinks]; l[i] = { ...l[i], url: e.target.value }; setPlatformLinks(l) }} className="h-11 text-base flex-[2] rounded-xl" placeholder="URL" /></div>))}</div></div>
          <div><Label className="text-sm font-medium text-[#3D7A5F] mb-2 block">Redes Sociales</Label><div className="space-y-2">{socialLinks.map((link, i) => (<div key={i} className="flex gap-2"><div className="flex items-center gap-2 flex-1">{link.icon === 'instagram' ? <Instagram className="w-5 h-5 text-[#E1306C] flex-shrink-0" /> : <MessageCircle className="w-5 h-5 text-[#25D366] flex-shrink-0" />}<Input value={link.name} onChange={(e) => { const l = [...socialLinks]; l[i] = { ...l[i], name: e.target.value }; setSocialLinks(l) }} className="h-11 text-base rounded-xl" /></div><Input value={link.url} onChange={(e) => { const l = [...socialLinks]; l[i] = { ...l[i], url: e.target.value }; setSocialLinks(l) }} className="h-11 text-base flex-[2] rounded-xl" placeholder="URL" /></div>))}</div></div>
          <div className="flex items-center gap-3 py-2"><input type="checkbox" checked={asesorRecomendacion} onChange={(e) => setAsesorRecomendacion(e.target.checked)} className="w-5 h-5 rounded text-[#3D7A5F] accent-[#3D7A5F]" /><Label className="text-base">Incluir recomendaciones</Label></div>
        </div>
        <div className="p-4 border-t border-[#E8E6E0] bg-[#F5F4F0]"><div className="flex items-center justify-center py-2 px-4 bg-[#E8F5E9] text-[#2D5A4A] rounded-xl border border-[#C8E6C9] animate-in fade-in zoom-in duration-300"><Check className="w-5 h-5 mr-2" /><span className="font-medium">Cambios guardados automáticamente</span></div><Button onClick={onClose} className="w-full h-12 mt-4 bg-[#2D5A4A] hover:bg-[#3D7A5F] rounded-xl text-base">Listo</Button></div>
      </div>
    </div>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<'form' | 'preview'>('form')
  const [showMobileSettings, setShowMobileSettings] = useState(false)
  
  const [edad, setEdad] = useState(24)
  const [profesion, setProfesion] = useState('Estudiante')
  const [objetivo, setObjetivo] = useState('Fondo de emergencia')
  const [aporteMensual, setAporteMensual] = useState(300)
  const [perfilRiesgo, setPerfilRiesgo] = useState('Moderado-Conservador')
  const [horizonteMeses, setHorizonteMeses] = useState(36)
  const [gastosPrincipales, setGastosPrincipales] = useState('')
  const [observaciones, setObservaciones] = useState('')

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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const [isLoaded, setIsLoaded] = useState(false)
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
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    const timer = setTimeout(() => {
      saveConfig({ asignacionEstrategica, instruments, obligacionesNegociables, riesgos, beneficiosFiscales, terminoFinanciero, usarTerminoIA, consejoFinal, usarConsejoIA, platformLinks, socialLinks, asesorNombre, asesorRecomendacion })
      setConfigSaved(true)
      setTimeout(() => setConfigSaved(false), 2000)
    }, 1000)
    return () => clearTimeout(timer)
  }, [isLoaded, asignacionEstrategica, instruments, obligacionesNegociables, riesgos, beneficiosFiscales, terminoFinanciero, usarTerminoIA, consejoFinal, usarConsejoIA, platformLinks, socialLinks, asesorNombre, asesorRecomendacion])

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

  const totalAsignacion = instruments.reduce((sum, i) => sum + i.asignacion, 0)
  const totalAsignacionEstrategica = asignacionEstrategica.reduce((sum, a) => sum + a.porcentaje, 0)
  const metaCalculada = aporteMensual * horizonteMeses
  const formatNumber = (num: number) => num.toLocaleString('es-AR')
  const exposicionUSD = instruments.filter(i => i.moneda.includes('USD')).reduce((sum, i) => sum + i.asignacion, 0)
  const exposicionARS = instruments.filter(i => i.moneda === 'ARS').reduce((sum, i) => sum + i.asignacion, 0)

  const handleGeneratePlan = async () => {
    setIsLoading(true)
    try {
      const formData = { edad, profesion, objetivo, aporteMensual, perfilRiesgo, horizonteMeses, gastosPrincipales, observaciones, asignacionEstrategica, instruments, obligacionesNegociables, riesgos, beneficiosFiscales, terminoFinanciero, usarTerminoIA, consejoFinal, usarConsejoIA, platformLinks, socialLinks, asesorNombre, asesorRecomendacion, attachedFiles }
      const response = await fetch('/api/generate-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      const data = await response.json()
      if (data.html) { setGeneratedHTML(data.html); setEditableHTML(data.html); setViewMode('preview'); if (isMobile) setMobilePanel('preview') }
    } catch (error) { console.error('Error:', error) } finally { setIsLoading(false) }
  }

  const handleCopyToClipboard = async () => {
    try { await navigator.clipboard.writeText(editableHTML); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  const handleDownloadHTML = () => {
    const blob = new Blob([editableHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `plan-${edad}anos.html`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
  }

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return
    setIsDownloadingPdf(true)
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')])
      const iframe = previewRef.current.querySelector('iframe')
      if (!iframe || !iframe.contentDocument) throw new Error('No iframe')
      const canvas = await html2canvas(iframe.contentDocument.body, { scale: 2, useCORS: true, backgroundColor: '#FAFAF8', windowWidth: 900 })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const imgWidth = 210, pageHeight = 297, imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight, position = 0
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); heightLeft -= pageHeight
      while (heightLeft > 0) { position = heightLeft - imgHeight; pdf.addPage(); pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); heightLeft -= pageHeight }
      pdf.save(`plan-${edad}anos.pdf`)
    } catch (error) { console.error('Error al generar PDF:', error); alert('Error al generar PDF') } finally { setIsDownloadingPdf(false) }
  }

  const editorProps = {
    isMobile, activeSection, setActiveSection, edad, setEdad, aporteMensual, setAporteMensual, horizonteMeses, setHorizonteMeses, profesion, setProfesion, objetivo, setObjetivo, perfilRiesgo, setPerfilRiesgo, gastosPrincipales, setGastosPrincipales, attachedFiles, setAttachedFiles, handleFileUpload, fileInputRef, instruments, setInstruments, asignacionEstrategica, setAsignacionEstrategica, exposicionUSD, exposicionARS, totalAsignacion, totalAsignacionEstrategica, adjustWeights, normalizeWeights, obligacionesNegociables, setObligacionesNegociables, riesgos, setRiesgos, beneficiosFiscales, setBeneficiosFiscales, usarTerminoIA, setUsarTerminoIA, terminoFinanciero, setTerminoFinanciero, usarConsejoIA, setUsarConsejoIA, consejoFinal, setConsejoFinal, metaCalculada, formatNumber
  }

  const previewProps = {
    isMobile, generatedHTML, viewMode, setViewMode, editableHTML, setEditableHTML, handleCopyToClipboard, handleDownloadHTML, handleDownloadPDF, isDownloadingPdf, copied, previewRef
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <header className="bg-[#2D5A4A] text-white md:py-3 py-2.5 px-4 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="p-2 bg-white/10 rounded-xl"><TrendingUp className="w-5 h-5" /></div><div><h1 className="md:text-lg text-base font-bold">Cactus</h1><p className="text-xs text-[#8BC4A8]">Generador de Planes</p></div></div>
          <div className="flex items-center gap-4">
            {!isMobile && <div className={`flex items-center text-xs transition-opacity duration-500 ${configSaved ? 'opacity-100' : 'opacity-40'} text-[#8BC4A8]`}><Check className="w-3 h-3 mr-1" />Auto-guardado</div>}
            {isMobile ? (
              <Button variant="outline" size="icon" onClick={() => setShowMobileSettings(true)} className="bg-white/10 border-white/15 text-white hover:bg-white/20 rounded-lg h-10 w-10"><Settings className="w-5 h-5" /></Button>
            ) : (
              <Popover>
                <PopoverTrigger asChild><Button variant="outline" size="icon" className="bg-white/10 border-white/15 text-white hover:bg-white/20 rounded-lg h-8 w-8"><Settings className="w-4 h-4" /></Button></PopoverTrigger>
                <PopoverContent className="w-80 bg-white border-[#E8E6E0] shadow-xl rounded-xl" align="end">
                  <div className="space-y-3 p-1">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F0EEE8]"><span className="font-medium text-sm">Configuracion</span><Button variant="ghost" size="sm" onClick={handleResetConfig} className="text-[#C4846C] text-xs h-6 px-2"><RotateCcw className="w-3 h-3 mr-1" />Restaurar</Button></div>
                    <div><Label className="text-xs text-[#3D7A5F]">Tu nombre</Label><Input value={asesorNombre} onChange={(e) => setAsesorNombre(e.target.value)} placeholder="Juan Perez" className="h-8 text-sm mt-1" /></div>
                    <div><Label className="text-xs text-[#3D7A5F]">Plataformas</Label>{platformLinks.map((link, i) => (<div key={i} className="flex gap-1 mt-1"><Input value={link.name} onChange={(e) => { const l = [...platformLinks]; l[i] = { ...l[i], name: e.target.value }; setPlatformLinks(l) }} className="h-7 text-xs w-24" /><Input value={link.url} onChange={(e) => { const l = [...platformLinks]; l[i] = { ...l[i], url: e.target.value }; setPlatformLinks(l) }} className="h-7 text-xs flex-1" /></div>))}</div>
                    <div><Label className="text-xs text-[#3D7A5F]">Redes</Label>{socialLinks.map((link, i) => (<div key={i} className="flex gap-1 mt-1"><div className="flex items-center gap-1 w-24">{link.icon === 'instagram' ? <Instagram className="w-3 h-3 text-[#E1306C]" /> : <MessageCircle className="w-3 h-3 text-[#25D366]" />}<Input value={link.name} onChange={(e) => { const l = [...socialLinks]; l[i] = { ...l[i], name: e.target.value }; setSocialLinks(l) }} className="h-7 text-xs flex-1" /></div><Input value={link.url} onChange={(e) => { const l = [...socialLinks]; l[i] = { ...l[i], url: e.target.value }; setSocialLinks(l) }} className="h-7 text-xs flex-1" /></div>))}</div>
                    <div className="flex items-center gap-2 pt-2 border-t border-[#F0EEE8]"><input type="checkbox" checked={asesorRecomendacion} onChange={(e) => setAsesorRecomendacion(e.target.checked)} className="rounded text-[#3D7A5F]" /><Label className="text-xs">Incluir recomendaciones</Label></div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {!isMobile ? (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={25} minSize={20} maxSize={45}>
              <div className="h-full bg-white flex flex-col overflow-hidden border-r border-[#E8E6E0]">
                <PortfolioEditor {...editorProps} />
                <div className="p-3 border-t border-[#E8E6E0] bg-white flex-shrink-0">
                  <Button onClick={handleGeneratePlan} disabled={isLoading} className="w-full bg-[#2D5A4A] hover:bg-[#3D7A5F] h-10 rounded-xl">
                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Generando...</> : <><Sparkles className="w-4 h-4 mr-2" />Generar Plan</>}
                  </Button>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-[#E8E6E0] w-1.5 hover:bg-[#3D7A5F]/20 transition-colors" />
            <ResizablePanel defaultSize={75}>
              <PortfolioPreview {...previewProps} />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <>
            <div className={`fixed inset-0 top-[60px] z-40 bg-white flex flex-col transition-transform duration-300 ${mobilePanel === 'form' ? 'translate-x-0' : '-translate-x-full'}`} style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}>
              <PortfolioEditor {...editorProps} />
              <div className="p-4 border-t border-[#E8E6E0] bg-white flex-shrink-0">
                <Button onClick={handleGeneratePlan} disabled={isLoading} className="w-full bg-[#2D5A4A] hover:bg-[#3D7A5F] h-14 text-base rounded-xl">
                  {isLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Generando...</> : <><Sparkles className="w-5 h-5 mr-2" />Generar Plan</>}
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
            <button onClick={() => setMobilePanel('form')} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors relative ${mobilePanel === 'form' ? 'text-[#2D5A4A]' : 'text-[#7A8B80]'}`}>
              {mobilePanel === 'form' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#2D5A4A] rounded-b-full" />}
              <ClipboardList className="w-6 h-6" /><span className="text-xs font-medium">Formulario</span>
            </button>
            <button onClick={() => setMobilePanel('preview')} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors relative ${mobilePanel === 'preview' ? 'text-[#2D5A4A]' : 'text-[#7A8B80]'}`}>
              {mobilePanel === 'preview' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#2D5A4A] rounded-b-full" />}
              <Eye className="w-6 h-6" /><span className="text-xs font-medium">Preview</span>
              {generatedHTML && <div className="absolute top-2 right-1/4 w-2 h-2 bg-[#3D7A5F] rounded-full" />}
            </button>
          </div>
        </div>
      )}

      <MobileSettingsSheet isOpen={showMobileSettings} onClose={() => setShowMobileSettings(false)} asesorNombre={asesorNombre} setAsesorNombre={setAsesorNombre} platformLinks={platformLinks} setPlatformLinks={setPlatformLinks} socialLinks={socialLinks} setSocialLinks={setSocialLinks} asesorRecomendacion={asesorRecomendacion} setAsesorRecomendacion={setAsesorRecomendacion} onReset={handleResetConfig} configSaved={configSaved} />

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
