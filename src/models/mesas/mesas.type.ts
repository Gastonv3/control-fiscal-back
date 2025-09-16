import { IPaginationFilter } from "../../utils/PaginationFilter.type";

export interface IMesas {
  id_mesa: number;
  mesa_numero: number;
  id_escuela: number;
  nombre_escuela: string;
  cod_circuito: string | null;
  cod_seccion: string | null;
}

export interface IMesasFilter extends IPaginationFilter {
  id_mesa?: number;
  mesa_numero?: number;
  id_escuela?: number;
  not_exista?: string;
}
