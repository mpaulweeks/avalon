import React from 'react';
import styled from 'styled-components';
import { RoleData, RoleType, RoleTypes } from './Role';
import { GameData, shuffle, getBoardFor } from './types';
import { FIREBASE } from './firebase';
import { UserState } from './Storage';
import { HostBox } from './shared';

const DeleteLink = styled.span`
  cursor: pointer;
  text-decoration: underline;
  color: red;
`;

const ErrorMessage = styled.span`
  color: red;
`;

interface Props {
  isHost: boolean;
  data: GameData;
  storage: UserState;
}
interface State {
  errorMessage?: string;
}

export class ViewSetup extends React.Component<Props, State> {
  state: State = {}

  addRole(role: RoleType) {
    const newRoles = [...this.props.data.roles];
    newRoles.push(role);
    newRoles.sort();
    FIREBASE.updateRoles(this.props.data.id, newRoles);
  }
  removeRole(role: RoleType) {
    const newRoles = [...this.props.data.roles];
    const index = newRoles.findIndex(r => r === role);
    if (index >= 0) {
      newRoles.splice(index, 1);
      FIREBASE.updateRoles(this.props.data.id, newRoles);
    }
  }
  assign() {
    const { id, players, roles } = this.props.data;
    if (Object.keys(players).length !== roles.length) {
      return this.setState({
        errorMessage: 'you need the same number of roles as players',
      });
    }
    this.setState({ errorMessage: undefined });
    const shuffledPlayers = shuffle(Object.keys(players));
    const shuffledRoles = shuffle(roles);
    shuffledPlayers.forEach((id, index) => {
      players[id].role = shuffledRoles[index];
    });
    FIREBASE.updateBoard(id, getBoardFor(roles.length));
    FIREBASE.updatePlayers(id, players);
    FIREBASE.updateTurn(id, {
      current: shuffledPlayers[0],
      order: shuffledPlayers,
    });
  }
  clear() {
    const { id, players } = this.props.data;
    Object.keys(players).forEach((id, index) => {
      players[id].role = null; // null for Firebase
    });
    FIREBASE.updatePlayers(id, players);
    FIREBASE.updateTurn(id, null);
  }

  renderRoles(roles: RoleType[], canEdit: boolean) {
    return (
      <ul>
        {roles.map((role, i) => (
          <li key={i}>
            {canEdit && <DeleteLink onClick={() => this.removeRole(role)}>X</DeleteLink>}
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
          <button key={i} onClick={() => this.addRole(r)}>
            {RoleData[r].name}
          </button>
        ))}
      </div>
    )
  }
  render() {
    const { isHost, data } = this.props;
    const { errorMessage } = this.state;

    const isAssigned = Object.values(data.players).some(p => p.role);
    const canEdit = isHost && !isAssigned;

    const redRoles = Object.values(data.roles).filter(r => RoleData[r].isRed);
    const blueRoles = Object.values(data.roles).filter(r => !RoleData[r].isRed);

    return (
      <div>
        <h1>Setup</h1>

        <h3>
          Players: {Object.keys(data.players).length}
        </h3>
        <div>
          {Object.values(data.players).map(o => o.name).join(', ')}
        </div>

        {isHost && (
          <HostBox>
            {isAssigned ? (
              <div>
                <button onClick={() => this.clear()}>CLEAR ROLES (reset game)</button>
              </div>
            ) : (
                <div>
                  <h3>Add Roles</h3>
                  {this.renderAdd(RoleTypes.filter(r => RoleData[r].isRed))}
                  <br />
                  {this.renderAdd(RoleTypes.filter(r => !RoleData[r].isRed))}
                  <br />
                  <button onClick={() => this.assign()}>ASSIGN ROLES</button>
                  {errorMessage && (
                    <ErrorMessage>{errorMessage}</ErrorMessage>
                  )}
                </div>
              )}
          </HostBox>
        )}

        <h3>Red Roles ({redRoles.length})</h3>
        {this.renderRoles(redRoles, canEdit)}

        <h3>Blue Roles ({blueRoles.length})</h3>
        {this.renderRoles(blueRoles, canEdit)}
      </div>
    );
  }
}
