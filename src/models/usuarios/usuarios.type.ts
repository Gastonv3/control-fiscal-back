import { IPaginationFilter } from "../../utils/PaginationFilter.type";

export interface IUsuario {
  id_usuario: number;
  nombre: string;
  user: string;
  habilitado: string;
  id_categoria: number;
  categoria_desc: string;
  id_cargo: number;
  cargo_desc: string;
  id_rol: number;
  rol_desc?: string;
}

export interface IUsuarioAuth {
  id_usuario: number;
  nombre: string;
  user: string;
  habilitado: string;
  id_categoria: number;
  categoria_desc: string;
  id_cargo: number;
  cargo_desc: string;
  id_rol: number;
  rol_desc?: string;
}

export interface IUsuarioFilter extends IPaginationFilter {
  id_usuario?: number;
  nombre?: string;
  user?: string;
  pass?: string;
  habilitado?: string;
  id_categoria?: number;
  id_cargo?: number;
}

export interface IUsuarioRoles {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface IUsuarioInsert {
  nombre: string;
  user: string;
  pass: string;
  id_rol: number;
  id_cargo: number | null;
  id_categoria_usuario: number | null;
  id_usuario_carga: number;
}

export interface IUsuarioUpdate {
  id_usuario: number;
  nombre?: string;
  user?: string;
  pass?: string;
  habilitado?: string;
  id_rol?: number;
}
