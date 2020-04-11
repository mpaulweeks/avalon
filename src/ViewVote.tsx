import React from 'react';
import { BrowserStorage } from './Storage';
import { VoteType, Vote } from './types';
import { FIREBASE } from './firebase';

interface Props { }
interface State {
  data: {
    showResults: boolean;
    tally: {
      [key: string]: Vote,
    };
  };
}

export class ViewVote extends React.Component<Props, State> {
  id = BrowserStorage.get().id;
  game = BrowserStorage.get().game || '???';
  state: State = {
    data: {
      showResults: false,
      tally: {},
    },
  };

  voteSuccess() {
    const newData = { ...this.state.data, };
    newData.tally[this.id] = VoteType.Success;
    FIREBASE.updateVotes(this.game, newData);
  }
  voteFail() {
    const newData = { ...this.state.data, };
    newData.tally[this.id] = VoteType.Fail;
    FIREBASE.updateVotes(this.game, newData);
  }
  voteClear() {
    const newData = { ...this.state.data, };
    newData.tally = {};
    FIREBASE.updateVotes(this.game, newData);
  }
  toggleReveal() {
    const newData = { ...this.state.data, };
    newData.showResults = !newData.showResults;
    FIREBASE.updateVotes(this.game, newData);
  }

  render() {
    const { data } = this.state;

    if (!BrowserStorage.get().game) {
      return <h3>you must be in a game to vote</h3>;
    }
    return (
      <div>
        <h1>Vote</h1>

        {data.tally[this.id] ? (
          <h3> you have voted </h3>
        ) : (
            <div>
              <button onClick={() => this.voteSuccess()}>vote SUCCESS</button>
              <button onClick={() => this.voteFail()}>vote FAIL</button>
            </div>
          )}

        <hr />

        <div>
          <button onClick={() => this.voteClear()}>clear all votes</button>
          <button onClick={() => this.toggleReveal()}>{data.showResults ? 'hide' : 'show'} votes</button>
        </div>

        <hr />

        <h3>results!</h3>

        {data.showResults && Object.keys(data.tally).length ? (
          <div>
            {Object.keys(data.tally).map(key => (
              <div key={key}>
                {key}: {data.tally[key]}
              </div>
            ))}
          </div>
        ) : (
            <p>
              {Object.keys(data.tally).length} votes counted
            </p>
          )}
      </div>
    );
  }
}
