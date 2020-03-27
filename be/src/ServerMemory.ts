import * as WebSocket from 'ws';
import { ServerBase } from './ServerBase';

declare var process: {
  env: { [key: string]: string; },
  memoryUsage(): any,
};

export class ServerMemory extends ServerBase<{}> {
  id: NodeJS.Timeout;

  path() { return 'memory'; }

  isEmpty() {
    return false;
  }

  connection(ws: WebSocket) {
    this.id = setInterval(() => {
      ws.send(JSON.stringify(process.memoryUsage()), () => {
        //
        // Ignore errors.
        //
      });
    }, 100);
  }

  close(client: WebSocket) {
    super.close(client);
    if (this.otherClients(client).length === 0) {
      clearInterval(this.id);
    }
  }
}
