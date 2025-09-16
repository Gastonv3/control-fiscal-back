// import { Request, Response, NextFunction } from "express";
// import { validationResult } from "express-validator";
// import { logValidationError } from "../utils/logger";

// const isProduction = process.env.NODE_ENV === "production";

// export const validarRequest = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const errores = validationResult(req);

//   if (!errores.isEmpty()) {
//     // Log interno para debugging o auditoría
//     logValidationError(req.path, errores.array());

//     return res.status(400).json({
//       status: 400,
//       message: "Los datos enviados son inválidos",
//       ...(isProduction ? {} : { errors: errores.array() }),
//     });
//   }

//   next();
// };

import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validarRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Campos no válidos",
      error: {
        code: "invalid_fields",
        message: "Uno o más campos no son válidos",
        data: errors.mapped(),
      },
    });
  }

  next();
};
