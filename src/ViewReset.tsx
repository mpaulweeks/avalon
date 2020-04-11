import React from 'react';
import { UserState } from './Storage';

interface Props {
  storage: UserState,
  reset(): void;
}
interface State {}

export class ViewReset extends React.Component<Props, State> {
  render() {
    const { id, name, game } = this.props.storage;
    return (
      <div>
        <h1>Current Local State</h1>
        <h3>id: {id}</h3>
        <h3>name: {name}</h3>
        <h3>game: {game}</h3>
        <div>
          <button onClick={() => this.props.reset()}>reset everything</button>
        </div>
      </div>
    );
  }
}
