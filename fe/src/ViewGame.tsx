import React from 'react';
import { WebSocketView, StateBase } from './WebSocketView';
import { RoleData, RoleType, Roles } from './Role';
import { BrowserStorage } from './Storage';

interface GameData {
  id: string;
  host?: string;
  roles: string[];
  players: {
    [key: string]: {
      id: string;
      name: string;
      role?: RoleType;
    };
  };
}
interface Props {
  isHost: boolean;
  game: string;
}
interface State extends StateBase<GameData> { }

export class ViewGame extends WebSocketView<Props, State, GameData> {
  state: State = {
    data: {
      id: this.props.game,
      host: this.props.isHost ? BrowserStorage.get().id : undefined,
      roles: [],
      players: {
        [BrowserStorage.get().id]: {
          id: BrowserStorage.get().id,
          name: BrowserStorage.get().name || '???',
        },
      },
    },
  };
  path() { return `game/${BrowserStorage.get().game || 0}`; }

  // overrides
  onOpen() {
    if (this.props.isHost) {
      this.message(this.state.data);
    }
  }
  onReceive(data: GameData) {
    console.log('received:', data);
    const current = this.state.data;
    if (!current.host) {
      // if joining a game, ensure self and broadcast
      data.players = {
        ...current.players,
        ...data.players,
      };
      this.message(data);
    }
    this.setState({ data: data, });
  }

  render() {
    const { data } = this.state;
    const host = data.host && data.players[data.host];
    const hostName = host ? host.name : '???';

    const storage = BrowserStorage.get();
    const me = data.players[storage.id] || {
      name: storage.name,
    };
    const myData = RoleData[me.role || Roles.BasicBlue];
    const others = Object.keys(data.players).filter(id => id !== storage.id).map(key => data.players[key]);
    const youSee = others.filter(o => o.role && myData.sees.includes(o.role)).map(o => o.name);

    return (
      <div>
        <h1>Game #{data.id}</h1>
        <div>host: {hostName}</div>
        <div>players: {Object.values(data.players).map(o => o.id + '/' + o.name).join(', ')}</div>

        {me.role && (
          <div>
            <br />
            <div>you are: {myData.name}</div>
            <div>you see: {youSee.join(', ')}</div>
          </div>
        )}
      </div>
    );
  }
}
