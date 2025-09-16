import { IPaginationFilter } from "../../utils/PaginationFilter.type";

export interface IEscuelas {
  id_escuela: number;
  nombre_escuela: string;
  numero: number | null;
  cod_circuito: string | null;
  cod_seccion: string | null;
  id_zona: number | null;
  nombre_zona: string | null;
}

export interface IEscuelasFilter extends IPaginationFilter {
  id_escuela?: number;
  numero?: number;
  nombre_escuela?: string;
  not_exista?: string;
  id_zona?: number;
}

export interface IEscuelasUpdateZona {
  id_escuela: number;
  id_zona: number | null;
}
