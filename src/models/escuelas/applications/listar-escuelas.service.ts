import {
  getEscuelasByFilter,
  getEscuelasTotalRegistro,
} from "../escuelas.model";
import { IEscuelasFilter } from "../escuelas.type";

export class ListarEscuelasService {
  async listar(filter: IEscuelasFilter) {
    try {
      const [escuelas, total] = await Promise.all([
        getEscuelasByFilter(filter),
        getEscuelasTotalRegistro(filter),
      ]);

      return {
        status: 200,
        message: "Escuelas encontradas",
        data: {
          escuelas: escuelas || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error) {
      console.error("[ListarEscuelasService] Error:", error);
      return {
        status: 500,
        message: "Error al listar escuelas",
        error,
      };
    }
  }
}
