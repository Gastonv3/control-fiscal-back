import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "clave-secreta";
export const verificarToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no enviado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token!, SECRET_KEY);
    // @ts-ignore
    req.usuario = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};
