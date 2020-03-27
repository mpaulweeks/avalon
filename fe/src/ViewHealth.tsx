import React from 'react';

import { WebSocketView, StateBase } from './WebSocketView';

interface Data {
  rss: string;
  heapTotal: string;
  heapUsed: string;
  external: string;
}
type StateKey = keyof Data;
interface Props {}
interface State extends StateBase<Data> {}

export class ViewHealth extends WebSocketView<Props, State, Data> {
  state = {
    data: {
      rss: '?',
      heapTotal: '?',
      heapUsed: '?',
      external: '?',
    },
  };
  path() { return 'memory'; }
  render() {
    const { data } = this.state;
    return (
      <div>
        <h1>Debugging Health Info</h1>
        {Object.keys(data).map(key => (
          <div key={key}>{key}: {data[key as StateKey]}</div>
        ))}
      </div>
    );
  }
}
