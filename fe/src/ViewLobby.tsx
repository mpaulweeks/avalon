import React from 'react';
import { BrowserStorage, UserState, randomId } from './Storage';
import { ViewGame } from './ViewGame';
import { hri } from 'human-readable-ids';

interface Props { }
interface State {
  storage: UserState;
  isHost: boolean;
  tempName: string;
  tempJoin: string;
}

export class ViewLobby extends React.Component<Props, State> {
  state: State = {
    storage: BrowserStorage.get(),
    isHost: false,
    tempName: hri.random(),
    tempJoin: '',
  };

  setName() {
    BrowserStorage.set({
      ...BrowserStorage.get(),
      name: this.state.tempName,
    });
    this.setState({ storage: BrowserStorage.get(), });
  }
  createGame() {
    BrowserStorage.set({
      ...BrowserStorage.get(),
      game: randomId(3),
    });
    this.setState({
      storage: BrowserStorage.get(),
      isHost: true,
    });
  }
  joinGame() {
    BrowserStorage.set({
      ...BrowserStorage.get(),
      game: this.state.tempJoin,
    });
    this.setState({ storage: BrowserStorage.get(), });
  }

  render() {
    const { storage, isHost, tempName, tempJoin } = this.state;

    if (storage.game) {
      return <ViewGame isHost={isHost} game={storage.game} />
    }

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
          <button onClick={() => this.createGame()}>create game</button>
        </div>

        <hr />

        <div>
          <input value={tempJoin} onChange={event => this.setState({ tempJoin: event.target.value, })} />
          <button onClick={() => this.joinGame()}>join game</button>
        </div>
      </div>
    );
  }
}
