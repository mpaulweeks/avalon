import React from 'react';
import { Storage } from './Storage';

export interface StateBase<Data> {
  data: Data;
};

export abstract class WebSocketView<Props, State extends StateBase<Data>, Data> extends React.Component<Props, State> {
  id = Storage.get().id;

  componentDidMount() {
  }
  componentWillUnmount() {
  }
}
