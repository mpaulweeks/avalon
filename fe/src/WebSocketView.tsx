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
  id = BrowserStorage.get().id;

  componentDidMount() {
  }
  componentWillUnmount() {
  }
}
