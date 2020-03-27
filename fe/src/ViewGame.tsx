import React from 'react';
import { WebSocketView, StateBase } from './WebSocketView';
import { RoleData, RoleType } from './Role';
import { BrowserStorage } from './Storage';

export interface GameData {
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
  gameid: string;
  data: GameData,
}
interface State extends StateBase<GameData> {}

export class ViewGame extends WebSocketView<Props, State, GameData> {
  state: State = {
    data: this.props.data,
  };
  path() { return 'game'; }

  componentDidMount() {
    super.componentDidMount();
    BrowserStorage.set({
      ...BrowserStorage.get(),
      game: this.props.gameid,
    });
  }

  render() {
    const { data } = this.state;
    const host = data.players[data.host];
    const hostName = host ? host.name : '???';

    const storage = BrowserStorage.get();
    const me = data.players[storage.id];
    const myData = RoleData[me.role];
    const others = Object.keys(data.players).filter(id => id !== storage.id).map(key => data.players[key]);
    const youSee = others.filter(o => myData.sees.includes(o.role)).map(o => o.name);

    return (
      <div>
        <h1>Game State</h1>



      </div>
    );
  }
}
