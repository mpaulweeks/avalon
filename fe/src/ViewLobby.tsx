import React, { ChangeEvent } from 'react';
import { BrowserStorage, UserState } from './Storage';
import { ViewGame } from './ViewGame';

interface Props {}
interface State {
  storage: UserState;
  loading: boolean;
  tempName: string;
  tempJoin: string;
  name?: string;
  gameid?: string;
}

export class ViewLobby extends React.Component<Props, State> {
  state: State = {
    storage: BrowserStorage.get(),
    loading: true,
    tempName: '',
    tempJoin: '',
  };

  componentDidMount() {
    const { storage } = this.state;
    if (storage.game) {
      // call api for game info
      this.setState({ loading: true, });
    } else {
      this.setState({ loading: false, })
    }
  }

  createGame() {

  }
  joinGame() {

  }

  render() {
    const { storage, loading, name, tempName, tempJoin, gameid } = this.state;

    if (gameid) {
      return <ViewGame gameid={gameid} />
    }

    if (loading) {
      return <h3>loading, please wait...</h3>;
    }

    if (!name) {
      return (
        <div>
          <h1>Enter your name</h1>
          <input value={tempName} onChange={event => this.setState({tempName: event.target.value, })} />
          <button onClick={() => this.setState({name: tempName, })}>confirm</button>
        </div>
      )
    }

    return (
      <div>
        <h1>Find a Game</h1>

        <div>
          <button onClick={() => this.createGame()}>create game</button>
        </div>

        <hr/>

        <div>
          <input value={tempJoin} onChange={event => this.setState({tempJoin: event.target.value, })} />
          <button onClick={() => this.joinGame()}>join game</button>
        </div>
      </div>
    );
  }
}
