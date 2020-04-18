import React from "react";
import styled from "styled-components";
import { ViewDebug } from "./ViewDebug";
import { ViewVote } from "./ViewVote";
import { ViewLobby } from "./ViewLobby";
import { ViewReset } from "./ViewReset";
import { FIREBASE } from "./firebase";
import { GameData, PlayerData } from "./types";
import { isDebug, getBoardFor, APP_VERSION } from "./utils";
import { BrowserStorage, randomId, UserState } from "./Storage";
import { ViewGame } from "./ViewGame";
import { ViewSetup } from "./ViewSetup";
import { ViewBar } from "./ViewBar";
import { ViewNominate } from "./ViewNominate";
import { StyledBox } from "./shared";

const HeaderLink = styled(StyledBox) <{ current: boolean, hasLink: boolean }>`
  margin: 0 0.5em;
  margin-top: 0;
  border-color: #00000000;
  border-top-width: 0;
  & a {
    color: inherit;
  }

  ${props => props.hasLink ? `
    cursor: pointer;
    text-decoration: underline;
  ` : ''}

  ${props => props.current ? `
    border-color: grey;
  ` : ''}

  &:first-child {
    margin-left: 0;
  }
`;

type ViewType = 'loading' | 'lobby' | 'game' | 'setup' | 'nominate' | 'vote' | 'reset' | 'debug';
const Views = {
  Loading: 'loading' as ViewType,
  Lobby: 'lobby' as ViewType,
  Game: 'game' as ViewType,
  Setup: 'setup' as ViewType,
  Nominate: 'nominate' as ViewType,
  Vote: 'vote' as ViewType,
  Reset: 'reset' as ViewType,
  Debug: 'debug' as ViewType,
}

interface Props { }
interface State {
  view: ViewType;
  storage: UserState;
  data?: GameData;
}

interface LinkProps {
  type?: ViewType;
}

export class ViewHub extends React.Component<Props, State> {
  state: State = {
    view: Views.Loading,
    storage: BrowserStorage.get(),
  };
  componentDidMount() {
    const { storage } = this.state;
    if (storage.name && storage.game) {
      this.join(this.genGuestGameData());
    } else {
      this.setState({ view: Views.Lobby, });
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
      board: getBoardFor(7),
      nominations: {
        showResults: false,
        roster: [],
        tally: {},
      },
      roles: [],
      players: {
        [id]: {
          id: id,
          name: name || '???',
        },
      },
      turn: null,
      vetoes: 0,
      votes: {
        showResults: false,
        tally: {},
      },
    };
  }

  private async join(localData: GameData) {
    if (localData.host) {
      FIREBASE.updateGame(localData);
    } else {
      // if joining a game, ensure self and broadcast
      const hostData = await FIREBASE.getGameData(localData.id);
      if (!hostData) {
        // if no game data for old id, reset
        this.reset();
        return;
      }

      // add self to host.players, but prefer local name
      const myId = this.state.storage.id;
      const localMe = localData.players[myId];
      const remoteMe = hostData.players[myId] || {};
      const players: PlayerData = {
        ...hostData.players,
        [myId]: {
          ...localMe,
          ...remoteMe,
          name: localMe.name,
        },
      };
      FIREBASE.updatePlayers(localData.id, players);
    }
    // this.setState({ view: Views.Game, });
    // todo debug
    this.setState({ view: Views.Game, storage: BrowserStorage.get(), });
    FIREBASE.joinGame(localData.id, data => this.onReceive(data));
  }
  private onReceive(data: GameData) {
    console.log('received:', data);
    this.setState({
      data: {
        roles: [],
        turn: null,
        ...data,
        nominations: {
          roster: [],
          tally: {},
          ...data.nominations,
        },
        votes: {
          tally: {},
          ...data.votes,
        },
      }
    });
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
      view: this.state.view === Views.Reset ? Views.Reset : Views.Lobby,
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
    if (view === Views.Nominate && data) {
      return <ViewNominate isHost={isHost} data={data} storage={storage} />
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

    if (view === Views.Loading) {
      return (
        <h3>
          connecting to server, please wait...
        </h3>
      );
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

  Link: React.StatelessComponent<LinkProps> = (props) => {
    const { type } = props;
    const onClick = !!type ? () => this.setState({ view: type }) : () => { };
    return (
      <HeaderLink
        current={type === this.state.view}
        hasLink={!!type}
        onClick={onClick}
      >
        {props.children}
      </HeaderLink>
    );
  }

  render() {
    const { storage, data } = this.state;
    return (
      <div>
        <nav>
          <ul>
            {data && <this.Link type={Views.Game}>Game #{data.id}</this.Link>}
            {data && <this.Link type={Views.Nominate}>Nominate</this.Link>}
            {data && <this.Link type={Views.Vote}>Mission</this.Link>}
            {data && <this.Link type={Views.Setup}>Setup</this.Link>}
            {!data && <this.Link type={Views.Lobby}>Lobby</this.Link>}
            <this.Link type={Views.Reset}>Reset</this.Link>
            {isDebug && <this.Link type={Views.Debug}>Debug</this.Link>}
            <this.Link>
              <a target="_blank" href="rules.pdf">Rules</a>
            </this.Link>
            <this.Link>v.{APP_VERSION}</this.Link>
          </ul>
        </nav>

        {data && (
          <ViewBar data={data} storage={storage} />
        )}

        {this.renderMain()}

      </div>
    );
  }
}
