import { IPaginationFilter } from "../../utils/PaginationFilter.type";

export interface IReferentes {
  id_referente: number;
  nombre: string;
  apellido: string;
  dni: number;
  codigo: string;
  telefono: string;
  habilitada: string; // 'S' o 'N'
  id_categoria: number | null;
  categoria: string | null;
  id_cargo: number | null;
  cargo: string | null;
  id_dirigente: number | null;
  nombre_dirigente: string | null;
  apellido_dirigente: string | null;
  id_usuario_carga: number;
  nombre_usuario_carga: string;
  fecha_carga: Date;
  id_usuario_modifica?: number | null;
  nombre_usuario_modifica?: string | null;
  fecha_modifica?: Date | null;
}

export interface IReferentesFilter extends IPaginationFilter {
  id_referente?: number;
  id_dirigente?: number;
  id_responsable?: number;
  id_barrio?: number;
  nombre?: string;
  apellido?: string;
  nombreLike?: string;
  dni?: number;
  codigo?: string;
  habilitada?: string;
  id_categoria?: number;
  id_cargo?: number;
  id_zona?: number;
}

export interface IReferentesInsert {
  id_dirigente: number;
  nombre: string;
  apellido: string;
  dni: number;
  codigo: string;
  telefono: string;
  id_categoria?: number | null;
  id_cargo?: number | null;
  id_usuario_carga: number;
}

export interface IReferentesUpdate {
  id_referente: number;
  id_dirigente?: number;
  nombre?: string;
  apellido?: string;
  dni?: number;
  codigo?: string;
  telefono?: string;
  habilitada?: string; // 'S' o 'N'
  id_categoria?: number | null;
  id_cargo?: number | null;
  id_usuario_modifica: number;
}

export interface IReferenteteParamInsertar {
  referente: IReferentesInsert;
  zona_referente: { id_zona: number; nombre: string; id_usuario: number }[];
  barrio_referente: { id_barrio: number; nombre: string; id_usuario: number }[];
}

export interface IReferenteEstadoVotos {
  id_referente: number;
  nombre_referente: string;
  apellido_referente: string;
  codigo_referente: string;
  nombre_zona: string;
  id_dirigente: number;
  nombre_dirigente: string;
  apellido_dirigente: string;
  total_votantes: number;
  votaron: number;
  pendientes: number;
  percent_votaron: number;
}

export interface IReferenteEstadoVotosFilter extends IPaginationFilter {
  id_referente?: number;
  id_dirigente?: number;
  nombre_referente_like?: string;
  nombre_dirigente_like?: string;
  dni_referente?: number;
  dni_dirigente?: number;
  id_zona?: number;
  pendientes?: string;
}
