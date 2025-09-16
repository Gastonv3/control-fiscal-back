import { Router, Request, Response } from "express";
import { pool } from "../../config/database.config";
import { verificarToken } from "../../middlewares/auth.middlewares";
import { rateLimiter } from "../../middlewares/rate-limit.middleware";

export class SystemRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    // Ruta de prueba rápida
    this.router.get("/ping", rateLimiter, (req: Request, res: Response) => {
      res.status(200).json({ message: "pong" });
    });

    // Ruta de estado de salud del sistema
    this.router.get(
      "/health",
      verificarToken,
      async (req: Request, res: Response) => {
        try {
          // Check de conexión a base de datos
          await pool.query("SELECT 1");

          res.status(200).json({
            status: "ok",
            uptime: process.uptime(),
            database: "connected",
            version: "1.0.0",
          });
        } catch (error: any) {
          res.status(500).json({
            status: "fail",
            message: "Problema de conexión a la base de datos",
            error: error.message,
          });
        }
      }
    );
  }
}
