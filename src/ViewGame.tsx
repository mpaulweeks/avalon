import React from 'react';
import { WebSocketView, StateBase } from './WebSocketView';
import { RoleData, RoleType, Roles } from './Role';
import { BrowserStorage } from './Storage';
import { FIREBASE } from './firebase';
import { GameData } from './types';

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
      votes: {},
    },
  };

  componentDidMount() {
    this.join();
  }

  async join() {
    const { data } = this.state;
    if (this.props.isHost) {
      FIREBASE.updateGame(data);
    } else {
      // if joining a game, ensure self and broadcast
      const hostData = await FIREBASE.getGameData(data.id);
      const players = {
        ...data.players,
        ...hostData.players,
      };
      FIREBASE.updatePlayers(data.id, players);
    }
    FIREBASE.joinGame(data.id, data => this.onReceive(data));
  }
  onReceive(data: GameData) {
    console.log('received:', data);
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
        <div>i am: {me.name}</div>
        <div>host: {hostName}</div>
        <br/>
        <div>players:
          <ul>
            {Object.values(data.players).map(o => (
              <li key={o.id}>{o.name}</li>
            ))}
          </ul>
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
