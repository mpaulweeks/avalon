import React from 'react';

import { WebSocketView, StateBase, remoteDomain } from './WebSocketView';

interface Data {
  rss: string;
  heapTotal: string;
  heapUsed: string;
  external: string;
}
type StateKey = keyof Data;
interface Props {}
interface State extends StateBase<Data> {}

export class ViewDebug extends WebSocketView<Props, State, Data> {
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
        <p>
          <a href="https://mpaulweeks.github.io/avalon/">mpaulweeks.github.io/avalon</a>
        </p>
        <p>
          <a href={'https://' + remoteDomain}>{remoteDomain}</a>
        </p>
        {Object.keys(data).map(key => (
          <div key={key}>{key}: {data[key as StateKey]}</div>
        ))}
      </div>
    );
  }
}
