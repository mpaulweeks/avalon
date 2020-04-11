import React from "react";
import { ViewDebug } from "./ViewDebug";
import { ViewVote } from "./ViewVote";
import { ViewLobby } from "./ViewLobby";
import { ViewReset } from "./ViewReset";
import { FIREBASE } from "./firebase";
import { GameData, isDebug } from "./types";
import { BrowserStorage, randomId, UserState } from "./Storage";
import { ViewGame } from "./ViewGame";
import { ViewSetup } from "./ViewSetup";
import { CompRole } from "./CompRole";

type ViewType = 'lobby' | 'game' | 'setup' | 'vote' | 'reset' | 'debug';
const Views = {
  Lobby: 'lobby' as ViewType,
  Game: 'game' as ViewType,
  Setup: 'setup' as ViewType,
  Vote: 'vote' as ViewType,
  Reset: 'reset' as ViewType,
  Debug: 'debug' as ViewType,
}

interface Props {}
interface State {
  view: ViewType;
  storage: UserState;
  data?: GameData;
}

export class ViewHub extends React.Component<Props, State> {
  state: State = {
    view: Views.Lobby,
    storage: BrowserStorage.get(),
  };
  componentDidMount() {
    const { storage } = this.state;
    if (storage.name && storage.game) {
      this.join(this.genGuestGameData());
    }
  }

  private genHostGameData(): GameData {
    const { id } = BrowserStorage.get();
    return {
      ...this.genGuestGameData(),
      host: id,
    };
  }
  private genGuestGameData(): GameData {
    const { id, name, game } = BrowserStorage.get();
    if (!game) {
      throw new Error('game should be set in localStorage');
    }
    return {
      id: game,
      host: undefined,
      roles: [],
      players: {
        [id]: {
          id: id,
          name: name || '???',
        },
      },
      turn: null,
      votes: {
        showResults: false,
        tally: {},
      },
    };
  }

  private async join(data: GameData) {
    if (data.host) {
      FIREBASE.updateGame(data);
    } else {
      // if joining a game, ensure self and broadcast
      const hostData = await FIREBASE.getGameData(data.id);
      if (!hostData) {
        this.reset();
        return;
      }
      const players = {
        ...data.players,
        ...hostData.players,
      };
      FIREBASE.updatePlayers(data.id, players);
    }
    this.setState({ view: Views.Game, });
    FIREBASE.joinGame(data.id, data => this.onReceive(data));
  }
  private onReceive(data: GameData) {
    console.log('received:', data);
    this.setState({ data: {
      roles: [],
      turn: null,
      ...data,
      votes: {
        tally: {},
        ...data.votes,
      },
    }});
  }

  createGame() {
    BrowserStorage.set({
      ...BrowserStorage.get(),
      game: randomId(3),
    });
    this.join(this.genHostGameData());
  }
  joinGame(gameId: string) {
    BrowserStorage.set({
      ...BrowserStorage.get(),
      game: gameId,
    });
    this.join(this.genGuestGameData());
  }
  reset() {
    const storage = BrowserStorage.get();
    if (storage.game) {
      FIREBASE.leaveGame(storage.game);
    }
    BrowserStorage.reset();
    this.setState({
      storage: BrowserStorage.get(),
      data: undefined,
    });
  }

  renderMain() {
    const { view, storage, data } = this.state;
    const isHost = !!data && BrowserStorage.get().id === data.host;
    if (view === Views.Game && data) {
      return <ViewGame isHost={isHost} data={data} storage={storage} />
    }
    if (view === Views.Setup && data) {
      return <ViewSetup isHost={isHost} data={data} storage={storage} />
    }
    if (view === Views.Vote && data) {
      return <ViewVote isHost={isHost} data={data} storage={storage} />
    }

    if (view === Views.Lobby && !data) {
      return <ViewLobby
        createGame={() => this.createGame()}
        joinGame={id => this.joinGame(id)}
      />
    }

    if (view === Views.Reset) {
      return <ViewReset
        storage={storage}
        reset={() => this.reset()}
      />
    }
    if (view === Views.Debug) {
      return <ViewDebug />
    }

    return (
      <div>
        <h3>you have reached an invalid state :(</h3>
        <div>view: {view}</div>
        <div>data: {!!data}</div>
        <h3>please try refreshing and/or reset your local state</h3>
      </div>
    )
  }

  render() {
    const { storage, data } = this.state;
    return (
      <div>
        <nav>
          <ul>
            {data && (
              <li>
                <span onClick={() => this.setState({ view: Views.Game })}>Game #{data.id}</span>
              </li>
            )}
            {data && (
              <li>
                <span onClick={() => this.setState({ view: Views.Vote })}>Vote</span>
              </li>
            )}
            {data && (
              <li>
                <span onClick={() => this.setState({ view: Views.Setup })}>Setup</span>
              </li>
            )}
            {!data && (
              <li>
                <span onClick={() => this.setState({ view: Views.Lobby })}>Lobby</span>
              </li>
            )}
            <li>
              <span onClick={() => this.setState({ view: Views.Reset })}>Reset</span>
            </li>
            {isDebug && (
              <li>
                <span onClick={() => this.setState({ view: Views.Debug })}>Debug</span>
              </li>
            )}
          </ul>
        </nav>

        {data && (
          <CompRole data={data} storage={storage} />
        )}

        {this.renderMain()}

      </div>
    );
  }
}
