import { IPaginationFilter } from "../../utils/PaginationFilter.type";

export interface IResponsableZonalZonaDetalle {
  id_responsable: number;
  nombre_responsable: string;
  apellido_responsable: string;
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

export interface IResponsableZonalZonaFilter extends IPaginationFilter {
  id_responsable?: number;
  id_zona?: number;
  habilitada?: string; // 'S' o 'N'
}

export interface IResponsableZonalZonaInput {
  id_responsable: number;
  id_zona: number;
  id_usuario: number;
}

export interface IResponsableZonalZonaBaja {
  id_responsable: number;
  id_zona: number;
  id_usuario: number;
  habilitada: string; // 'S' o 'N'
}
