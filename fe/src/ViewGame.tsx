import React from 'react';
import { WebSocketView, StateBase } from './WebSocketView';
import { RoleData, RoleType } from './Role';

interface Data {
  id: string;
  host: string;
  roles: string[];
  players: {
    [key: string]: {
      name: string;
      role: RoleType;
    };
  };
}
interface Props {
  id: string,
  data: Data,
}
interface State extends StateBase<Data> {}

export class ViewGame extends WebSocketView<Props, State, Data> {
  state: State = {
    data: this.props.data,
  };
  path() { return 'vote'; }

  render() {
    const { data } = this.state;
    const host = data.players[data.host];
    const hostName = host ? host.name : '???';

    const me = data.players[this.props.id];
    const myData = RoleData[me.role];
    const others = Object.keys(data.players).filter(id => id !== this.props.id).map(key => data.players[key]);
    const youSee = others.filter(o => myData.sees.includes(o.role)).map(o => o.name);

    return (
      <div>
        <h1>Game State</h1>



      </div>
    );
  }
}
