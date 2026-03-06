import React, { useMemo } from 'react';
import { AllocationChart } from "./Charts"
import {
  User,
  Building2,
  Settings,
  Paperclip,
  FileUp,
  FileText,
  X,
  Sparkles,
  Plus,
  Lock,
  Unlock,
  Trash2,
  Percent
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Instrument,
  AsignacionEstrategica,
  ObligacionNegociable,
  Riesgo,
  AttachedFile
} from './types'

interface PortfolioEditorProps {
  wizardStep: number
  setWizardStep: (v: number) => void
  ingresosMensuales: number
  setIngresosMensuales: (v: number) => void
  gastosMensuales: number
  setGastosMensuales: (v: number) => void
  fondoEmergenciaMeses: number
  setFondoEmergenciaMeses: (v: number) => void
  fondoEmergenciaActual: number
  setFondoEmergenciaActual: (v: number) => void
  metasVida: any[]
  setMetasVida: (v: any) => void
  proyeccionRetiro: string
  setProyeccionRetiro: (v: string) => void
  patrimonioActivos: number
  setPatrimonioActivos: (v: number) => void
  patrimonioDeudas: number
  setPatrimonioDeudas: (v: number) => void
  isMobile: boolean
  activeSection: string
  setActiveSection: (section: string) => void
  // Cliente
  edad: number
  setEdad: (v: number) => void
  aporteInicial: number
  setAporteInicial: (v: number) => void
  aporteMensual: number
  setAporteMensual: (v: number) => void
  horizonteMeses: number
  setHorizonteMeses: (v: number) => void
  profesion: string
  setProfesion: (v: string) => void
  objetivo: string
  setObjetivo: (v: string) => void
  perfilRiesgo: string
  setPerfilRiesgo: (v: string) => void
  gastosPrincipales: string
  setGastosPrincipales: (v: string) => void
  attachedFiles: AttachedFile[]
  setAttachedFiles: (v: any) => void
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  // Cartera
  instruments: Instrument[]
  setInstruments: (v: any) => void
  asignacionEstrategica: AsignacionEstrategica[]
  setAsignacionEstrategica: (v: any) => void
  exposicionUSD: number
  exposicionARS: number
  totalAsignacion: number
  totalAsignacionEstrategica: number
  adjustWeights: <T>(items: T[], changedIndex: number, newValue: number, key: any) => T[]
  normalizeWeights: <T>(items: T[], key: any) => T[]
  // Otros
  obligacionesNegociables: ObligacionNegociable[]
  setObligacionesNegociables: (v: any) => void
  riesgos: Riesgo[]
  setRiesgos: (v: any) => void
  beneficiosFiscales: string[]
  setBeneficiosFiscales: (v: any) => void
  usarTerminoIA: boolean
  setUsarTerminoIA: (v: boolean) => void
  terminoFinanciero: string
  setTerminoFinanciero: (v: string) => void
  usarConsejoIA: boolean
  setUsarConsejoIA: (v: boolean) => void
  consejoFinal: string
  setConsejoFinal: (v: string) => void
  // Meta
  metaCalculada: number
  formatNumber: (n: number) => string
}

