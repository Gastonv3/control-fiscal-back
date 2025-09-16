import { IPaginationFilter } from "../../utils/PaginationFilter.type";

export interface IVotantes {
  id_votante: number;
  dni: number;
  nombre: string;
  telefono: string;
  numero_mesa: number;
  numero_orden: number;
  estado_voto: string; // 'S' o 'N'
  fecha_votacion: Date | null;
  id_usuario_votacion?: number | null;
  nombre_usuario_votacion?: string | null;
  id_usuario_carga: number;
  nombre_usuario_carga: string;
  fecha_carga: Date;
  id_usuario_modifica?: number | null;
  nombre_usuario_modifica?: string | null;
  fecha_modifica?: Date | null;
  id_referente: number;
  nombre_referente: string;
  apellido_referente: string;
  codigo_referente: string;
  id_dirigente: number;
  nombre_dirigente: string;
  apellido_dirigente: string;
  codigo_dirigente: string;
  id_responsable: number;
  nombre_responsable: string;
  apellido_responsable: string;
}

export interface IVotantesFilter extends IPaginationFilter {
  id_votante?: number;
  dni?: number;
  id_referente?: number;
  id_cargo_referente?: number;
  id_categoria_referente?: number;
  id_dirigente?: number;
  id_responsable?: number;
  estado_voto?: string; // 'S' o 'N'
  numero_mesa?: number;
  numero_orden?: number;
  id_escuela?: number;
}

export interface IVotantesInsert {
  id_referente: number;
  dni: number;
  nombre: string;
  apellido: string;
  telefono: string;
  numero_mesa: number;
  numero_orden: number;
  id_usuario_carga: number;
}

export interface IVotantesUpdate {
  id_votante: number;
  id_referente?: number;
  telefono?: string;
  id_usuario_modifica: number;
}

export interface IVotoEstadoUpdate {
  dni: number;
  id_usuario: number;
}

export interface IVotantesEstadoVotantes {
  total_votantes: number;
  votaron: number;
  no_votaron: number;
  pct_voto: number;
}

export interface IVotantesEstadoVotantesFilter {
  id_referente?: number;
  id_dirigente?: number;
  id_responsable?: number;
  id_escuela?: number;
  is_not_null_referente?: number;
  id_zona?: number;
}

export interface IRankingResponsables {
  id_responsable: number;
  responsable: string;
  total: number;
  votaron: number;
  pct: number;
}

export interface IRankingResponsablesFilter extends IPaginationFilter {
  id_responsable?: number;
  nombreLikeResponsable?: string;
  id_categoria?: number;
  id_cargo?: number;
  id_zona?: number;
  dni?: number;
  orderBy?: "total" | "votaron" | "pct";
  orderDirection?: "asc" | "desc";
}

export interface IRankingDirigentes {
  id_dirigente: number;
  dirigente: string;
  total: number;
  votaron: number;
  pct: number;
}

export interface IRankingDirigentesFilter extends IPaginationFilter {
  id_dirigente?: number;
  nombreLikeDirigente?: string;
  id_responsable?: number;
  id_categoria?: number;
  id_cargo?: number;
  id_zona?: number;
  dni?: number;
  orderBy?: "total" | "votaron" | "pct";
  orderDirection?: "asc" | "desc";
}

export interface IRankingReferentes {
  id_referente: number;
  referente: string;
  total: number;
  votaron: number;
  pct: number;
}
export interface IRankingReferentesFilter extends IPaginationFilter {
  id_referente?: number;
  id_dirigente?: number;
  nombreLikeReferente?: string;
  id_categoria?: number;
  id_cargo?: number;
  id_zona?: number;
  dni?: number;
  id_barrio?: number;
  orderBy?: "total" | "votaron" | "pct";
  orderDirection?: "asc" | "desc";
}
