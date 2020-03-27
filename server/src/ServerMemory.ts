import * as WebSocket from 'ws';
import { ServerBase } from './ServerBase';

declare var process: {
  env: { [key: string]: string; },
  memoryUsage(): any,
};

export class ServerMemory extends ServerBase<{}> {
  path = 'memory';
  id: NodeJS.Timeout;

  connection(ws: WebSocket) {
    this.id = setInterval(() => {
      ws.send(JSON.stringify(process.memoryUsage()), () => {
        //
        // Ignore errors.
        //
      });
    }, 100);
  }

  close() {
    super.close();
    clearInterval(this.id);
  }
}
