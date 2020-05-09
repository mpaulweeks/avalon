import React from 'react';
import makeTrashable, { TrashablePromise } from 'trashable';
import { GameData } from '../core/types';
import { FIREBASE } from '../core/firebase';

interface Props { }
interface State {
  games: GameData[];
}

export class ViewDebug extends React.Component<Props, State> {
  state: State = {
    games: [],
  };
  promise?: TrashablePromise<GameData[]>;

  componentDidMount() {
    this.promise = makeTrashable(FIREBASE.getAllGames());
    this.promise.then(games => this.setState({ games, }));
  }
  componentWillUnmount() {
    if (this.promise) {
      this.promise.trash();
    }
  }
  render() {
    const { games } = this.state;
    return (
      <div>
        <h1>Debugging Health Info</h1>
        <p>
          <a href="https://mpaulweeks.github.io/avalon/">mpaulweeks.github.io/avalon</a>
        </p>
        <h3>games</h3>
        {games.map(game => (
          <div key={game.gid}>
            {game.gid}
            {Object.values(game.players).map((p, pi) => (
              <span key={pi + '-' + p.pid} onClick={() => FIREBASE.kickPlayer(game, p.pid)}>
                &nbsp;/ {p.name}
              </span>
            ))}
          </div>
        ))}
        <br />
        <button onClick={() => FIREBASE.deleteAllGames()}> delete all </button>
      </div>
    );
  }
}
