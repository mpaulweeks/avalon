import * as WebSocket from 'ws';

export abstract class ServerBase<T> {
  path: string;
  server: WebSocket.Server;

  constructor() {
    this.server = new WebSocket.Server({ noServer: true });
    this.server.on('connection', ws => {
      this.connection(ws);
      ws.on('message', data => this.message(data as any as T));
      ws.on('close', () => this.close());
    });
  }

  connection(ws: WebSocket) {
    console.log('ws connected');
  }

  message(data: T) {
    console.log('received:', data);
  }

  close() {
    console.log('ws closed');
  }
}
