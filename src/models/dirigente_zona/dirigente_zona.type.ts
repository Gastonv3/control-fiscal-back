import { IPaginationFilter } from "../../utils/PaginationFilter.type";

export interface IDirigenteZonaDetalle {
  id_dirigente: number;
  nombre_dirigente: string;
  apellido_dirigente: string;
  id_zona: number;
  nombre_zona: string;
  habilitada: string;
  id_usuario_carga: number;
  nombre_usuario_carga: string;
  fecha_carga: string; // o Date si lo parseás
  id_usuario_baja?: number | null;
  nombre_usuario_baja?: string | null;
  fecha_baja?: string | null; // o Date
}

export interface IDirigenteZonaFilter extends IPaginationFilter {
  id_dirigente?: number;
  id_zona?: number;
  habilitada?: string; // 'S' o 'N'
}

export interface IDirigenteZonaInput {
  id_dirigente: number;
  id_zona: number;
  id_usuario: number;
}

export interface IDirigenteZonaBaja {
  id_dirigente: number;
  id_zona: number;
  id_usuario: number;
  habilitada: string; // 'S' o 'N'
}
