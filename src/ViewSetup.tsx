import React from 'react';
import styled from 'styled-components';
import { AllRoles } from './Role';
import { GameData, Role, Roles, UserState } from './types';
import { getBoardFor, shuffle, sortObjVals } from "./utils";
import { FIREBASE } from './firebase';
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

  addRole(role: Role) {
    const newRoles = [...this.props.data.roles];
    newRoles.push(role);
    newRoles.sort();
    FIREBASE.updateRoles(this.props.data.id, newRoles);
  }
  removeRole(role: Role) {
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

  renderRoles(roles: Role[], canEdit: boolean) {
    return (
      <ul>
        {roles.map((role, i) => (
          <li key={i}>
            {canEdit && <DeleteLink onClick={() => this.removeRole(role)}>X</DeleteLink>}
            {AllRoles[role].name}
          </li>
        ))}
      </ul>
    );
  }
  renderAdd(roles: Role[]) {
    return (
      <div>
        {roles.map((r, i) => (
          <button key={i} onClick={() => this.addRole(r)}>
            {AllRoles[r].name}
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

    const redRoles = Object.values(data.roles).filter(r => AllRoles[r].isRed);
    const blueRoles = Object.values(data.roles).filter(r => !AllRoles[r].isRed);

    const sortedPlayers = sortObjVals(data.players, p => p.name);

    return (
      <div>
        <h1>Setup</h1>

        <h3>
          Players: {sortedPlayers.length}
        </h3>
        <div>
          {sortedPlayers.map(o => o.name).join(', ')}
        </div>

        {isHost && (
          <HostBox>
            {isAssigned ? (
              <div>
                <button onClick={() => this.clear()}>CLEAR ROLES (reset game)</button>
              </div>
            ) : (
                <div>
                  {this.renderAdd(Roles.filter(r => AllRoles[r].isRed))}
                  <br />
                  {this.renderAdd(Roles.filter(r => !AllRoles[r].isRed))}
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

        {isHost && (
          <HostBox>
            <h3>Kick Player</h3>
            <p>
              Mostly an emergency tool if someone resets their info.
              <br />
              If the player refreshes without resetting their info, they will rejoin.
            </p>

            {sortedPlayers.map(p => (
              <button key={p.id} onClick={() => FIREBASE.kickPlayer(data, p.id)}>
                {p.name}
              </button>
            ))}
          </HostBox>
        )}
      </div>
    );
  }
}
