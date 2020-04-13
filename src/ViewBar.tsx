import React from 'react';
import styled from 'styled-components';
import { RoleData, Roles } from './Role';
import { UserState } from './Storage';
import { GameData } from './types';
import { StyledBox } from './shared';

export const SecretBox = styled(StyledBox)`
  background-color: black;
  color: white;
  border-color: red;
`;

export const RoleBox = styled(StyledBox)`
  border-color: black;
  background-color: #eeeeee;
`;

interface Props {
  storage: UserState;
  data: GameData;
}
interface State { }

export class ViewBar extends React.Component<Props, State> {
  render() {
    const { storage, data } = this.props;
    const me = data.players[storage.id] || {
      name: storage.name,
    };
    const myData = RoleData[me.role || Roles.BasicBlue];
    const others = Object.keys(data.players).filter(id => id !== storage.id).map(key => data.players[key]);
    const youSee = others.filter(o => o.role && myData.sees.includes(o.role)).map(o => o.name);

    const nominations = data.nominations.roster.length > 0 ? data.nominations.roster.map(pid => data.players[pid].name).join(', ') : '(nobody)';

    return (
      <div>
        <SecretBox>
          <div><u>secret info! do not discuss what's in this box!</u></div>
          {me.role ? (
            <div>
              you are: <b>{myData.name}</b>.
              you see: <b>{youSee.join(', ') || '(nobody)'}</b>
            </div>
          ) : (
            <div>
              roles haven't been assigned yet
            </div>
          )}
        </SecretBox>
        <RoleBox>
          {data.turn ? (
            <div>
              turn order: {data.turn.order.map((pid, index, array) => {
              const pdata = data.players[pid];
              const name = (pdata ? pdata.name : '???') + (index < array.length - 1 ? ',' : '');
              return (
                <span key={pid}>
                  {pid === data.turn?.current ? (
                    <b> {name} </b>
                  ) : (name)}
                </span>
              );
            })}
            </div>
          ) : (
            <div>
              players: {Object.values(data.players).map(p => p.name).join(', ')}
            </div>
          )}
          <div>
            nomination: {nominations}
          </div>
        </RoleBox>
      </div>
    );
  }
}
