import * as WebSocket from 'ws';
import { ServerBase } from './ServerBase';

export class ServerGame<T> extends ServerBase<T> {
  private pathname: string;
  server: WebSocket.Server;
  lastData: T;

  constructor(pathname: string) {
    super();
    this.pathname = pathname;
    console.log('new server:', this.pathname, this.lastData);
  }

  path() {
    return `${this.pathname}`;
  }

  connection(client: WebSocket) {
    console.log('client connected');
    console.log('lastData:', this.lastData);
    if (this.lastData) {
      console.log('sending:', this.lastData);
      client.send(this.lastData);
    }
  }

  message(client: WebSocket, data: T) {
    console.log('received:', data);
    this.lastData = data;
    this.otherClients(client).forEach(c => {
      if (c.readyState === WebSocket.OPEN) {
        c.send(data);
      }
    });
  }

  close() {
    console.log('client closed');
  }
}
