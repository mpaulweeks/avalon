'use strict';

import * as http from 'http';
import * as url from 'url';
import { wsMemory } from './wsMemory';
import { wsBase } from './wsBase';

const server = http.createServer();
const websockets: wsBase[] = [
  new wsMemory(),
];

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

server.listen(8080, function() {
  console.log('Listening on http://localhost:8080');
});
