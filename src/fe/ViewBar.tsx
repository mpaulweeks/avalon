import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { AllRoles } from '../core/role';
import { GameData, RoleType, UserState } from '../core/types';
import { StyledBox } from './shared';
import { getCurrentPlayers, sortObjVals } from '../core/utils';

export const SecretBox = styled(StyledBox)`
  background-color: black;
  color: white;
  border-color: red;
  cursor: pointer;
`;

export const RoleBox = styled(StyledBox)`
  border-color: black;
  background-color: #eeeeee;

  & span {
    margin: 0 0.1em;
  }
`;

interface Props {
  storage: UserState;
  data: GameData;
}
interface State {
  collapseSecrets: boolean;
}

export class ViewBar extends React.Component<Props, State> {
  state: State = {
    collapseSecrets: false,
  };

  render() {
    const { storage, data } = this.props;
    const { collapseSecrets } = this.state;
    const me = data.players[storage.pid] || {
      name: storage.name,
    };
    const myData = AllRoles[me.role || RoleType.BasicBlue];
    const others = (data.turn ? data.turn.order : []).filter(id => id !== storage.pid).map(key => data.players[key]);
    const youSee = others.filter(o => o.role && myData.sees.includes(o.role)).map(o => o.name);

    const nominations = data.nominations.roster.length > 0 ? data.nominations.roster.map(pid => data.players[pid].name).join(', ') : '(nobody)';
    const playerIds = data.turn ? data.turn.order : getCurrentPlayers(data).map(p => p.pid);

    const allPlayers = sortObjVals(data.players, p => p.name);

    return (
      <div>
        <SecretBox onClick={() => this.setState({ collapseSecrets: !collapseSecrets, })}>
          {collapseSecrets ? (
            <div>
              (click to show secret info)
            </div>
          ) : (
              <div>
                <div>
                  <u>
                    SECRET INFO! do not discuss what's in this box! click to hide from nearby players!
                    </u>
                </div>
                {me.role ? (
                  <div>
                    you are: <b>{myData.name}</b>. you see: <b>{youSee.join(', ') || '(nobody)'}</b>
                    <br />
                    {myData.description}
                  </div>
                ) : (
                    <div>
                      roles haven't been assigned yet
                    </div>
                  )}
              </div>
            )}
        </SecretBox>
        <RoleBox>
          {data.turn ? (
            <div>
              <div>
                turn order: {playerIds.map((pid, index, array) => {
                const pdata = data.players[pid];
                const name = (pdata ? pdata.name : '???') + (index < array.length - 1 ? ',' : '');
                const style: CSSProperties = {
                  color: pid === data.host ? 'purple' : 'black',
                  textDecoration: (data.turn && pid === data.turn.current) ? 'underline' : 'none',
                };
                return (
                  <span key={pid} style={style}>
                    {name}
                  </span>
                );
              })}
              </div>
              <div>
                nomination: {nominations}
              </div>
            </div>
          ) : (
              <div>
                players: {allPlayers.map(p => p.name).join(', ')}
              </div>
            )}
        </RoleBox>
      </div>
    );
  }
}
