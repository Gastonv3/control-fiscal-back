export interface ICargoDirigentes {
  id: number;
  id_categoria_dirigente: number;
  nombre: string;
  descripcion: string;
  habilitado: string;
}

export interface ICargoDirigentesFilter {
  id_categoria_dirigente?: number;
  habilitado?: string;
}
