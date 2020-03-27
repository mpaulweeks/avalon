'use strict';

import * as express from 'express';
import * as http from 'http';
import * as url from 'url';
import { ServerBase } from './ServerBase';
import { ServerGame } from './ServerGame';
import { ServerMemory } from './ServerMemory';

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const websocketsByPath: { [key: string]: ServerBase<any> } = {
  memory: new ServerMemory(),
};

app.get('/', (request, response) => {
  response.send(`
    <h1>
      Hello from avalon-be!
    </h1>
    <div>
      Try going to <a href="https://mpaulweeks.github.io/avalon/">https://mpaulweeks.github.io/avalon/</a>
    </div>
    <h3>
      Lobbies:
    </h3>
    <ul>
      ${Object.keys(websocketsByPath).map(path => `
        <li>${websocketsByPath[path].server.clients.size} ${path}</li>
      `).join('')}
    </ul>
  `)
});

app.get('/purge', (request, response) => {
  const killed = [];
  Object.values(websocketsByPath).forEach(server => {
    if (server.isEmpty()) {
      killed.push(server.path());
      server.kill();
      delete websocketsByPath[server.path()];
    }
  });
  response.send(`
    <h3>
      Killed:
    </h3>
    <ul>
      ${killed.map(path => `
        <li>${path}</li>
      `).join('')}
    </ul>
  `)
});

server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname.slice(1);
  let match = websocketsByPath[pathname];

  if (!match) {
    console.log('creating new server:', pathname);
    match = new ServerGame<any>(pathname);
    websocketsByPath[pathname] = match;
  }

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
