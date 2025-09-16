import { Request, Response } from "express";
import { ActualizarFiscalGeneralService } from "../../models/fiscales_generales/applications/actualizar-fiscales-generales.service";
import { InsertarFiscalGeneralService } from "../../models/fiscales_generales/applications/insertar-fiscales-generales.service";
import { ListarFiscalesGeneralesService } from "../../models/fiscales_generales/applications/listar-fiscales-generales.service";
import {
  IFiscalesGeneralesInsert,
  IFiscalesGeneralesUpdate,
  IParamInsertFiscalesGenerales,
} from "../../models/fiscales_generales/fiscales_generales.type";

const listarFiscalesGeneralesService = new ListarFiscalesGeneralesService();
const insertarFiscalGeneralService = new InsertarFiscalGeneralService();
const actualizarFiscalGeneralService = new ActualizarFiscalGeneralService();

export class FiscalesGeneralesController {
  async listarFiscalesGenerales(req: Request, res: Response) {
    try {
      const filter = req.query;
      const result = await listarFiscalesGeneralesService.listar(filter);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(
        "[FiscalesGeneralesController] Error al listar fiscales generales:",
        error
      );
      return res.status(500).json({
        status: 500,
        message: "Error interno al listar fiscales generales",
        error,
      });
    }
  }

  async insertarFiscalGeneral(req: Request, res: Response) {
    try {
      const param: IParamInsertFiscalesGenerales = req.body;
      const result = await insertarFiscalGeneralService.crearFiscalGeneral(
        param
      );
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(
        "[FiscalesGeneralesController] Error al crear fiscal general:",
        error
      );
      return res.status(500).json({
        status: 500,
        message: "Error interno al crear fiscal general",
        error,
      });
    }
  }

  async actualizarFiscalGeneral(req: Request, res: Response) {
    try {
      const param: IFiscalesGeneralesUpdate = req.body;
      const result =
        await actualizarFiscalGeneralService.actualizarFiscalGeneral(param);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(
        "[FiscalesGeneralesController] Error al actualizar fiscal general:",
        error
      );
      return res.status(500).json({
        status: 500,
        message: "Error interno al actualizar fiscal general",
        error,
      });
    }
  }
}
