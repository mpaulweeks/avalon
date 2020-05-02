import React from "react";
import styled from "styled-components";
import { ViewDebug } from "./ViewDebug";
import { ViewMission } from "./ViewMission";
import { ViewLobby } from "./ViewLobby";
import { ViewReset } from "./ViewReset";
import { FIREBASE } from "../core/firebase";
import { GameData, PlayerData, UserState, ViewTabType, ViewTab } from "../core/types";
import { isDebug, getBoardFor, randomId, APP_VERSION } from "../core/utils";
import { STORAGE } from "../core/storage";
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
    & span {
      cursor: pointer;
      text-decoration: underline;
    }
  ` : ''}

  ${props => props.current ? `
    border-color: grey;
  ` : ''}

  &:first-child {
    margin-left: 0;
  }
`;

interface Props { }
interface State {
  storage: UserState;
  data?: GameData;
}

interface LinkProps {
  type?: ViewTab;
}

export class ViewHub extends React.Component<Props, State> {
  state: State = {
    storage: STORAGE.get(),
  };
  componentDidMount() {
    STORAGE.onSet = val => new Promise((resolve, reject) => {
      this.setState({ storage: val }, resolve);
    });
    const { storage } = this.state;
    if (storage.name && storage.game) {
      this.join(this.genGuestGameData());
    } else {
      STORAGE.setView(ViewTabType.Lobby);
    }
  }

  private genHostGameData(): GameData {
    const { id } = this.state.storage;
    return {
      ...this.genGuestGameData(),
      host: id,
    };
  }
  private genGuestGameData(): GameData {
    const { id, name, game } = this.state.storage;
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
    const { storage } = this.state;
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
      const myId = storage.id;
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
    if (storage.view === ViewTabType.Lobby) {
      STORAGE.setView(ViewTabType.Game);
    }
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

  async createGame() {
    await STORAGE.setGame(randomId(3));
    this.join(this.genHostGameData());
  }
  async joinGame(gameId: string) {
    await STORAGE.setGame(gameId);
    this.join(this.genGuestGameData());
  }
  reset() {
    const { storage } = this.state;
    if (storage.game) {
      FIREBASE.leaveGame(storage.game);
    }
    STORAGE.reset();
    this.setState({
      data: undefined,
    });
  }

  renderMain() {
    const { storage, data } = this.state;
    const { id, view } = storage;
    const isHost = !!data && id === data.host;
    if (view === ViewTabType.Game && data) {
      return <ViewGame isHost={isHost} data={data} storage={storage} />
    }
    if (view === ViewTabType.Setup && data) {
      return <ViewSetup isHost={isHost} data={data} storage={storage} />
    }
    if (view === ViewTabType.Nominate && data) {
      return <ViewNominate isHost={isHost} data={data} storage={storage} />
    }
    if (view === ViewTabType.Mission && data) {
      return <ViewMission isHost={isHost} data={data} storage={storage} />
    }

    if (view === ViewTabType.Lobby && !data) {
      return <ViewLobby
        storage={storage}
        createGame={() => this.createGame()}
        joinGame={id => this.joinGame(id)}
      />
    }

    if (view === ViewTabType.Reset) {
      return <ViewReset
        storage={storage}
        reset={() => this.reset()}
      />
    }
    if (view === ViewTabType.Debug) {
      return <ViewDebug />
    }

    if (view === ViewTabType.Loading) {
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
    const onClick = !!type ? () => STORAGE.setView(type) : () => { };
    return (
      <HeaderLink
        current={type === this.state.storage.view}
        hasLink={!!type}
        onClick={onClick}
      >
        <span>{props.children}</span>
      </HeaderLink>
    );
  }

  render() {
    const { storage, data } = this.state;
    return (
      <div>
        <nav>
          <ul>
            {data && <this.Link type={ViewTabType.Game}>Game #{data.id}</this.Link>}
            {data && <this.Link type={ViewTabType.Nominate}>Nominate</this.Link>}
            {data && <this.Link type={ViewTabType.Mission}>Mission</this.Link>}
            {data && <this.Link type={ViewTabType.Setup}>Setup</this.Link>}
            {!data && <this.Link type={ViewTabType.Lobby}>Lobby</this.Link>}
            <this.Link type={ViewTabType.Reset}>Reset</this.Link>
            {isDebug && <this.Link type={ViewTabType.Debug}>Debug</this.Link>}
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