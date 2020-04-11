import React from 'react';
import { RoleData, Roles } from './Role';
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

      </div>
    );
  }
}
