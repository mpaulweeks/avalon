import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { AllRoles } from '../core/role';
import { GameData, RoleType, UserState } from '../core/types';
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
    const myData = AllRoles[me.role || RoleType.BasicBlue];
    const others = Object.keys(data.players).filter(id => id !== storage.id).map(key => data.players[key]);
    const youSee = others.filter(o => o.role && myData.sees.includes(o.role)).map(o => o.name);

    const nominations = data.nominations.roster.length > 0 ? data.nominations.roster.map(pid => data.players[pid].name).join(', ') : '(nobody)';
    const playerIds = data.turn ? data.turn.order : Object.keys(data.players).sort();

    return (
      <div>
        <SecretBox>
          <div><u>secret info! do not discuss what's in this box!</u></div>
          {me.role ? (
            <div>
              you are: <b>{myData.name}</b>.
              you see: <b>{youSee.join(', ') || '(nobody)'}</b>
              {myData.description}<br />
            </div>
          ) : (
              <div>
                roles haven't been assigned yet
              </div>
            )}
        </SecretBox>
        <RoleBox>
          <div>
            turn order: {playerIds.map((pid, index, array) => {
            const pdata = data.players[pid];
            const name = (pdata ? pdata.name : '???') + (index < array.length - 1 ? ',' : '');
            const style: CSSProperties = {
              color: pid === data.host ? 'purple' : 'blact',
              fontWeight: (data.turn && pid === data.turn.current) ? 'bold' : 'normal',
            };
            return (
              <span key={pid} style={style}>
                {name}&nbsp;
              </span>
            );
          })}
          </div>
          <div>
            nomination: {nominations}
          </div>
        </RoleBox>
      </div>
    );
  }
}
