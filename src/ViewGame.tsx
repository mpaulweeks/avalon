import React from 'react';
import { BrowserStorage, UserState } from './Storage';
import { GameData } from './types';

interface Props {
  data: GameData;
  isHost: boolean;
  storage: UserState;
}
interface State { }

export class ViewGame extends React.Component<Props, State> {
  render() {
    const { data } = this.props;
    const host = data.host && data.players[data.host];
    const hostName = host ? host.name : '???';

    const storage = BrowserStorage.get();
    const me = data.players[storage.id] || {
      name: storage.name,
    };

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

      </div>
    );
  }
}
