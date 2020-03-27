import React from 'react';
import { WebSocketView, StateBase } from './WebSocketView';
import { RoleData, RoleType, Roles } from './Role';
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
  isHost: boolean;
  game: string;
}
interface State extends StateBase<GameData> {
  firstReceive: boolean;
}

export class ViewGame extends WebSocketView<Props, State, GameData> {
  storage = BrowserStorage.get();
  state: State = {
    firstReceive: false,
    data: {
      id: this.props.game,
      host: BrowserStorage.get().id,
      roles: [],
      players: {
        [BrowserStorage.get().id]: {
          name: BrowserStorage.get().name || '???',
          role: Roles.BasicBlue,
        },
      },
    },
  };
  path() { return 'game'; }

  // todo how to coordinate state when joining game?
  onReceive(data: GameData) {
    if (this.props.isHost) {

    }
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
