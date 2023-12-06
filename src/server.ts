import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import "./database";
import { routes } from "./routes";

const app = express();

// Configure o CORS antes de qualquer outra middleware
app.use(cors({
    origin: 'http://143.106.73.48:3000/', // Substitua pelo domínio do seu site
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Se você precisa de suporte a credenciais (cookies, autenticação)
}));

app.use(express.json());

app.use(routes);

app.listen(3001, () => console.log("Server is running on 3001"));
