import { get } from "http";
import {
  getEstadoVotantes,
  getVotantesByFilter,
  getVotantesTotalRegistro,
} from "../votantes.model";
import { IVotantesEstadoVotantesFilter } from "../votantes.type";

export class ObtenerEstadoVotantesService {
  public async obtener(filter: IVotantesEstadoVotantesFilter) {
    try {
      const estadoVotantes = await getEstadoVotantes(filter);

      return {
        status: 200,
        message: "Votantes encontrados",
        data: {
          estado_votantes: estadoVotantes,
        },
      };
    } catch (error) {
      console.error("[ObtenerEstadoVotantesService] Error:", error);
      return {
        status: 500,
        message: "Error interno al obtener estado de votantes",
        data: [],
      };
    }
  }
}
