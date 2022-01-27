const path = require('path');
const http = require('http');
const Koa = require('koa');
const cors = require('koa2-cors');
const koaStatic = require('koa-static');
const koaBody = require('koa-body');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const WS = require('ws');
const Storage = require('./app/Storage');
const StorageDB = require('./app/StorageDB');

const app = new Koa();

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(bodyParser());

const filesDir = path.join(__dirname, 'public');
app.use(koaStatic(filesDir));

const router = new Router();

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
const wsServer = new WS.Server({ server });

const storageDB = new StorageDB();
storageDB.readDB();

const clients = [];
wsServer.on('connection', (ws) => {
  clients.push(ws);
  const storage = new Storage(
    storageDB.dB,
    storageDB.category,
    storageDB.favourites,
    filesDir,
    ws,
    clients,
  );
  storage.init();

  router.post('/upload', async (ctx) => {
    storage.loadFile(ctx.request.files.file, ctx.request.body.geo).then((result) => {
      storage.wsAllSend({ ...result, event: 'file' });
    });
    ctx.response.status = 204;
  });

  ws.on('close', () => {
    const wsIndex = clients.indexOf(ws);
    if (wsIndex !== -1) {
      clients.splice(wsIndex, 1);
    }
  });
});

// eslint-disable-next-line no-console
server.listen(port, () => console.log('Server started'));
