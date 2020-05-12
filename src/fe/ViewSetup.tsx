import React from 'react';
import styled from 'styled-components';
import { AllRoles } from '../core/role';
import { GameData, Role, Roles, UserState, PlayerData } from '../core/types';
import { getBoardFor, shuffle, sortObjVals, getCurrentPlayers } from "../core/utils";
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

  async addRole(role: Role) {
    const newRoles = [...this.props.data.roles];
    newRoles.push(role);
    newRoles.sort();
    await FIREBASE.updateRoles(this.props.data.gid, newRoles);
  }
  async removeRole(role: Role) {
    const newRoles = [...this.props.data.roles];
    const index = newRoles.findIndex(r => r === role);
    if (index >= 0) {
      newRoles.splice(index, 1);
      await FIREBASE.updateRoles(this.props.data.gid, newRoles);
    }
  }
  async assign() {
    const { gid, players, roles, includeLady } = this.props.data;
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
      players[pid].hasLady = false;
      players[pid].sawLady = null;
    });
    await FIREBASE.updateBoard(gid, getBoardFor(roles.length));
    await FIREBASE.updatePlayers(gid, players);
    await FIREBASE.updateTurn(gid, {
      current: shuffledPlayers[0],
      order: shuffledPlayers,
    });
    await FIREBASE.clearNominations(gid);
    await FIREBASE.clearMission(gid);
    if (includeLady) {
      await FIREBASE.giveLadyTo(gid, shuffledPlayers.slice(-1)[0]);
    }
  }
  async tryReveal() {
    const { gid } = this.props.data;
    const confirmed = window.confirm("Are you sure you want to reveal roles?\nThis cannot be undone and effectively ends the game.");
    if (confirmed) {
      await FIREBASE.revealPlayers(gid);
    }
  }
  async clear() {
    const { gid, players } = this.props.data;
    Object.keys(players).forEach((id, index) => {
      players[id].role = null; // null for Firebase
    });
    await FIREBASE.updatePlayers(gid, players);
    await FIREBASE.updateTurn(gid, null);
    await FIREBASE.hidePlayers(gid);
  }

  renderReveal(players: PlayerData[]) {
    return (
      <ul>
        {players.map((p, i) => {
          const role = p.role && AllRoles[p.role];
          const roleName = role ? role.name : '???';
          const Color = (role && role.isRed) ? Red : Blue;
          return (
            <li key={i}>
              {p.name}: <Color>{roleName}</Color>
            </li>
          );
        })}
      </ul>
    );
  }
  renderRoles(roles: Role[], canEdit: boolean) {
    return (
      <ul>
        {roles.map((role, i) => {
          const data = AllRoles[role];
          const Color = data.isRed ? Red : Blue;
          return (
            <li key={i}>
              {canEdit && <DeleteLink onClick={() => this.removeRole(role)}>X</DeleteLink>}
              &nbsp;<Color>{data.name}</Color>
              &nbsp;<i>({data.description})</i>
            </li>
          );
        })}
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

    const allPlayers = sortObjVals(data.players, p => p.name);
    const isAssigned = allPlayers.some(p => p.role);
    const canEdit = isHost && !isAssigned;
    const currentPlayers = isAssigned ? getCurrentPlayers(data) : allPlayers;

    const redRoles = Object.values(data.roles).filter(r => AllRoles[r].isRed);
    const blueRoles = Object.values(data.roles).filter(r => !AllRoles[r].isRed);

    return (
      <div>
        <h1>Setup</h1>

        <h3>
          Players: {currentPlayers.length}
        </h3>
        <div>
          {currentPlayers.map(o => o.name).join(', ')}
        </div>

        {isHost && (
          <HostBox>
            {isAssigned ? (
              data.reveal ? (
                <button onClick={() => this.clear()}>Clear roles and reset game</button>
              ) : (
                <button onClick={() => this.tryReveal()}>
                  Reveal all roles
                </button>
              )
            ) : (
                <div>
                  {this.renderAdd(Roles.filter(r => AllRoles[r].isRed))}
                  <br />
                  {this.renderAdd(Roles.filter(r => !AllRoles[r].isRed))}
                  <br />
                  <div>
                    <button onClick={() => FIREBASE.setIncludeLady(data.gid, !data.includeLady)}>
                      {data.includeLady ? 'Lady of the Lake is ON' : 'Lady of the Lake is OFF'}
                    </button>
                  </div>
                  <br />
                  <div>
                    <button onClick={() => this.assign()}>ASSIGN ROLES</button>
                    {errorMessage && (
                      <ErrorMessage>{errorMessage}</ErrorMessage>
                    )}
                    </div>
                </div>
              )}
          </HostBox>
        )}

        {data.reveal && (
          <div>
            <h3>GAME OVER! This was everyone's identity:</h3>
            {this.renderReveal(currentPlayers)}
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

            {allPlayers.map(p => (
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
