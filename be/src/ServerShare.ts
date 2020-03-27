import * as WebSocket from 'ws';
import { ServerBase } from './ServerBase';

export abstract class ServerShare<T> extends ServerBase<T> {
  lastData: T;

  connection(ws: WebSocket) {
    if (this.lastData) {
      ws.send(this.lastData);
    }
  }
  message(data: T) {
    this.server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
    this.lastData = data;
  }
}
