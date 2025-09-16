import { IPaginationFilter } from "../../utils/PaginationFilter.type";

export interface IBarrio {
  id_barrio: number;
  nombre: string;
}

export interface IBarrioFilter extends IPaginationFilter {
  id_barrio?: number;
  nombre?: string;
}
