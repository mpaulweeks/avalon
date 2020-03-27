import React from 'react';
import { BrowserStorage } from './Storage';

export interface StateBase<Data> {
  data: Data;
};

export const remoteDomain = 'wss://avalon-272401.appspot.com';
const useLocal = window.location.href.includes('localhost') && !window.location.href.includes('prod');
export const baseDomain = useLocal ? 'ws://localhost:8080' : remoteDomain;
export const baseDomainPing = 'http' + baseDomain.slice(2);

export abstract class WebSocketView<Props, State extends StateBase<Data>, Data> extends React.Component<Props, State> {
  abstract path(): string;

  id = BrowserStorage.get().id;
  hasReceived = false;

  ws: WebSocket;
  constructor(props: Props) {
    super(props);
    this.ws = new WebSocket(`${baseDomain}/${this.path()}`);
    console.log('constructing websocket view for:', this.path());
  }

  componentDidMount() {
    this.ws.onmessage = event => {
      const data = JSON.parse(event.data) as Data;
      this.onReceive(data);
    };
    this.ws.onopen = () => this.onOpen();
  }
  componentWillUnmount() {
    this.ws.close();
  }

  onOpen() {
    // default to nothing
  }
  onReceive(data: Data) {
    this.setState({ data: data, });
  }
  message(data: Data) {
    this.ws.send(JSON.stringify(data));
  }
}
