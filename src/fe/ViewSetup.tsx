import React from 'react';
import styled from 'styled-components';
import { AllRoles } from '../core/role';
import { GameData, Role, Roles, UserState, PlayerData } from '../core/types';
import { getBoardFor, shuffle, sortObjVals } from "../core/utils";
import { FIREBASE } from '../core/firebase';
import { HostBox, Blue, Red } from './shared';

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
    FIREBASE.updateRoles(this.props.data.gid, newRoles);
  }
  removeRole(role: Role) {
    const newRoles = [...this.props.data.roles];
    const index = newRoles.findIndex(r => r === role);
    if (index >= 0) {
      newRoles.splice(index, 1);
      FIREBASE.updateRoles(this.props.data.gid, newRoles);
    }
  }
  assign() {
    const { gid, players, roles } = this.props.data;
    if (Object.keys(players).length !== roles.length) {
      return this.setState({
        errorMessage: 'you need the same number of roles as players',
      });
    }
    this.setState({ errorMessage: undefined });
    const shuffledPlayers = shuffle(Object.keys(players));
    const shuffledRoles = shuffle(roles);
    shuffledPlayers.forEach((pid, index) => {
      players[pid].role = shuffledRoles[index];
    });
    FIREBASE.updateBoard(gid, getBoardFor(roles.length));
    FIREBASE.updatePlayers(gid, players);
    FIREBASE.updateTurn(gid, {
      current: shuffledPlayers[0],
      order: shuffledPlayers,
    });
    FIREBASE.clearNominations(gid);
    FIREBASE.clearMission(gid);
  }
  clear() {
    const { gid, players } = this.props.data;
    Object.keys(players).forEach((id, index) => {
      players[id].role = null; // null for Firebase
    });
    FIREBASE.updatePlayers(gid, players);
    FIREBASE.updateTurn(gid, null);
    FIREBASE.hidePlayers(gid);
  }

  renderReveal(players: PlayerData[]) {
    return (
      <ul>
        {players.map((p, i) => {
          const role = p.role && AllRoles[p.role];
          const roleName = role ? role.name : '???';
          const isRed = role && role.isRed;
          return (
            <li key={i}>
              {p.name}: {isRed ? <Red>{roleName}</Red> : <Blue>{roleName}</Blue>}
            </li>
          );
        })}
      </ul>
    );
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
              data.reveal ? (
                <button onClick={() => this.clear()}>Clear roles and reset game</button>
              ) : (
                <button onClick={() => FIREBASE.revealPlayers(data.gid)}>
                  End game and reveal all roles
                </button>
              )
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

        {data.reveal && (
          <div>
            <h3>GAME OVER! This was everyone's identity:</h3>
            {this.renderReveal(sortedPlayers)}
          </div>
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
              <button key={p.pid} onClick={() => FIREBASE.kickPlayer(data, p.pid)}>
                {p.name}
              </button>
            ))}
          </HostBox>
        )}
      </div>
    );
  }
}
