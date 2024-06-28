// server.js (at the root or appropriate directory outside 'src')
const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'src', 'db', 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(3000, () => console.log('Server is running'));
