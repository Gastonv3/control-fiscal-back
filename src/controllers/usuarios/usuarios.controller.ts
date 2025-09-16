import { Request, Response } from "express";
import ListarUsuariosService from "../../models/usuarios/applications/listar-usuarios.service";
import ListarRolesService from "../../models/usuarios/applications/listar-roles.service";
import { InsertarUsuarioService } from "../../models/usuarios/applications/insertar-usuario.service";
import { ActualizarUsuarioService } from "../../models/usuarios/applications/actualizar-usuario.service";
import {
  IUsuarioInsert,
  IUsuarioUpdate,
} from "../../models/usuarios/usuarios.type";
const listarRolesService = new ListarRolesService();
const insertarUsuarioService = new InsertarUsuarioService();
const actualizarUsuarioService = new ActualizarUsuarioService();
export class UsuariosController {
  async obtenerUsuarios(req: Request, res: Response) {
    try {
      const filter = req.query;

      const service = new ListarUsuariosService();
      const data = await service.obtener(filter);

      if (data.status == 500) {
        return res.status(data.status).json({
          message: data.message,
          error: data.error,
        });
      }

      if (data.status == 422) {
        return res.status(data.status).json({
          message: data.message,
          error: data.error,
        });
      }

      return res.status(200).json({
        message: data.message,
        data: data.data,
      });
    } catch (error) {
      console.error("[UsuariosController] Error al obtener usuarios:", error);
      return res
        .status(500)
        .json({ message: "Error al obtener usuarios", error: error });
    }
  }

  async insertarUsuario(req: Request, res: Response) {
    try {
      const param: IUsuarioInsert = req.body;
      const result = await insertarUsuarioService.crearUsuario(param);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[UsuariosController] Error al crear usuario:", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno al crear usuario",
        error,
      });
    }
  }

  async actualizarUsuario(req: Request, res: Response) {
    try {
      const param: IUsuarioUpdate = req.body;
      const result = await actualizarUsuarioService.actualizarUsuario(param);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[UsuariosController] Error al actualizar usuario:", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno al actualizar usuario",
        error,
      });
    }
  }

  async listarRoles(req: Request, res: Response) {
    try {
      const result = await listarRolesService.obtener();
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[UsuariosController] Error al listar roles:", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno al listar roles",
        error,
      });
    }
  }
}
