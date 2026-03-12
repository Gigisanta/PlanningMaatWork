export interface Instrument {
  nombre: string
  tipo: string
  asignacion: number
  moneda: string
  objetivo: string
  locked?: boolean
}

export interface AsignacionEstrategica {
  horizonte: string
  porcentaje: number
  sector: string
  objetivo: string
  locked?: boolean
}

export interface ObligacionNegociable {
  emisor: string
  cupon: string
  vencimiento: string
  ticker: string
  moneda: string
  pago: string
}

export interface Riesgo {
  riesgo: string
  nivel: 'Bajo' | 'Medio' | 'Alto'
  mitigacion: string
}

export interface ConfigurableLink {
  name: string
  url: string
  icon: 'link' | 'instagram' | 'whatsapp'
  enabled?: boolean
}

export interface AttachedFile {
  name: string;
  type: string;
  data: string;
  size: number;
}
