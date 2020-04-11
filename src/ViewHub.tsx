import React from "react";
import { ViewDebug } from "./ViewDebug";
import { ViewVote } from "./ViewVote";
import { ViewLobby } from "./ViewLobby";
import { ViewReset } from "./ViewReset";
import { FIREBASE } from "./firebase";
import { GameData } from "./types";
import { BrowserStorage, randomId, UserState } from "./Storage";
import { ViewGame } from "./ViewGame";

type ViewType = 'lobby' | 'game' | 'vote' | 'reset' | 'debug';
const Views = {
  Lobby: 'lobby' as ViewType,
  Game: 'game' as ViewType,
  Vote: 'vote' as ViewType,
  Reset: 'reset' as ViewType,
  Debug: 'debug' as ViewType,
}
const existingGame = BrowserStorage.get().game;

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
      votes: {
        showResults: false,
        tally: {},
      },
    };
  }

  private async join(data: GameData) {
    this.setState({ view: Views.Game, });
    if (data.host) {
      FIREBASE.updateGame(data);
    } else {
      // if joining a game, ensure self and broadcast
      const hostData = await FIREBASE.getGameData(data.id);
      const players = {
        ...data.players,
        ...hostData.players,
      };
      FIREBASE.updatePlayers(data.id, players);
    }
    FIREBASE.joinGame(data.id, data => this.onReceive(data));
  }
  private onReceive(data: GameData) {
    console.log('received:', data);
    this.setState({ data: {
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

  render() {
    const { view, storage, data } = this.state;
    return (
      <div>
        <nav>
          <ul>
            {data && (
              <li>
                <span onClick={() => this.setState({ view: Views.Game })}>Game</span>
              </li>
            )}
            {data && (
              <li>
                <span onClick={() => this.setState({ view: Views.Vote })}>Vote</span>
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
            <li>
              <span onClick={() => this.setState({ view: Views.Debug })}>Debug</span>
            </li>
          </ul>
        </nav>

        {view === Views.Game && data && (
          <ViewGame data={data} />
        )}
        {view === Views.Vote && data && (
          <ViewVote data={data} />
        )}
        {view === Views.Lobby && !data && (
          <ViewLobby
            createGame={() => this.createGame()}
            joinGame={id => this.joinGame(id)}
          />
        )}
        {view === Views.Reset && (
          <ViewReset
            storage={storage}
            reset={() => this.reset()}
          />
        )}
        {view === Views.Debug && (
          <ViewDebug />
        )}
      </div>
    );
  }
}
