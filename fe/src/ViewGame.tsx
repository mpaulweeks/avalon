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
      name: string;
      role?: RoleType;
    };
  };
}
interface Props {
  reset(): void;
  isHost: boolean;
  game: string;
}
interface State extends StateBase<GameData> { }

export class ViewGame extends WebSocketView<Props, State, GameData> {
  storage = BrowserStorage.get();
  state: State = {
    data: {
      id: this.props.game,
      host: this.props.isHost ? BrowserStorage.get().id : undefined,
      roles: [],
      players: {
        [BrowserStorage.get().id]: {
          name: BrowserStorage.get().name || '???',
        },
      },
    },
  };
  path() { return 'game'; }

  // overrides
  onOpen() {
    this.message(this.state.data);
  }
  onReceive(data: GameData) {
    console.log('received:', data);
    const current = this.state.data;
    const isHost = current.host === BrowserStorage.get().id;
    if (isHost && !data.host) {
      // if getting first ping from new user, update data and broadcast
      current.players = {
        ...current.players,
        ...data.players,
      };
      this.setState({ data: current });
      this.message(current);
    } else {
      this.setState({ data: data, });
    }
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
        <h1>Game State</h1>
        <div>id: {data.id} host: {hostName}</div>
        <div>players: {Object.values(data.players).map(o => o.name).join(', ')}</div>
        <div>
          <button onClick={() => this.props.reset()}>exit game</button>
        </div>

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
