import React from 'react';
import styled from 'styled-components';
import { RoleData, RoleType, RoleTypes } from './Role';
import { GameData } from './types';
import { FIREBASE } from './firebase';
import { UserState } from './Storage';

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
function shuffle<T>(orig: T[]): T[] {
  const array = orig.concat();
	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
};

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
  assign() {
    const { id, players, roles } = this.props.data;
    if (Object.keys(players).length !== roles.length) {
      return this.setState({
        errorMessage: 'you need the same number of roles as players',
      });
    }
    this.setState({ errorMessage: undefined });
    const shuffled = shuffle(roles);
    Object.keys(players).forEach((id, index) => {
      players[id].role = shuffled[index];
    });
    FIREBASE.updatePlayers(id, players);
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

    return (
      <div>
        <h1>Setup</h1>

        <h3>
          Players: {Object.keys(data.players).length}
        </h3>

        {isHost && (
          <div>
            <h3>Add Roles</h3>
            {this.renderAdd(RoleTypes.filter(r => RoleData[r].isRed))}
            <br/>
            {this.renderAdd(RoleTypes.filter(r => !RoleData[r].isRed))}
            <br/>
            <button onClick={() => this.assign()}>SHUFFLE ROLES</button>
            {errorMessage && (
              <ErrorMessage>{errorMessage}</ErrorMessage>
            )}
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
