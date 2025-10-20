import { Router } from "express";
import { UsuariosRoutes } from "./usuarios/usuarios.routes";
import { verificarToken } from "../middlewares/auth.middlewares";
import { ZonasRoutes } from "./zonas/zonas.routes";
import { CategoriaDirigentesRoutes } from "./categoria_dirigentes/categoria_dirigentes.routes";
import { DirigenteZonaRoutes } from "./dirigente_zona/dirigente_zona.routes";
import { DirigentesRoutes } from "./dirigentes/dirigentes.routes";
import { SystemRoutes } from "./system/system.routes";
import { ReferentesRoutes } from "./referentes/referentes.routes";
import { VotantesRoutes } from "./votantes/votantes.routes";
import { ReferenteZonaRoutes } from "./referente_zona/referente_zona.routes";
import { CategoriaReferentesRoutes } from "./categoria_referentes/categoria_referentes.routes";
import { FiscalesDigitalesRoutes } from "./fiscalaes_digitales/fiscalaes_digitales.routes";
import { FiscalesGeneralesRoutes } from "./fiscales_generales/fiscales_generales.routes";
import { MesasRoutes } from "./mesas/mesas.routes";
import { EscuelasRoutes } from "./escuelas/escuelas.routes";
import { CategoriaResponsablesZonalesRoutes } from "./categoria_resposables_zonales/categoria_resposables_zonales.routes";
import { ResponsablesZonalesRoutes } from "./responsables_zonales/responsables_zonales.routes";
import { ResponsablesZonalesZonaRoutes } from "./responsables_zonales_zona/responsables_zonales_zona.routes";
import { BarriosRoutes } from "./barrios/barrios.routes";
import { ReferenteBarrioRoutes } from "./referente_barrio/referente_barrio.routes";
import { PermisosRoutes } from "./permisos_app/permisos-app.routes";
import { CargoResponsableRoutes } from "./cargo_responsable/cargo_responsable.routes";
import { CargoDirigentesRoutes } from "./cargo_dirigentes/cargo_dirigentes.routes";
import { CargoReferentesRoutes } from "./cargo_referentes/cargo_referentes.routes";
import { CargoUsuariosRoutes } from "./cargo_usuarios/cargo_usuarios.routes";
import { CategoriaUsuariosRoutes } from "./categoria_usuarios/categoria_usuarios.routes";

export class IndexRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.use("/system", new SystemRoutes().router);

    this.router.use("/usuarios", new UsuariosRoutes().router);

    this.router.use(
      "/categoria-usuarios",
      verificarToken,
      new CategoriaUsuariosRoutes().router
    );

    this.router.use(
      "/cargo-usuarios",
      verificarToken,
      new CargoUsuariosRoutes().router
    );

    this.router.use("/zonas", verificarToken, new ZonasRoutes().router);

    this.router.use("/barrios", verificarToken, new BarriosRoutes().router);

    this.router.use(
      "/permisos-app",
      verificarToken,
      new PermisosRoutes().router
    );

    this.router.use(
      "/responsables-zonales",
      verificarToken,
      new ResponsablesZonalesRoutes().router
    );

    this.router.use(
      "/responsables-zonales-zona",
      verificarToken,
      new ResponsablesZonalesZonaRoutes().router
    );

    this.router.use(
      "/categoria-responsables-zonales",
      verificarToken,
      new CategoriaResponsablesZonalesRoutes().router
    );

    this.router.use(
      "/cargo-responsable",
      verificarToken,
      new CargoResponsableRoutes().router
    );

    this.router.use(
      "/dirigentes",
      verificarToken,
      new DirigentesRoutes().router
    );

    this.router.use(
      "/cargo-dirigentes",
      verificarToken,
      new CargoDirigentesRoutes().router
    );

    this.router.use(
      "/dirigente-zona",
      verificarToken,
      new DirigenteZonaRoutes().router
    );
    this.router.use(
      "/categoria-dirigentes",
      verificarToken,
      new CategoriaDirigentesRoutes().router
    );
    this.router.use(
      "/categoria-referentes",
      verificarToken,
      new CategoriaReferentesRoutes().router
    );
    this.router.use(
      "/referentes",
      verificarToken,
      new ReferentesRoutes().router
    );
    this.router.use(
      "/referente-zona",
      verificarToken,
      new ReferenteZonaRoutes().router
    );

    this.router.use(
      "/cargo-referentes",
      verificarToken,
      new CargoReferentesRoutes().router
    );

    this.router.use(
      "/referente-barrio",
      verificarToken,
      new ReferenteBarrioRoutes().router
    );
    this.router.use("/votantes", verificarToken, new VotantesRoutes().router);

    this.router.use(
      "/fiscales-generales",
      verificarToken,
      new FiscalesGeneralesRoutes().router
    );

    this.router.use(
      "/fiscales-digitales",
      verificarToken,
      new FiscalesDigitalesRoutes().router
    );

    this.router.use("/mesas", verificarToken, new MesasRoutes().router);

    this.router.use("/escuelas", verificarToken, new EscuelasRoutes().router);
  }
}
