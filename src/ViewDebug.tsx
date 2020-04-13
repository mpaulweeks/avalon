import React from 'react';
import { GameData } from './types';
import { FIREBASE } from './firebase';

interface Props {}
interface State {
  games: GameData[];
}

export class ViewDebug extends React.Component<Props, State> {
  state: State = {
    games: [],
  };

  componentDidMount() {
    FIREBASE.getAllGames().then(games => this.setState({ games: games, }));
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
          <div key={game.id}>
            {game.id}
            {Object.values(game.players).map(p => (
              <span key={p.id} onClick={() => FIREBASE.kickPlayer(game, p.id)}>
                &nbsp;/ {p.name}
              </span>
            ))}
          </div>
        ))}
        <br/>
        <button onClick={() => FIREBASE.deleteAllGames()}> delete all </button>
      </div>
    );
  }
}
