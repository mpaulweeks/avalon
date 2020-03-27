import React from 'react';

export interface StateBase<Data> {
  data: Data;
};

export abstract class WebSocketView<Props, State extends StateBase<Data>, Data> extends React.Component<Props, State> {
  abstract path(): string;

  id = '' + Math.floor(Math.random() * 1000000);
  url = 'localhost:8080';
  ws: WebSocket;
  constructor(props: Props) {
    super(props);
    this.ws = new WebSocket(`ws://${this.url}/${this.path()}`);
    console.log('constructing websocket view for:', this.path());
  }

  componentDidMount() {
    this.ws.onmessage = event => {
      const data = JSON.parse(event.data) as Data;
      this.setState({ data: data, });
    };
  }
  componentWillUnmount() {
    this.ws.close();
  }

  message(data: Data) {
    this.ws.send(JSON.stringify(data));
  }
}
