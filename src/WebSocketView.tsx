import React from 'react';
import { BrowserStorage } from './Storage';

export interface StateBase<Data> {
  data: Data;
};

export abstract class WebSocketView<Props, State extends StateBase<Data>, Data> extends React.Component<Props, State> {
  id = BrowserStorage.get().id;

  componentDidMount() {
  }
  componentWillUnmount() {
  }
}
