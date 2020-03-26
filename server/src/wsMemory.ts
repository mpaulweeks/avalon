import * as WebSocket from 'ws';
import { wsBase } from './wsBase';

declare var process: {
  env: { [key: string]: string; },
  memoryUsage(): any,
};

export class wsMemory extends wsBase {
  path = 'memory';
  id: NodeJS.Timeout;

  connection(ws: WebSocket) {
    this.id = setInterval(function() {
      ws.send(JSON.stringify(process.memoryUsage()), function() {
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
