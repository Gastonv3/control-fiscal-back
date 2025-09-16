import { IPaginationFilter } from "../../utils/PaginationFilter.type";

export interface IDirigentes {
  id_dirigente: number;
  id_responsable: number;
  nombre_responsable: string;
  apellido_responsable: string;
  nombre: string;
  apellido: string;
  dni: number;
  codigo: string;
  telefono: string;
  id_categoria: number;
  categoria_desc: string;
  id_cargo: number;
  cargo_desc: string;
  habilitada: string;
  fecha_carga: Date;
  id_usuario_carga: number;
  usuario_carga: string;
}

export interface IDirigentesFilter extends IPaginationFilter {
  id_dirigente?: number;
  id_responsable?: number;
  nombre?: string;
  apellido?: string;
  nombreLike?: string;
  dni?: number;
  habilitada?: string;
  id_categoria?: number;
  id_cargo?: number;
  id_zona?: number;
}

export interface IDirigentesInsert {
  id_responsable?: number;
  nombre: string;
  apellido: string;
  dni: number;
  telefono: string;
  id_categoria?: number;
  id_cargo?: number;
  codigo?: string;
  id_usuario_carga: number;
}

export interface IDirigentesUpdate {
  id: number;
  id_responsable?: number;
  nombre?: string;
  apellido?: string;
  dni?: number;
  telefono?: string;
  id_categoria?: number;
  id_cargo?: number;
  codigo?: string; // Optional, as it might be auto-generated
  habilitada?: string; // Default to 'S' if not provided
  id_usuario_carga: number;
}

export interface IDirigenteParamInsertar {
  dirigente: IDirigentesInsert;
  zona_dirigente: { id_zona: number; nombre: string; id_usuario: number }[];
}
