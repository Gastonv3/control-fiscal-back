import { IPaginationFilter } from "../../utils/PaginationFilter.type";

export interface IFiscalesDigitales {
  id_fiscal_digital: number;
  id_fiscal_general: number;
  id_usuario_fiscal_general: number;
  nombre_fiscal_general: string;
  id_usuario_fiscal_digital: number;
  nombre_fiscal_digital: string;
  user_asignado: string;
  pass_asignado: string;
  mesa_numero: number;
  id_escuela: number;
  nombre_escuela: string;
  dni: number;
  telefono: string;
  fecha_carga: string;
  id_usuario_carga: number;
  nombre_usuario_carga: string;
  fecha_modifica: string | null;
  id_usuario_modifica: number | null;
  nombre_usuario_modifica: string | null;
  habilitado: "S" | "N";
  id_usuario_asistencia: number | null;
  nombre_usuario_asistencia: string | null;
  estado_asistencia: "S" | "N";
  fecha_asistencia: string | null;
}

export interface IFiscalesDigitalesFilter extends IPaginationFilter {
  id_fiscal_digital?: number;
  id_fiscal_general?: number;
  dni?: number;
  id_usuario?: number;
  nombre_fiscal_digital?: string;
  estado_asistencia?: "S" | "N";
  habilitado?: "S" | "N";
}

// export interface IParamInsertFiscalesDigitales {
//   nombre: string;
//   usuario: string;
//   password: string;
//   id_fiscal_general: number;
//   dni: number;
//   mesa_numero: number;
//   id_usuario_carga: number;
// }

// export interface IFiscalesDigitalesInsert {
//   id_fiscal_general: number;
//   id_usuario: number;
//   dni: number;
//   mesa_numero: number;
//   id_usuario_carga: number;
// }

export interface IFiscalesDigitalesInsert {
  id_fiscal_general: number;
  id_usuario: number;
  dni: number;
  telefono: string;
  nombre: string;
  usuario: string;
  password: string;
  mesa_numero?: number;
  id_usuario_carga: number;
}

export interface IFiscalesDigitalesUpdate {
  id_fiscal_digital: number;
  id_fiscal_general?: number;
  nombre?: string;
  usuario?: string;
  password?: string;
  id_usuario?: number;
  dni?: number;
  mesa_numero?: number;
  telefono?: string;
  habilitado?: string;
  id_usuario_modifica?: number;
}

export interface IFiscalesDigitalesEstadoAsistenciaUpdate {
  id_fiscal_digital: number;
  estado_asistencia: "S" | "N";
  id_usuario_asistencia: number;
  id_usuario_asignado: number;
}
