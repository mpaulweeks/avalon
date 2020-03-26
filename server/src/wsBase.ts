import * as WebSocket from 'ws';

export abstract class wsBase {
  path: string;
  server: WebSocket.Server;

  constructor() {
    this.server = new WebSocket.Server({ noServer: true });
    this.server.on('connection', ws => {
      this.connection(ws);
      ws.on('close', () => this.close());
    });
  }

  connection(ws: WebSocket) {
    console.log('ws connected');
  }

  close() {
    console.log('ws closed');
  }
}
