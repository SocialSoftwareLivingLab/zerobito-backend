import { Router } from "express";
import { CreateOcorrenciaController } from "../controllers/OcorrenciaController/CreateOcorrenciaController";
import { GettOcorrenciaController } from "../controllers/OcorrenciaController/GettOcorrenciaController";
import { DeleteOcorrenciaController } from "../controllers/OcorrenciaController/DeleteOcorrenciaController";
import { UpdateOcorrenciaController } from "../controllers/OcorrenciaController/UpdateOcorrenciaController";
const routes = Router();


//CRUD
routes.post("/ocorrencias", new CreateOcorrenciaController().handle);
routes.get("/ocorrencias/:id", new GettOcorrenciaController().handle);
routes.get("/ocorrencias", new GettOcorrenciaController().handle);
routes.delete("/ocorrencias/:id", new DeleteOcorrenciaController().handle);
routes.put("/ocorrencias/:id", new UpdateOcorrenciaController().handle);
export { routes };