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
  Trash2
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
  isMobile: boolean
  activeSection: string
  setActiveSection: (section: string) => void
  // Cliente
  edad: number
  setEdad: (v: number) => void
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
  isMobile,
  activeSection,
  setActiveSection,
  edad, setEdad,
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

  const tabs = [
    { id: 'cliente', label: 'Cliente', icon: User },
    { id: 'cartera', label: 'Cartera', icon: Building2 },
    { id: 'otros', label: 'Otros', icon: Settings },
  ]

  const inputClass = isMobile ? "h-12 text-base rounded-xl px-4" : "h-8 text-sm"
  const textareaClass = isMobile ? "text-base rounded-xl p-4 min-h-[100px]" : "text-sm min-h-[50px]"
  const labelClass = isMobile ? "text-sm font-medium text-[#3D7A5F] mb-2 block" : "text-[10px] text-[#7A8B80] uppercase tracking-wide"

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className={`
        ${isMobile
          ? 'flex gap-2 p-3 overflow-x-auto bg-[#F5F4F0] border-b border-[#E8E6E0] scrollbar-hide flex-shrink-0'
          : 'flex border-b border-[#E8E6E0] bg-[#F5F4F0] flex-shrink-0'
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

      <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4 space-y-4' : 'p-3 space-y-3'}`}>
        {activeSection === 'cliente' && (
          <>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-2'}`}>
              <div>
                <Label className={labelClass}>Edad</Label>
                <Input type="number" value={edad} onChange={(e) => setEdad(parseInt(e.target.value) || 0)} className={`${inputClass} mt-1`} />
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

        {activeSection === 'cartera' && (
          <>
            <div className={`grid ${isMobile ? 'grid-cols-3 gap-3' : 'grid-cols-3 gap-2'}`}>
              <div className={`${isMobile ? 'p-3' : 'p-2'} bg-[#F5F4F0] rounded-xl text-center`}><p className={`${isMobile ? 'text-xs' : 'text-[9px]'} text-[#7A8B80]`}>USD</p><p className={`font-bold ${isMobile ? 'text-lg' : 'text-sm'} text-[#3D7A5F]`}>{exposicionUSD}%</p></div>
              <div className={`${isMobile ? 'p-3' : 'p-2'} bg-[#F5F4F0] rounded-xl text-center`}><p className={`${isMobile ? 'text-xs' : 'text-[9px]'} text-[#7A8B80]`}>ARS</p><p className={`font-bold ${isMobile ? 'text-lg' : 'text-sm'} text-[#C4846C]`}>{exposicionARS}%</p></div>
              <div className={`${isMobile ? 'p-3' : 'p-2'} bg-[#F5F4F0] rounded-xl text-center group relative cursor-pointer`} onClick={() => setInstruments(normalizeWeights(instruments, 'asignacion'))}>
                <p className={`${isMobile ? 'text-xs' : 'text-[9px]'} text-[#7A8B80]`}>Total</p><p className={`font-bold ${isMobile ? 'text-lg' : 'text-sm'} ${totalAsignacion !== 100 ? 'text-red-500' : 'text-[#2D5A4A]'}`}>{totalAsignacion}%</p>
                {totalAsignacion !== 100 && <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl"><Sparkles className="w-4 h-4 text-[#2D5A4A]" /></div>}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className={labelClass}>Instrumentos</Label>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => { const perItem = Math.floor(100 / (instruments.length || 1)); const base = instruments.map(inst => ({ ...inst, asignacion: perItem, locked: false })); setInstruments(normalizeWeights(base, 'asignacion')); }} className={`${isMobile ? 'h-10 text-xs' : 'h-5 text-[9px]'} text-[#7A8B80]`}>Igualar</Button>
                  <Button variant="ghost" size="sm" onClick={() => setInstruments((prev: any) => { const currentTotal = prev.reduce((s: any, i: any) => s + i.asignacion, 0); const remaining = Math.max(0, 100 - currentTotal); return [...prev, { nombre: '', tipo: '', asignacion: remaining, moneda: 'USD', objetivo: '', locked: false }]; })} className={`${isMobile ? 'h-10 text-sm' : 'h-5 text-[10px]'} text-[#3D7A5F]`}><Plus className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />Agregar</Button>
                </div>
              </div>
              <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: isMobile ? '350px' : '280px' }}>
                {instruments.map((inst, i) => (
                  <div key={i} className={`${isMobile ? 'p-3' : 'p-2'} bg-[#F5F4F0] rounded-xl group relative`}>
                    <div className={`flex items-center ${isMobile ? 'gap-3 flex-wrap' : 'gap-2'}`}>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { const arr = [...instruments]; arr[i] = { ...arr[i], locked: !arr[i].locked }; setInstruments(arr); }} className={`${isMobile ? 'h-10 w-10' : 'h-6 w-6 p-0'} ${inst.locked ? 'text-[#C4846C]' : 'text-[#7A8B80]'}`}>{inst.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}</Button>
                        <div className="relative"><Input type="number" value={inst.asignacion} onChange={(e) => { const newVal = parseInt(e.target.value) || 0; setInstruments(adjustWeights(instruments, i, newVal, 'asignacion')); }} className={`${isMobile ? 'w-16 h-11 text-base' : 'w-14 h-7 text-xs'} pr-4 font-bold text-center`} /><span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-[#7A8B80] pointer-events-none">%</span></div>
                      </div>
                      <Input value={inst.nombre} onChange={(e) => { const arr = [...instruments]; arr[i] = { ...arr[i], nombre: e.target.value }; setInstruments(arr) }} className={`${isMobile ? 'h-11 text-base flex-[2]' : 'h-6 text-xs flex-1'}`} placeholder="Nombre" />
                      <Select value={inst.moneda} onValueChange={(v) => { const arr = [...instruments]; arr[i] = { ...arr[i], moneda: v }; setInstruments(arr) }}><SelectTrigger className={`${isMobile ? 'w-20 h-11 text-sm' : 'w-14 h-6 text-[10px]'}`}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="ARS">ARS</SelectItem><SelectItem value="ARS/USD">Mix</SelectItem></SelectContent></Select>
                      <Button variant="ghost" size="sm" onClick={() => setInstruments((prev: any) => prev.filter((_: any, j: number) => j !== i))} className={`${isMobile ? 'h-10 w-10 flex-shrink-0' : 'h-5 w-5 p-0 opacity-0 group-hover:opacity-100'}`}><Trash2 className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} text-red-500`} /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2"><Label className={labelClass}>Asignación Estratégica ({totalAsignacionEstrategica}%)</Label><Button variant="ghost" size="sm" onClick={() => setAsignacionEstrategica(normalizeWeights(asignacionEstrategica, 'porcentaje'))} className={`${isMobile ? 'h-10 text-xs' : 'h-5 text-[9px]'} text-[#3D7A5F]`}>Ajustar a 100%</Button></div>
              <div className="space-y-2 mt-2">
                {asignacionEstrategica.map((asig, i) => (
                  <div key={i} className={`flex items-center ${isMobile ? 'gap-3 p-3' : 'gap-2 p-1.5'} bg-[#F5F4F0] rounded-xl`}>
                    <Button variant="ghost" size="sm" onClick={() => { const arr = [...asignacionEstrategica]; arr[i] = { ...arr[i], locked: !arr[i].locked }; setAsignacionEstrategica(arr); }} className={`${isMobile ? 'h-10 w-10' : 'h-6 w-6 p-0'} ${asig.locked ? 'text-[#C4846C]' : 'text-[#7A8B80]'}`}>{asig.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}</Button>
                    <span className={`${isMobile ? 'text-sm' : 'text-xs'} flex-1 truncate`}>{asig.horizonte}</span>
                    <div className="relative"><Input type="number" value={asig.porcentaje} onChange={(e) => { const newVal = parseInt(e.target.value) || 0; setAsignacionEstrategica(adjustWeights(asignacionEstrategica, i, newVal, 'porcentaje')); }} className={`${isMobile ? 'w-16 h-11 text-base' : 'w-14 h-7 text-xs'} pr-4 font-bold text-center`} /><span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-[#7A8B80] pointer-events-none">%</span></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeSection === 'otros' && (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className={labelClass}>ONs en USD ({obligacionesNegociables.length})</Label>
                <Button variant="ghost" size="sm" onClick={() => setObligacionesNegociables((prev: any) => [...prev, { emisor: '', cupon: '', vencimiento: '', ticker: '', moneda: 'USD', pago: 'Semestral' }])} className={`${isMobile ? 'h-10 text-sm' : 'h-5 text-[10px]'} text-[#3D7A5F]`}><Plus className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />Agregar</Button>
              </div>
              <div className="space-y-2 overflow-y-auto" style={{ maxHeight: isMobile ? '200px' : '120px' }}>
                {obligacionesNegociables.map((on, i) => (
                  <div key={i} className={`${isMobile ? 'grid-cols-5 gap-2 p-3' : 'grid-cols-4 gap-1 p-1.5'} grid bg-[#F5F4F0] rounded-xl group`}>
                    <Input value={on.emisor} onChange={(e) => { const arr = [...obligacionesNegociables]; arr[i] = { ...arr[i], emisor: e.target.value }; setObligacionesNegociables(arr) }} className={`${isMobile ? 'h-11 text-sm' : 'h-6 text-[10px]'}`} placeholder="Emisor" />
                    <Input value={on.cupon} onChange={(e) => { const arr = [...obligacionesNegociables]; arr[i] = { ...arr[i], cupon: e.target.value }; setObligacionesNegociables(arr) }} className={`${isMobile ? 'h-11 text-sm' : 'h-6 text-[10px]'}`} placeholder="Cupón" />
                    <Input value={on.ticker} onChange={(e) => { const arr = [...obligacionesNegociables]; arr[i] = { ...arr[i], ticker: e.target.value }; setObligacionesNegociables(arr) }} className={`${isMobile ? 'h-11 text-sm' : 'h-6 text-[10px]'}`} placeholder="Ticker" />
                    <Button variant="ghost" size="sm" onClick={() => setObligacionesNegociables((prev: any) => prev.filter((_: any, j: number) => j !== i))} className={`${isMobile ? 'h-11 w-11 flex-shrink-0' : 'h-6 w-6 p-0 opacity-0 group-hover:opacity-100'}`}><Trash2 className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} text-red-500`} /></Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className={`${labelClass} mt-2`}>Riesgos ({riesgos.length})</Label>
              <div className="space-y-2 mt-2 overflow-y-auto" style={{ maxHeight: isMobile ? '200px' : '100px' }}>
                {riesgos.map((r, i) => (
                  <div key={i} className={`${isMobile ? 'grid-cols-1 gap-2 p-3' : 'grid-cols-3 gap-1 p-1.5'} grid bg-[#F5F4F0] rounded-xl`}>
                    <Input value={r.riesgo} onChange={(e) => { const arr = [...riesgos]; arr[i] = { ...arr[i], riesgo: e.target.value }; setRiesgos(arr) }} className={`${isMobile ? 'h-11 text-sm' : 'h-6 text-[10px]'}`} placeholder="Riesgo" />
                    <Select value={r.nivel} onValueChange={(v: 'Bajo' | 'Medio' | 'Alto') => { const arr = [...riesgos]; arr[i] = { ...arr[i], nivel: v }; setRiesgos(arr) }}><SelectTrigger className={`${isMobile ? 'h-11 text-sm' : 'h-6 text-[10px]'}`}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Bajo">Bajo</SelectItem><SelectItem value="Medio">Medio</SelectItem><SelectItem value="Alto">Alto</SelectItem></SelectContent></Select>
                    <Input value={r.mitigacion} onChange={(e) => { const arr = [...riesgos]; arr[i] = { ...arr[i], mitigacion: e.target.value }; setRiesgos(arr) }} className={`${isMobile ? 'h-11 text-sm' : 'h-6 text-[10px]'}`} placeholder="Mitigación" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className={`${labelClass} mt-2`}>Beneficios Fiscales</Label>
              <div className="space-y-2 mt-2 overflow-y-auto" style={{ maxHeight: isMobile ? '150px' : '80px' }}>
                {beneficiosFiscales.map((b, i) => (
                  <Textarea key={i} value={b} onChange={(e) => { const arr = [...beneficiosFiscales]; arr[i] = e.target.value; setBeneficiosFiscales(arr) }} className={`${isMobile ? 'text-sm min-h-[50px] p-3' : 'text-[10px] min-h-[30px] py-1'} rounded-xl`} />
                ))}
              </div>
            </div>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-2'} mt-2`}>
              <div>
                <div className="flex items-center gap-2 mb-2"><input type="checkbox" checked={usarTerminoIA} onChange={(e) => setUsarTerminoIA(e.target.checked)} className={`rounded text-[#3D7A5F] ${isMobile ? 'w-5 h-5' : ''}`} /><Label className={`${isMobile ? 'text-sm' : 'text-[10px]'}`}>Término IA</Label></div>
                {!usarTerminoIA && <Textarea value={terminoFinanciero} onChange={(e) => setTerminoFinanciero(e.target.value)} className={`${isMobile ? 'text-sm min-h-[80px] p-3' : 'text-[10px] min-h-[40px]'} rounded-xl`} />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2"><input type="checkbox" checked={usarConsejoIA} onChange={(e) => setUsarConsejoIA(e.target.checked)} className={`rounded text-[#3D7A5F] ${isMobile ? 'w-5 h-5' : ''}`} /><Label className={`${isMobile ? 'text-sm' : 'text-[10px]'}`}>Consejo IA</Label></div>
                {!usarConsejoIA && <Textarea value={consejoFinal} onChange={(e) => setConsejoFinal(e.target.value)} className={`${isMobile ? 'text-sm min-h-[80px] p-3' : 'text-[10px] min-h-[40px]'} rounded-xl`} />}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
