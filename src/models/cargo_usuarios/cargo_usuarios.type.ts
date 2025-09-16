export interface ICargoUsuario {
  id: number;
  id_categoria_usuario: number;
  nombre: string;
  descripcion: string;
  habilitado: string;
}

export interface ICargoUsuarioFilter {
  id_categoria_usuario?: number;
  habilitado?: string;
}
