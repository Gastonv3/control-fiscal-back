import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // límite de 400 requests por IP en ese tiempo
  message: {
    status: 429,
    message: "Demasiadas solicitudes desde esta IP, intentá más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
