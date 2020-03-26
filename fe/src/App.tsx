import React from 'react';
import logo from './logo.svg';
import './App.css';

import { WebSocketView } from './WebSocketView';

interface Props {}
interface State {
  rss: string;
  heapTotal: string;
  heapUsed: string;
  external: string;
}
type StateKey = keyof State;

export class App extends WebSocketView<Props, State> {
  state = {
    rss: '?',
    heapTotal: '?',
    heapUsed: '?',
    external: '?',
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {Object.keys(this.state).map(key => (
            <div key={key}>{key}: {this.state[key as StateKey]}</div>
          ))}
        </header>
      </div>
    );
  }
}
