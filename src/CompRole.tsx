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
            <div>you are: {myData.name}</div>
            <div>you see: {youSee.join(', ') || '(nobody)'}</div>
          </div>
        ) : (
          <div>
            roles haven't been assigned yet
          </div>
        )}
      </RoleBox>
    );
  }
}
