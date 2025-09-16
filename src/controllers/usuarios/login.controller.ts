import e, { Request, Response } from "express";
import { LoginService } from "../../models/usuarios/applications/auth/login.service";
import jwt from "jsonwebtoken";
import ListarUsuariosService from "../../models/usuarios/applications/listar-usuarios.service";
import obtenerMenuAppService from "../../models/menu_app/applications/obtener-menu-app.service";
const SECRET_KEY = process.env.JWT_SECRET || "clave-secreta";

export class LoginController {
  async login(req: Request, res: Response) {
    try {
      const SECRET_KEY = process.env.JWT_SECRET || "arafue";
      const { user, pass } = req.body;

      if (!user || !pass) {
        return res
          .status(400)
          .json({ message: "Usuario y contraseña son requeridos" });
      }

      // rate limiter
      // Aquí podrías implementar un rate limiter para evitar ataques de fuerza bruta

      const service = new LoginService();

      const filter = { user, pass };
      const usuario = await service.login(filter);

      const menuService = new obtenerMenuAppService();

      const menu = await menuService.listar({
        role_id: usuario.data!.id_rol,
        type_id: 1,
      });

      if (usuario.status == 500) {
        return res.status(usuario.status).json({
          message: usuario.message,
          error: usuario.error,
        });
      }

      if (usuario.status == 422) {
        return res.status(usuario.status).json({
          message: usuario.message,
          error: usuario.error,
        });
      }

      // ✅ Generar JWT
      const token = jwt.sign(
        { id: usuario.data!.id_usuario, user: usuario.data!.user },
        SECRET_KEY,
        { expiresIn: "8h" }
      );

      return res.status(200).json({
        message: "Inicio de sesión exitoso",
        data: {
          usuario: usuario.data,
          token: token,
          menuApp: menu.menu,
        },
      });
    } catch (error) {
      console.error("[LoginController] Error al iniciar sesión:", error);
      return res
        .status(500)
        .json({ message: "Error al iniciar sesión", error: error });
    }
  }

  public async renovarToken(req: Request, res: Response): Promise<any> {
    try {
      // @ts-ignore
      const usuario = req!.usuario!;

      const serviceUsuario = new ListarUsuariosService();

      const usuariosDatabase = await serviceUsuario.obtener({
        id_usuario: usuario.id,
      });

      if (usuariosDatabase.status == 500) {
        return res.status(usuariosDatabase.status).json({
          message: usuariosDatabase.message,
          error: usuariosDatabase.error,
        });
      }

      const menuService = new obtenerMenuAppService();

      const menu = await menuService.listar({
        role_id: usuariosDatabase.data?.usuarios[0]!.id_rol,
        type_id: 1,
      });

      // ✅ Generar JWT
      const token = jwt.sign(
        {
          id: usuariosDatabase.data?.usuarios[0]!.id_usuario,
          user: usuariosDatabase.data?.usuarios[0]!.user,
        },
        SECRET_KEY,
        { expiresIn: "8h" }
      );

      return res.status(200).json({
        message: "Token renovado exitosamente",
        data: {
          usuario: usuariosDatabase.data?.usuarios[0]!,
          token: token,
          menuApp: menu.menu,
        },
      });
    } catch (error) {
      console.error("[LoginController] Error al renovar token:", error);
      return res
        .status(500)
        .json({ message: "Error al renovar token", error: error });
    }
  }
}
