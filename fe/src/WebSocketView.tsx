import React from 'react';

export abstract class WebSocketView<Props, State> extends React.Component<Props, State> {

  url = 'localhost:8080';
  ws: WebSocket;
  constructor(props: Props) {
    super(props);
    this.ws = new WebSocket(`ws://${this.url}/${this.path()}`);
    console.log('constructing websocket view for:', this.path());
  }

  path() {
    return 'memory';
  }
  componentDidMount() {
    this.ws.onmessage = event => {
      const data = JSON.parse(event.data) as State;
      this.setState({ ...data, });
    };
  }
  componentWillUnmount() {
    this.ws.close();
  }
}
