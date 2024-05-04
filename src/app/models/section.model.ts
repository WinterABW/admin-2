export interface Section {
  'id': number
  'nombre': string
  'estilo': string
  'prioridad': number
  'activo': boolean
  'fecha': Date
  'fecha_ini': Date
  'fecha_fin': Date
  'filtros': []
  'videos': any[]
  'next'?: string

}
