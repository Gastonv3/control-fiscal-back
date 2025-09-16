import express from "express";
import cors from "cors";
import helmet from "helmet";
import { IndexRoutes } from "./routes/index.routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/v1", new IndexRoutes().router);

export default app;
