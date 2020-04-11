import React from 'react';
import styled from 'styled-components';
import { RoleData, RoleType, RoleTypes } from './Role';
import { GameData } from './types';
import { FIREBASE } from './firebase';

const DeleteLink = styled.span`
  cursor: pointer;
  text-decoration: underline;
  color: red;
`;

interface Props {
  isHost: boolean;
  data: GameData;
}
interface State { }

export class ViewSetup extends React.Component<Props, State> {

  addRole(role: RoleType) {
    const newRoles = [ ...this.props.data.roles ];
    newRoles.push(role);
    newRoles.sort();
    FIREBASE.updateRoles(this.props.data.id, newRoles);
  }
  removeRole(role: RoleType) {
    const newRoles = [ ...this.props.data.roles ];
    const index = newRoles.findIndex(r => r === role);
    if (index >= 0) {
      newRoles.splice(index, 1);
      FIREBASE.updateRoles(this.props.data.id, newRoles);
    }
  }

  renderRoles(roles: RoleType[]) {
    const { isHost } = this.props;
    return (
      <ul>
        {roles.map((role, i) => (
        <li key={i}>
          {isHost && <DeleteLink onClick={() => this.removeRole(role)}>X</DeleteLink>}
          {RoleData[role].name}
        </li>
        ))}
      </ul>
    );
  }
  renderAdd(roles: RoleType[]) {
    return (
      <div>
        {roles.map((r, i) => (
          <div key={i}>
            <button onClick={() => this.addRole(r)}>
              {RoleData[r].name}
            </button>
          </div>
        ))}
      </div>
    )
  }
  render() {
    const { isHost, data } = this.props;

    return (
      <div>
        <h1>Setup</h1>

        {isHost && (
          <div>
            <h3>Add Roles</h3>
            {this.renderAdd(RoleTypes.filter(r => RoleData[r].isRed))}
            <br/>
            {this.renderAdd(RoleTypes.filter(r => !RoleData[r].isRed))}
          </div>
        )}

        <h3>Red Roles</h3>
        {this.renderRoles(Object.values(data.roles).filter(r => RoleData[r].isRed))}

        <h3>Blue Roles</h3>
        {this.renderRoles(Object.values(data.roles).filter(r => !RoleData[r].isRed))}
      </div>
    );
  }
}
