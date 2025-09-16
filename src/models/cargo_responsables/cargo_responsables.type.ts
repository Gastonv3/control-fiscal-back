export interface ICargoResponsablesZonales {
  id: number;
  id_categoria_responsables: number;
  nombre: string;
  descripcion: string;
  habilitado: string;
}

export interface ICargoResponsablesZonalesFilter {
  id_categoria_responsables?: number;
  habilitado?: string;
}
