import { IPaginationFilter } from "../../utils/PaginationFilter.type";

export interface IFiscalesGenerales {
  id_fiscal_general: number;
  id_usuario: number;
  nombre_usuario_asignado: string;
  user_asignado: string;
  dni: number;
  telefono: string | null;
  id_escuela: number | null;
  nombre_escuela: string | null;
  fecha_carga: Date;
  id_usuario_carga: number;
  nombre_usuario_carga: string;
  fecha_modifica: Date | null;
  id_usuario_modifica: number | null;
  nombre_usuario_modifica: string | null;
  habilitado: "S" | "N";
  cantidad_mesas: number;
  mesas_asignadas: number;
  mesa_desde: number | null;
  mesa_hasta: number | null;
}

export interface IFiscalesGeneralesFilter extends IPaginationFilter {
  id_fiscal_general?: number;
  id_usuario?: number;
  dni?: number;
  nombre_usuario_asignado?: string;
  id_escuela?: number;
  habilitado?: "S" | "N";
  mesas_pendientes?: string;
}

export interface IFiscalesGeneralesInsert {
  id_usuario: number;
  id_escuela: number | null;
  dni: number;
  id_usuario_carga: number;
}

export interface IParamInsertFiscalesGenerales {
  nombre: string;
  usuario: string;
  password: string;
  id_escuela: number | null;
  dni: number;
  telefono: string;
  id_usuario_carga: number;
}

export interface IFiscalesGeneralesUpdate {
  id_fiscal_general: number;
  nombre?: string;
  usuario?: string;
  password?: string;
  id_usuario?: number;
  id_escuela?: number | null;
  dni?: number;
  telefono?: string;
  habilitado?: "S" | "N";
  id_usuario_modifica?: number;
  escuela_original?: number;
}
