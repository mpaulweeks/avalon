import React from 'react';
import logo from './logo.svg';
import './App.css';

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

export class App extends WebSocketView<Props, State, Data> {
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
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {Object.keys(data).map(key => (
            <div key={key}>{key}: {data[key as StateKey]}</div>
          ))}
        </header>
      </div>
    );
  }
}
