export interface ICargoReferentes {
  id: number;
  id_categoria_referente: number;
  nombre: string;
  descripcion: string;
  habilitado: string;
}

export interface ICargoReferentesFilter {
  id_categoria_referente?: number;
  habilitado?: string;
}
