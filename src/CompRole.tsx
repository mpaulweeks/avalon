import React from 'react';
import styled from 'styled-components';
import { RoleData, Roles } from './Role';
import { UserState } from './Storage';
import { GameData } from './types';

const RoleBox = styled.div`
  padding: 1rem;
  border: 1px solid black;
  background-color: #eeeeee;
`;

interface Props {
  storage: UserState;
  data: GameData;
}
interface State { }

export class CompRole extends React.Component<Props, State> {
  render() {
    const { storage, data } = this.props;
    const me = data.players[storage.id] || {
      name: storage.name,
    };
    const myData = RoleData[me.role || Roles.BasicBlue];
    const others = Object.keys(data.players).filter(id => id !== storage.id).map(key => data.players[key]);
    const youSee = others.filter(o => o.role && myData.sees.includes(o.role)).map(o => o.name);

    return (
      <RoleBox>
        {me.role ? (
          <div>
            {data.turn && (
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
            )}
            <div>you are: {myData.name}</div>
            <div>you see: {youSee.join(', ') || '(nobody)'}</div>
            {data.nominations.roster.length > 0 ? (
              <div>
                nomination: {data.nominations.roster.map(pid => data.players[pid].name).join(', ')}
              </div>
            ) : null}
          </div>
        ) : (
            <div>
              <div>
                players: {Object.values(data.players).map(p => p.name).join(', ')}
              </div>
              <div>
                roles haven't been assigned yet
            </div>
            </div>
          )}
      </RoleBox>
    );
  }
}
