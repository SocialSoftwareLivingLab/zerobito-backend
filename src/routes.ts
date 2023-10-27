import { Router} from "express";
import { CreateUsuarioController } from "./controllers/UsuarioController/CreateUsuarioController";
import { GetallUsuariosController } from "./controllers/UsuarioController/GettAllUsuariosController";
import { DeleteUsuarioController } from "./controllers/UsuarioController/DeleteUsuarioController";
import { UpdateDateColumn } from "typeorm";
import { UpdateUsuarioController } from "./controllers/UsuarioController/UpdateUsuarioController";
import loginController from "./controllers/UsuarioController/LoginController";
const routes = Router();


//CRUD
routes.post("/login", loginController);
routes.post("/register", new CreateUsuarioController().handle);
routes.get("/users", new GetallUsuariosController().handle);
routes.delete("/users/:id", new DeleteUsuarioController().handle);
routes.put("/users/:id", new UpdateUsuarioController().handle);
export {routes};