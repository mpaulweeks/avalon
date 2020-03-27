import * as WebSocket from 'ws';

export abstract class ServerBase<T> {
  server: WebSocket.Server;

  constructor() {
    this.server = new WebSocket.Server({ noServer: true });
    this.server.on('connection', client => {
      this.connection(client);
      client.on('message', data => this.message(client, data as any as T));
      client.on('close', () => this.close(client));
    });
  }

  abstract path(): string;

  isEmpty() {
    return this.server.clients.size === 0;
  }
  otherClients(client: WebSocket) {
    return Array.from(this.server.clients).filter(c => c !== client);
  }
  kill() {
    this.server.close();
  }

  connection(client: WebSocket) {
    console.log('client connected');
  }

  message(client: WebSocket, data: T) {
    console.log('received:', data);
  }

  close(client: WebSocket) {
    console.log('client closed');
  }
}
