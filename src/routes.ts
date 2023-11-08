import { Router} from "express";
import { CreateUsuarioController } from "./controllers/UsuarioController/CreateUsuarioController";
import { GetallUsuariosController } from "./controllers/UsuarioController/GettAllUsuariosController";
import { DeleteUsuarioController } from "./controllers/UsuarioController/DeleteUsuarioController";
import { UpdateDateColumn } from "typeorm";
import { UpdateUsuarioController } from "./controllers/UsuarioController/UpdateUsuarioController";
import loginController from "./controllers/UsuarioController/LoginController";
const routes = Router();
import { CreateOcorrenciaController } from "./controllers/OcorrenciaController/CreateOcorrenciaController";
import { GettOcorrenciaController } from "./controllers/OcorrenciaController/GettOcorrenciaController";
import { GetAllOcorrenciaController } from "./controllers/OcorrenciaController/GetAllOcorrenciaController";
import { DeleteOcorrenciaController } from "./controllers/OcorrenciaController/DeleteOcorrenciaController";
import { UpdateOcorrenciaController } from "./controllers/OcorrenciaController/UpdateOcorrenciaController";


//CRUD USUARIO
routes.post("/login", loginController);
routes.post("/register", new CreateUsuarioController().handle);
routes.get("/users", new GetallUsuariosController().handle);
routes.delete("/users/:id", new DeleteUsuarioController().handle);
routes.put("/users/:id", new UpdateUsuarioController().handle);



//CRUD OCORRENCIA
routes.post("/ocorrencias", new CreateOcorrenciaController().handle);
routes.get("/ocorrencias/:id", new GettOcorrenciaController().handle);
routes.get("/ocorrencias", new GetAllOcorrenciaController().handle);
routes.delete("/ocorrencias/:id", new DeleteOcorrenciaController().handle);
routes.put("/ocorrencias/:id", new UpdateOcorrenciaController().handle);

export {routes};