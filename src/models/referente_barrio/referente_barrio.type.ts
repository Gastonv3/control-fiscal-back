import { IPaginationFilter } from "../../utils/PaginationFilter.type";

export interface IReferenteBarrio {
  id_referente: number;
  nombre_referente: string;
  apellido_referente: string;
  id_barrio: number;
  nombre_barrio: string;
  habilitada: string; // 'S' o 'N'
  id_usuario_carga: number;
  nombre_usuario_carga: string;
  fecha_carga: Date;
  id_usuario_baja?: number | null;
  nombre_usuario_baja?: string | null;
  fecha_baja?: Date | null;
}

export interface IReferenteBarrioInsert {
  id_referente: number;
  id_barrio: number;
  id_usuario: number;
}

export interface IReferenteBarrioBaja {
  id_referente: number;
  id_barrio: number;
  habilitada: string; // 'S' o 'N'
  id_usuario: number;
}

export interface IReferenteBarrioFilter extends IPaginationFilter {
  id_referente?: number;
  id_barrio?: number;
  habilitada?: string; // 'S' o 'N'
}

export interface IReferenteBajaBarrio {
  id_usuario: number;
  id_referente: number;
}
