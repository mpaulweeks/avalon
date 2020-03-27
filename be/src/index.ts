'use strict';

import * as express from 'express';
import * as http from 'http';
import * as url from 'url';
import { ServerBase } from './ServerBase';
import { ServerGame } from './ServerGame';
import { ServerMemory } from './ServerMemory';
import { ServerVote } from './ServerVote';

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const websockets: ServerBase<any>[] = [
  new ServerMemory(),
  new ServerGame(),
  new ServerVote(),
];

app.get('/', (request, response) => {
  response.send(`
    <div>
      Hello from avalon-be!
    </div>
    <div>
      Try going to <a href="https://mpaulweeks.github.io/avalon/">https://mpaulweeks.github.io/avalon/</a>
    </div>
  `)
});

server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname.slice(1);
  const match = websockets.filter(ws => ws.path === pathname)[0];

  if (match) {
    console.log('found match:', pathname);
    match.server.handleUpgrade(request, socket, head, function done(ws) {
      match.server.emit('connection', ws, request);
    });
  } else {
    console.log('did not find match:', pathname);
    socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log('Listening on http://localhost:8080');
});
