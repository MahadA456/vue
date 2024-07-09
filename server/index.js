

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const port = 3000;

server.use(middlewares);
server.use(router);

nodemon({
    script: 'index.js',
    ext: 'js',
    ignore: ['db.json']
}).on('restart', () => {
    console.log('JSON Server has been restarted');
});

server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
});