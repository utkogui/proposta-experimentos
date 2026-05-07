/**
 * Carrega variáveis de ambiente do .env.local em scripts standalone (tsx).
 * Não necessário em runtime do Next, que já carrega automaticamente.
 */
import { config as loadDotenv } from "dotenv";
import path from "node:path";

loadDotenv({ path: path.resolve(process.cwd(), ".env.local") });
loadDotenv({ path: path.resolve(process.cwd(), ".env") });
