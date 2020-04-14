import React from 'react';
import { BrowserStorage, UserState } from './Storage';
import { hri } from 'human-readable-ids';
import { isDev } from './utils';

interface Props {
  createGame(): void;
  joinGame(id: string): void;
}
interface State {
  storage: UserState;
  tempName: string;
  tempJoin: string;
}

export class ViewLobby extends React.Component<Props, State> {
  state: State = {
    storage: BrowserStorage.get(),
    tempName: isDev ? hri.random().split('-')[0] : '',
    tempJoin: '',
  };

  setName() {
    BrowserStorage.set({
      ...BrowserStorage.get(),
      name: this.state.tempName,
    });
    this.setState({ storage: BrowserStorage.get(), });
  }

  render() {
    const { storage, tempName, tempJoin } = this.state;

    if (!storage.name) {
      return (
        <div>
          <h1>Enter your name</h1>
          <input value={tempName} onChange={event => this.setState({ tempName: event.target.value, })} />
          <button onClick={() => this.setName()}>confirm</button>
        </div>
      )
    }

    return (
      <div>
        <h1>Find a Game</h1>

        <div>
          <button onClick={() => this.props.createGame()}>create new game</button>
        </div>

        <h3>or</h3>

        <div>
          <input
            value={tempJoin}
            onChange={event => this.setState({ tempJoin: event.target.value, })}
            placeholder="enter game id"
          />
          <br/>
          <br/>
          <button onClick={() => this.props.joinGame(tempJoin)}>join game</button>
        </div>
      </div>
    );
  }
}
