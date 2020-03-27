import React from 'react';
import { BrowserStorage, randomId, UserState } from './Storage';

interface Props { }
interface State {
  storage: UserState,
}

export class ViewReset extends React.Component<Props, State> {
  state: State = {
    storage: BrowserStorage.get(),
  };
  reset() {
    BrowserStorage.set({
      id: randomId(6),
      name: undefined,
      game: undefined,
    });
    this.setState({ storage: BrowserStorage.get(), });
  }
  render() {
    const { id, name, game } = this.state.storage;
    return (
      <div>
        <h1>Current Local State</h1>
        <h3>id: {id}</h3>
        <h3>name: {name}</h3>
        <h3>game: {game}</h3>
        <div>
          <button onClick={() => this.reset()}>reset everything</button>
        </div>
      </div>
    );
  }
}
