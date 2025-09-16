import { IPaginationFilter } from "../../utils/PaginationFilter.type";

export interface IReferenteZona {
  id_referente: number;
  nombre_referente: string;
  apellido_referente: string;
  id_zona: number;
  nombre_zona: string;
  habilitada: string; // 'S' o 'N'
  id_usuario_carga: number;
  nombre_usuario_carga: string;
  fecha_carga: Date;
  id_usuario_baja?: number | null;
  nombre_usuario_baja?: string | null;
  fecha_baja?: Date | null;
}

export interface IReferenteZonaInsert {
  id_referente: number;
  id_zona: number;
  id_usuario: number;
}

export interface IReferenteZonaBaja {
  id_referente: number;
  id_zona: number;
  habilitada: string; // 'S' o 'N'
  id_usuario: number;
}

export interface IReferenteZonaFilter extends IPaginationFilter {
  id_referente?: number;
  id_zona?: number;
  habilitada?: string; // 'S' o 'N'
}
