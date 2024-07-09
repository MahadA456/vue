import jsonServer from 'json-server';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const server = jsonServer.create();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = jsonServer.router(join(__dirname, 'src', 'db', 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(3000, () => console.log('Server is running'));