export function PortfolioEditor({
  wizardStep, setWizardStep,
  ingresosMensuales, setIngresosMensuales,
  gastosMensuales, setGastosMensuales,
  fondoEmergenciaMeses, setFondoEmergenciaMeses,
  fondoEmergenciaActual, setFondoEmergenciaActual,
  metasVida, setMetasVida,
  proyeccionRetiro, setProyeccionRetiro,
  patrimonioActivos, setPatrimonioActivos,
  patrimonioDeudas, setPatrimonioDeudas,
  isMobile,
  activeSection,
  setActiveSection,
  edad, setEdad,
  aporteInicial, setAporteInicial,
  aporteMensual, setAporteMensual,
  horizonteMeses, setHorizonteMeses,
  profesion, setProfesion,
  objetivo, setObjetivo,
  perfilRiesgo, setPerfilRiesgo,
  gastosPrincipales, setGastosPrincipales,
  attachedFiles, setAttachedFiles,
  handleFileUpload,
  fileInputRef,
  instruments, setInstruments,
  asignacionEstrategica, setAsignacionEstrategica,
  exposicionUSD, exposicionARS,
  totalAsignacion, totalAsignacionEstrategica,
  adjustWeights, normalizeWeights,
  obligacionesNegociables, setObligacionesNegociables,
  riesgos, setRiesgos,
  beneficiosFiscales, setBeneficiosFiscales,
  usarTerminoIA, setUsarTerminoIA,
  terminoFinanciero, setTerminoFinanciero,
  usarConsejoIA, setUsarConsejoIA,
  consejoFinal, setConsejoFinal,
  metaCalculada, formatNumber
}: PortfolioEditorProps) {

  const steps = [
    { id: 0, label: "Perfil", section: "cliente" },
    { id: 1, label: "Salud Fin.", section: "salud" },
    { id: 2, label: "Metas", section: "metas" },
    { id: 3, label: "Cartera", section: "cartera" },
    { id: 4, label: "Final", section: "otros" },
  ]

  const tabs = [
    { id: 'cliente', label: 'Cliente', icon: User },
    { id: 'salud', label: 'Salud', icon: Building2 },
    { id: 'metas', label: 'Metas', icon: Building2 },
    { id: 'cartera', label: 'Cartera', icon: Building2 },
    { id: 'otros', label: 'Otros', icon: Settings },
  ]

  const inputClass = isMobile ? "h-12 text-base rounded-xl px-4" : "h-8 text-sm"
  const textareaClass = isMobile ? "text-base rounded-xl p-4 min-h-[100px]" : "text-sm min-h-[50px]"
  const labelClass = isMobile ? "text-sm font-medium text-[#3D7A5F] mb-2 block" : "text-[10px] text-[#7A8B80] uppercase tracking-wide"

  const nextStep = () => {
    const next = Math.min(steps.length - 1, wizardStep + 1);
    setWizardStep(next);
    setActiveSection(steps[next].section);
  }
  const prevStep = () => {
    const prev = Math.max(0, wizardStep - 1);
    setWizardStep(prev);
    setActiveSection(steps[prev].section);
  }

  const chartData = useMemo(() => instruments.map(i => ({ name: i.nombre, value: i.asignacion })), [instruments]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-[#F5F4F0] border-b border-[#E8E6E0] flex-shrink-0 px-4 py-3">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#E8E6E0] -translate-y-1/2 z-0" />
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => {
                setWizardStep(idx);
                setActiveSection(step.section);
              }}
              className="relative z-10 flex flex-col items-center gap-1.5 group"
            >
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all
                ${wizardStep === idx
                  ? 'bg-[#2D5A4A] text-white scale-110 shadow-lg shadow-[#2D5A4A]/20'
                  : wizardStep > idx
                    ? 'bg-[#3D7A5F] text-white'
                    : 'bg-white text-[#7A8B80] border border-[#E8E6E0] group-hover:border-[#3D7A5F]'
                }
              `}>
                {wizardStep > idx ? "✓" : idx + 1}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tighter ${wizardStep === idx ? 'text-[#2D5A4A]' : 'text-[#7A8B80]'}`}>
                {step.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4 space-y-4' : 'p-3 space-y-3'}`}>
        {activeSection === 'cliente' && (
          <>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-2'}`}>
              <div>
                <Label className={labelClass}>Edad</Label>
                <Input type="number" value={edad} onChange={(e) => setEdad(parseInt(e.target.value) || 0)} className={`${inputClass} mt-1`} />
              </div>
              <div>
                <Label className={labelClass}>Aporte Inicial</Label>
                <Input type="number" value={aporteInicial} onChange={(e) => setAporteInicial(parseInt(e.target.value) || 0)} className={`${inputClass} mt-1`} />
              </div>
              <div>
                <Label className={labelClass}>Aporte USD</Label>
                <Input type="number" value={aporteMensual} onChange={(e) => setAporteMensual(parseInt(e.target.value) || 0)} className={`${inputClass} mt-1`} />
              </div>
              <div>
                <Label className={labelClass}>Meses</Label>
                <Input type="number" value={horizonteMeses} onChange={(e) => setHorizonteMeses(parseInt(e.target.value) || 0)} className={`${inputClass} mt-1`} />
              </div>
            </div>
            <div>
              <Label className={labelClass}>Profesión</Label>
              <Input value={profesion} onChange={(e) => setProfesion(e.target.value)} className={`${inputClass} mt-1`} />
            </div>
            <div>
              <Label className={labelClass}>Objetivo</Label>
              <Textarea value={objetivo} onChange={(e) => setObjetivo(e.target.value)} className={`${textareaClass} mt-1`} />
            </div>
            <div>
              <Label className={labelClass}>Perfil de Riesgo</Label>
              <Select value={perfilRiesgo} onValueChange={setPerfilRiesgo}>
                <SelectTrigger className={`${inputClass} mt-1`}><SelectValue /></SelectTrigger>
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
              <Textarea value={gastosPrincipales} onChange={(e) => setGastosPrincipales(e.target.value)} className={`${textareaClass} mt-1`} placeholder="Ej: Alquiler $150k/mes" />
            </div>
            {aporteMensual > 0 && horizonteMeses > 0 && (
              <div className={`p-4 bg-gradient-to-r from-[#F5F4F0] to-white rounded-xl border border-[#E8E6E0] ${isMobile ? '' : 'p-3 rounded-lg'}`}>
                <div className="flex justify-between items-center">
                  <span className={`${isMobile ? 'text-sm' : 'text-xs'} font-medium text-[#1F2D26]`}>Meta</span>
                  <span className={`${isMobile ? 'text-2xl' : 'text-lg'} font-bold text-[#C4846C]`}>USD {formatNumber(metaCalculada)}</span>
                </div>
                <p className={`${isMobile ? 'text-xs' : 'text-[10px]'} text-[#5A9E7F] mt-1`}>{horizonteMeses} meses × USD {formatNumber(aporteMensual)}</p>
              </div>
            )}
            <div>
              <Label className={`${labelClass} flex items-center gap-2`}><Paperclip className="w-4 h-4" /> Documentos PDF</Label>
              <input ref={fileInputRef} type="file" accept="application/pdf" multiple onChange={handleFileUpload} className="hidden" />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className={`w-full ${isMobile ? 'h-12 text-base rounded-xl border-dashed mt-2' : 'h-8 text-xs mt-1 border-dashed'}`}>
                <FileUp className={`${isMobile ? 'w-5 h-5' : 'w-3 h-3'} mr-2`} /> Cargar PDF
              </Button>
              {attachedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachedFiles.map((file, i) => (
                    <div key={i} className={`flex items-center justify-between ${isMobile ? 'p-3' : 'p-2'} bg-[#F5F4F0] rounded-xl ${isMobile ? '' : 'rounded'} text-sm group`}>
                      <div className="flex items-center gap-2 truncate"><FileText className="w-4 h-4 text-[#C4846C] flex-shrink-0" /><span className="truncate">{file.name}</span></div>
                      <Button variant="ghost" size="sm" onClick={() => setAttachedFiles((prev: any) => prev.filter((_: any, j: number) => j !== i))} className={`${isMobile ? 'h-10 w-10' : 'h-5 w-5 p-0 opacity-0 group-hover:opacity-100'}`}><X className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeSection === 'salud' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className={labelClass}>Ingresos Mensuales</Label>
                <Input type="number" value={ingresosMensuales} onChange={(e) => setIngresosMensuales(parseInt(e.target.value) || 0)} className={inputClass} />
              </div>
              <div>
                <Label className={labelClass}>Gastos Mensuales</Label>
                <Input type="number" value={gastosMensuales} onChange={(e) => setGastosMensuales(parseInt(e.target.value) || 0)} className={inputClass} />
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#E8E6E0] shadow-sm">
              <Label className={labelClass}>Fondo de Emergencia (Meses)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Input type="number" value={fondoEmergenciaMeses} onChange={(e) => setFondoEmergenciaMeses(parseInt(e.target.value) || 0)} className="w-20 h-10 text-center font-bold" />
                <div className="flex-1 h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#3D7A5F] transition-all" style={{ width: `${Math.min(100, (fondoEmergenciaActual / (gastosMensuales * fondoEmergenciaMeses || 1)) * 100)}%` }}></div>
                </div>
              </div>
              <p className="text-[10px] text-[#7A8B80] mt-2">Objetivo: USD {(gastosMensuales * fondoEmergenciaMeses).toLocaleString()}</p>
            </div>
            <div>
              <Label className={labelClass}>Fondo de Emergencia Actual</Label>
              <Input type="number" value={fondoEmergenciaActual} onChange={(e) => setFondoEmergenciaActual(parseInt(e.target.value) || 0)} className={inputClass} />
            </div>
            <div className="p-4 bg-[#F5F4F0] rounded-2xl border border-[#E8E6E0]">
                <Label className={labelClass}>Patrimonio Neto</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-white p-2 rounded-xl border border-[#E8E6E0]">
                        <span className="text-[9px] uppercase font-bold text-[#7A8B80]">Activos</span>
                        <Input type="number" value={patrimonioActivos} onChange={(e) => setPatrimonioActivos(parseInt(e.target.value) || 0)} className="h-7 text-xs border-none p-0" />
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-[#E8E6E0]">
                        <span className="text-[9px] uppercase font-bold text-[#7A8B80]">Deudas</span>
                        <Input type="number" value={patrimonioDeudas} onChange={(e) => setPatrimonioDeudas(parseInt(e.target.value) || 0)} className="h-7 text-xs border-none p-0" />
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/50 flex justify-between items-center">
                    <span className="text-xs font-bold text-[#1F2D26]">Total Neto</span>
                    <span className="text-sm font-black text-[#2D5A4A]">USD {(patrimonioActivos - patrimonioDeudas).toLocaleString()}</span>
                </div>
            </div>
          </div>
        )}

        {activeSection === 'metas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <Label className={labelClass}>Metas de Vida</Label>
                <Button variant="ghost" size="sm" onClick={() => setMetasVida([...metasVida, { id: Date.now().toString(), descripcion: "", monto: 0, plazo: 12 }])} className="h-7 text-[10px] font-bold text-[#3D7A5F]"><Plus className="w-3 h-3 mr-1" />Agregar</Button>
            </div>
            <div className="space-y-3">
              {metasVida.map((meta: any, i: number) => (
                <div key={meta.id} className="p-4 bg-white rounded-2xl border border-[#E8E6E0] shadow-sm relative group transition-all hover:border-[#3D7A5F]/30">
                  <Button variant="ghost" size="sm" onClick={() => setMetasVida(metasVida.filter((m: any) => m.id !== meta.id))} className="absolute top-2 right-2 h-7 w-7 text-red-300 opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></Button>
                  <Input value={meta.descripcion} onChange={(e) => { const newMetas = [...metasVida]; newMetas[i].descripcion = e.target.value; setMetasVida(newMetas); }} className="h-8 text-sm font-bold border-none p-0 bg-transparent mb-2" placeholder="Nombre de la meta" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#F5F4F0] p-2 rounded-xl">
                        <span className="text-[9px] uppercase font-bold text-[#7A8B80]">Monto USD</span>
                        <Input type="number" value={meta.monto} onChange={(e) => { const newMetas = [...metasVida]; newMetas[i].monto = parseInt(e.target.value) || 0; setMetasVida(newMetas); }} className="h-6 text-xs border-none p-0 bg-transparent font-bold" />
                    </div>
                    <div className="bg-[#F5F4F0] p-2 rounded-xl">
                        <span className="text-[9px] uppercase font-bold text-[#7A8B80]">Plazo (meses)</span>
                        <Input type="number" value={meta.plazo} onChange={(e) => { const newMetas = [...metasVida]; newMetas[i].plazo = parseInt(e.target.value) || 0; setMetasVida(newMetas); }} className="h-6 text-xs border-none p-0 bg-transparent font-bold" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 bg-gradient-to-br from-[#2D5A4A] to-[#3D7A5F] rounded-3xl border border-[#2D5A4A] shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles className="w-16 h-16" /></div>
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#8BC4A8] mb-4 block">Plan de Retiro Estructurado</Label>
                <div className="space-y-4 relative z-10">
                    <p className="text-xs leading-relaxed text-[#D1E7DD] italic font-medium">"Un retiro exitoso comienza con la visualización clara de sus necesidades futuras."</p>
                    <Textarea
                      value={proyeccionRetiro}
                      onChange={(e) => setProyeccionRetiro(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[120px] rounded-2xl text-sm focus:border-white/40 focus:ring-0"
                      placeholder="Especifique edad de retiro deseada, ingresos proyectados y fondos actuales..."
                    />
                </div>
            </div>
          </div>
        )}
        {activeSection === 'cartera' && (
          <>
            <div className="bg-[#F5F4F0] rounded-2xl p-4 mb-4 border border-[#E8E6E0]">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/3 h-32 flex items-center justify-center">
                        <AllocationChart data={chartData} />
                    </div>
                    <div className="flex-1 w-full grid grid-cols-2 gap-2">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E8E6E0] text-center">
                            <p className="text-[10px] text-[#7A8B80] uppercase tracking-wider font-bold mb-1">Dólares</p>
                            <p className="text-xl font-black text-[#3D7A5F]">{exposicionUSD}%</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E8E6E0] text-center">
                            <p className="text-[10px] text-[#7A8B80] uppercase tracking-wider font-bold mb-1">Pesos</p>
                            <p className="text-xl font-black text-[#C4846C]">{exposicionARS}%</p>
                        </div>
                        <div className="p-3 bg-[#2D5A4A] rounded-xl shadow-md border border-[#2D5A4A] text-center col-span-2 group relative cursor-pointer active:scale-95 transition-transform" onClick={() => setInstruments(normalizeWeights(instruments, "asignacion"))}>
                            <p className="text-[10px] text-[#8BC4A8] uppercase tracking-wider font-bold mb-1">Asignación Total</p>
                            <p className={`text-2xl font-black ${totalAsignacion !== 100 ? "text-red-300" : "text-white"}`}>{totalAsignacion}%</p>
                            {totalAsignacion !== 100 && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl"><Sparkles className="w-5 h-5 text-white animate-pulse" /></div>}
                        </div>
                    </div>
                </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex flex-col">
                    <Label className="text-xs font-bold text-[#1F2D26] uppercase tracking-tight">Instrumentos</Label>
                    <span className="text-[10px] text-[#7A8B80]">{instruments.length} activos seleccionados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => {
                      let suggested = [];
                      if (perfilRiesgo === "Conservador") suggested = ["Money Market", "Renta Fija USD", "Renta Fija USD"];
                      else if (perfilRiesgo === "Moderado") suggested = ["Renta Fija USD", "Equity Internacional", "Renta Fija USD"];
                      else suggested = ["Equity Internacional", "Equity Internacional", "Equity Internacional"];

                      const newInstruments = suggested.map(type => ({
                          nombre: `Nuevo ${type}`,
                          tipo: type,
                          asignacion: Math.floor(100 / suggested.length),
                          moneda: type.includes("USD") || type.includes("Internacional") ? "USD" : "ARS",
                          objetivo: "Optimización",
                          locked: false
                      }));
                      setInstruments(normalizeWeights(newInstruments, 'asignacion'));
                  }} className="h-8 text-[10px] font-bold text-[#3D7A5F] uppercase hover:bg-white flex items-center gap-1"><Sparkles className="w-3 h-3" /> Sugerir</Button>
                  <Button variant="ghost" size="sm" onClick={() => { const perItem = Math.floor(100 / (instruments.length || 1)); const base = instruments.map(inst => ({ ...inst, asignacion: perItem, locked: false })); setInstruments(normalizeWeights(base, 'asignacion')); }} className="h-8 text-[10px] font-bold text-[#7A8B80] uppercase hover:bg-white">Igualar</Button>
                  <Button variant="outline" size="sm" onClick={() => setInstruments((prev: any) => { const currentTotal = prev.reduce((s: any, i: any) => s + i.asignacion, 0); const remaining = Math.max(0, 100 - currentTotal); return [...prev, { nombre: '', tipo: '', asignacion: remaining, moneda: 'USD', objetivo: '', locked: false }]; })} className="h-8 text-[10px] font-bold text-[#3D7A5F] uppercase border-[#3D7A5F]/20 hover:bg-[#3D7A5F] hover:text-white transition-all"><Plus className="w-3 h-3 mr-1" />Agregar</Button>
                </div>
              </div>
              <div className="space-y-4 overflow-y-auto pr-1 pb-4" style={{ maxHeight: isMobile ? '450px' : '400px' }}>
                {instruments.map((inst, i) => (
                  <div key={i} className={`p-4 bg-white rounded-2xl group relative border ${totalAsignacion !== 100 && !inst.locked ? 'border-amber-200' : 'border-[#E8E6E0]'} shadow-sm hover:shadow-md transition-shadow`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" onClick={() => { const arr = [...instruments]; arr[i] = { ...arr[i], locked: !arr[i].locked }; setInstruments(arr); }} className={`h-9 w-9 rounded-full ${inst.locked ? 'bg-amber-50 text-[#C4846C]' : 'bg-[#F5F4F0] text-[#7A8B80]'}`}>{inst.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}</Button>
                            <div className="relative">
                                <Input type="number" value={inst.asignacion} onChange={(e) => { const newVal = parseInt(e.target.value) || 0; setInstruments(adjustWeights(instruments, i, newVal, 'asignacion')); }} className="w-20 h-10 text-lg font-black text-center rounded-xl bg-[#F5F4F0] border-none focus-visible:ring-2 focus-visible:ring-[#2D5A4A]" />
                                <Percent className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8B80] pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <Select value={inst.moneda} onValueChange={(v) => { const arr = [...instruments]; arr[i] = { ...arr[i], moneda: v }; setInstruments(arr) }}><SelectTrigger className="w-24 h-9 rounded-xl font-bold text-xs bg-[#F5F4F0] border-none"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="ARS">ARS</SelectItem><SelectItem value="Mix">Mix</SelectItem></SelectContent></Select>
                             <Button variant="ghost" size="sm" onClick={() => setInstruments((prev: any) => prev.filter((_: any, j: number) => j !== i))} className="h-9 w-9 rounded-full text-red-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="w-4.5 h-4.5" /></Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="relative">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#3D7A5F] absolute -top-2 left-3 px-1.5 bg-white z-10">Instrumento</Label>
                            <Input value={inst.nombre} onChange={(e) => { const arr = [...instruments]; arr[i] = { ...arr[i], nombre: e.target.value }; setInstruments(arr) }} className="h-11 text-base font-semibold rounded-xl border-[#E8E6E0] focus:border-[#3D7A5F] focus:ring-0" placeholder="Ej: FCI Renta Variable" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#7A8B80] absolute -top-2 left-3 px-1.5 bg-white z-10">Categoría</Label>
                                <Select value={inst.tipo} onValueChange={(v) => { const arr = [...instruments]; arr[i] = { ...arr[i], tipo: v }; setInstruments(arr) }}>
                                    <SelectTrigger className="h-10 text-xs font-medium rounded-xl border-[#E8E6E0] bg-white"><SelectValue placeholder="Tipo" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Money Market">Money Market</SelectItem>
                                        <SelectItem value="Renta Fija ARS">Renta Fija ARS</SelectItem>
                                        <SelectItem value="Renta Fija USD">Renta Fija USD</SelectItem>
                                        <SelectItem value="Equity Internacional">Equity Internacional</SelectItem>
                                        <SelectItem value="Equity Local">Equity Local</SelectItem>
                                        <SelectItem value="Cripto">Cripto</SelectItem>
                                        <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="relative">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#7A8B80] absolute -top-2 left-3 px-1.5 bg-white z-10">Objetivo</Label>
                                <Input value={inst.objetivo} onChange={(e) => { const arr = [...instruments]; arr[i] = { ...arr[i], objetivo: e.target.value }; setInstruments(arr) }} className="h-10 text-sm font-medium rounded-xl border-[#E8E6E0] focus:border-[#3D7A5F]" placeholder="Ej: Liquidez" />
                            </div>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8E6E0] mt-4">
              <div className="flex items-center justify-between mb-4 px-1"><Label className="text-xs font-black uppercase tracking-tight text-[#1F2D26]">Asignación Estratégica</Label><Button variant="ghost" size="sm" onClick={() => setAsignacionEstrategica(normalizeWeights(asignacionEstrategica, 'porcentaje'))} className="h-8 text-[10px] font-bold text-[#3D7A5F] uppercase hover:bg-white">Balancear</Button></div>
              <div className="space-y-2">
                {asignacionEstrategica.map((asig, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 bg-white rounded-2xl border ${totalAsignacionEstrategica !== 100 ? 'border-amber-100' : 'border-[#E8E6E0]'} shadow-sm transition-all`}>
                    <Button variant="ghost" size="sm" onClick={() => { const arr = [...asignacionEstrategica]; arr[i] = { ...arr[i], locked: !arr[i].locked }; setAsignacionEstrategica(arr); }} className={`h-8 w-8 rounded-full ${asig.locked ? 'bg-amber-50 text-[#C4846C]' : 'bg-[#F5F4F0] text-[#7A8B80]'}`}>{asig.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}</Button>
                    <span className="text-sm flex-1 truncate font-bold text-[#4A5B50]">{asig.horizonte}</span>
                    <div className="relative">
                        <Input type="number" value={asig.porcentaje} onChange={(e) => { const newVal = parseInt(e.target.value) || 0; setAsignacionEstrategica(adjustWeights(asignacionEstrategica, i, newVal, 'porcentaje')); }} className="w-18 h-9 text-base font-black text-center rounded-xl bg-[#F5F4F0] border-none" />
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#7A8B80] pointer-events-none">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeSection === 'otros' && (
          <>
            <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <Label className="text-xs font-black uppercase tracking-tight text-[#1F2D26]">Obligaciones Negociables</Label>
                    <Button variant="outline" size="sm" onClick={() => setObligacionesNegociables((prev: any) => [...prev, { emisor: '', cupon: '', vencimiento: '', ticker: '', moneda: 'USD', pago: 'Semestral' }])} className="h-8 text-[10px] font-bold text-[#3D7A5F] border-[#3D7A5F]/20"><Plus className="w-3 h-3 mr-1" />Agregar</Button>
                  </div>
                  <div className="space-y-3">
                    {obligacionesNegociables.map((on, i) => (
                      <div key={i} className="p-4 bg-white rounded-2xl border border-[#E8E6E0] shadow-sm relative group">
                        <Button variant="ghost" size="sm" onClick={() => setObligacionesNegociables((prev: any) => prev.filter((_: any, j: number) => j !== i))} className="absolute top-2 right-2 h-7 w-7 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4"/></Button>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative col-span-2">
                                <Label className="text-[9px] font-black uppercase text-[#7A8B80] absolute -top-1.5 left-2 px-1 bg-white">Emisor</Label>
                                <Input value={on.emisor} onChange={(e) => { const arr = [...obligacionesNegociables]; arr[i] = { ...arr[i], emisor: e.target.value }; setObligacionesNegociables(arr) }} className="h-9 text-sm font-bold border-none bg-[#F5F4F0] rounded-xl" placeholder="Ej: YPF" />
                            </div>
                            <div className="relative">
                                <Label className="text-[9px] font-black uppercase text-[#7A8B80] absolute -top-1.5 left-2 px-1 bg-white">Cupón</Label>
                                <Input value={on.cupon} onChange={(e) => { const arr = [...obligacionesNegociables]; arr[i] = { ...arr[i], cupon: e.target.value }; setObligacionesNegociables(arr) }} className="h-9 text-sm bg-[#F5F4F0] border-none rounded-xl" placeholder="Ej: 8%" />
                            </div>
                            <div className="relative">
                                <Label className="text-[9px] font-black uppercase text-[#7A8B80] absolute -top-1.5 left-2 px-1 bg-white">Ticker</Label>
                                <Input value={on.ticker} onChange={(e) => { const arr = [...obligacionesNegociables]; arr[i] = { ...arr[i], ticker: e.target.value }; setObligacionesNegociables(arr) }} className="h-9 text-sm bg-[#F5F4F0] border-none rounded-xl" placeholder="Ej: YPCUO" />
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-black uppercase tracking-tight text-[#1F2D26] mb-4 block px-1">Análisis de Riesgos</Label>
                  <div className="space-y-3">
                    {riesgos.map((r, i) => (
                      <div key={i} className="p-4 bg-white rounded-2xl border border-[#E8E6E0] shadow-sm">
                        <div className="flex gap-2 mb-3">
                            <Input value={r.riesgo} onChange={(e) => { const arr = [...riesgos]; arr[i] = { ...arr[i], riesgo: e.target.value }; setRiesgos(arr) }} className="h-9 text-sm font-bold border-none bg-[#F5F4F0] rounded-xl flex-1" placeholder="Riesgo" />
                            <Select value={r.nivel} onValueChange={(v: 'Bajo' | 'Medio' | 'Alto') => { const arr = [...riesgos]; arr[i] = { ...arr[i], nivel: v }; setRiesgos(arr) }}><SelectTrigger className="h-9 w-24 border-none bg-[#F5F4F0] rounded-xl font-bold text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Bajo">Bajo</SelectItem><SelectItem value="Medio">Medio</SelectItem><SelectItem value="Alto">Alto</SelectItem></SelectContent></Select>
                        </div>
                        <Input value={r.mitigacion} onChange={(e) => { const arr = [...riesgos]; arr[i] = { ...arr[i], mitigacion: e.target.value }; setRiesgos(arr) }} className="h-9 text-xs bg-white border-[#E8E6E0] rounded-xl" placeholder="Estrategia de mitigación" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <Label className="text-xs font-black uppercase tracking-tight text-[#1F2D26]">Beneficios Fiscales</Label>
                    <Button variant="ghost" size="sm" onClick={() => setBeneficiosFiscales((prev: string[]) => [...prev, ""])} className="h-8 text-[10px] font-bold text-[#3D7A5F]"><Plus className="w-3 h-3 mr-1" />Añadir</Button>
                  </div>
                  <div className="space-y-2">
                    {beneficiosFiscales.map((b, i) => (
                      <div key={i} className="flex gap-2 group">
                          <Textarea value={b} onChange={(e) => { const arr = [...beneficiosFiscales]; arr[i] = e.target.value; setBeneficiosFiscales(arr) }} className="text-sm font-medium min-h-[60px] p-3 rounded-2xl border-[#E8E6E0] focus:border-[#3D7A5F] flex-1 bg-white shadow-sm" />
                          <Button variant="ghost" size="sm" onClick={() => setBeneficiosFiscales((prev: string[]) => prev.filter((_, j) => j !== i))} className="h-auto px-2 text-red-300 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4"/></Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-4">
                  <div className="p-4 bg-white rounded-3xl border-2 border-dashed border-[#E8E6E0]">
                    <div className="flex items-center gap-2 mb-3"><input type="checkbox" checked={usarTerminoIA} onChange={(e) => setUsarTerminoIA(e.target.checked)} className="w-5 h-5 rounded-lg border-[#E8E6E0] text-[#3D7A5F] focus:ring-[#3D7A5F]" /><Label className="text-xs font-black uppercase text-[#1F2D26]">Término IA Autogenerado</Label></div>
                    {!usarTerminoIA && <Textarea value={terminoFinanciero} onChange={(e) => setTerminoFinanciero(e.target.value)} className="text-sm font-medium min-h-[80px] p-4 rounded-2xl border-[#E8E6E0] bg-[#F5F4F0]" placeholder="Escribe un término clave..." />}
                  </div>
                  <div className="p-4 bg-white rounded-3xl border-2 border-dashed border-[#E8E6E0]">
                    <div className="flex items-center gap-2 mb-3"><input type="checkbox" checked={usarConsejoIA} onChange={(e) => setUsarConsejoIA(e.target.checked)} className="w-5 h-5 rounded-lg border-[#E8E6E0] text-[#3D7A5F] focus:ring-[#3D7A5F]" /><Label className="text-xs font-black uppercase text-[#1F2D26]">Consejo IA Autogenerado</Label></div>
                    {!usarConsejoIA && <Textarea value={consejoFinal} onChange={(e) => setConsejoFinal(e.target.value)} className="text-sm font-medium min-h-[80px] p-4 rounded-2xl border-[#E8E6E0] bg-[#F5F4F0]" placeholder="Escribe un consejo final..." />}
                  </div>
                </div>
            </div>
          </>
        )}
      </div>
      <div className="p-4 border-t border-[#E8E6E0] bg-white flex justify-between gap-3 flex-shrink-0">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={wizardStep === 0}
            className="flex-1 h-12 rounded-xl font-bold text-[#7A8B80]"
          >
              Anterior
          </Button>
          <Button
            onClick={() => {
                if (wizardStep < steps.length - 1) {
                    const next = wizardStep + 1;
                    setWizardStep(next);
                    setActiveSection(steps[next].section);
                }
            }}
            className="flex-[2] h-12 bg-[#2D5A4A] hover:bg-[#3D7A5F] rounded-xl font-bold shadow-lg shadow-[#2D5A4A]/20"
          >
              {wizardStep === steps.length - 1 ? "Revisar Plan" : "Continuar"}
          </Button>
      </div>
    </div>
  )
}
