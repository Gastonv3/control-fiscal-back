import { Request, Response } from "express";
import { ActualizarFiscalesDigitalesService } from "../../models/fisicales_digitales/applications/actualizar-fiscales-digitales.service";
import { InsertarFiscalesDigitalesService } from "../../models/fisicales_digitales/applications/insertar-fiscales-digitales.service";
import { ListarFiscalesDigitalesService } from "../../models/fisicales_digitales/applications/listar-fiscales-digitales.service";
import {
  IFiscalesDigitalesEstadoAsistenciaUpdate,
  IFiscalesDigitalesUpdate,
  IFiscalesDigitalesInsert,
} from "../../models/fisicales_digitales/fisicales_digitales.type";
import { EstadoAsistenciaFiscalesDigitalesService } from "../../models/fisicales_digitales/applications/estado-asistencia-fiscales-digitales.service";

const listarFiscalesDigitalesService = new ListarFiscalesDigitalesService();
const insertarFiscalDigitalService = new InsertarFiscalesDigitalesService();
const actualizarFiscalDigitalService = new ActualizarFiscalesDigitalesService();
const estadoAsistenciaFiscalesDigitalesService =
  new EstadoAsistenciaFiscalesDigitalesService();

export class FiscalesDigitalesController {
  async listarFiscalesDigitales(req: Request, res: Response) {
    try {
      const filter = req.query;
      const result = await listarFiscalesDigitalesService.listar(filter);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[FiscalesDigitalesController] Error al listar:", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno al listar fiscales digitales",
        error,
      });
    }
  }

  async insertarFiscalDigital(req: Request, res: Response) {
    try {
      const param: IFiscalesDigitalesInsert = req.body;
      const result = await insertarFiscalDigitalService.crearFiscalDigital(
        param
      );
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[FiscalesDigitalesController] Error al crear:", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno al crear fiscal digital",
        error,
      });
    }
  }

  async actualizarFiscalDigital(req: Request, res: Response) {
    try {
      const param: IFiscalesDigitalesUpdate = req.body;
      const result =
        await actualizarFiscalDigitalService.actualizarFiscalDigital(param);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(
        "[FiscalesDigitalesController] Error al actualizar:",
        error
      );
      return res.status(500).json({
        status: 500,
        message: "Error interno al actualizar fiscal digital",
        error,
      });
    }
  }

  async estadoAsistenciaFiscalesDigitales(req: Request, res: Response) {
    try {
      const param: IFiscalesDigitalesEstadoAsistenciaUpdate = req.body;
      const result =
        await estadoAsistenciaFiscalesDigitalesService.actualizarFiscalDigital(
          param
        );
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(
        "[FiscalesDigitalesController] Error al actualizar:",
        error
      );
      return res.status(500).json({
        status: 500,
        message:
          "Error interno al actualizar fiscal digital estado de asistencia",
        error,
      });
    }
  }
}
