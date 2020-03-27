import React from 'react';
import { WebSocketView, StateBase } from './WebSocketView';
import { BrowserStorage } from './Storage';

interface Data {
  showResults: boolean;
  votes: {
    [key: string]: string,
  };
}
interface Props { }
interface State extends StateBase<Data> { }

export class ViewVote extends WebSocketView<Props, State, Data> {
  state: State = {
    data: {
      showResults: false,
      votes: {},
    },
  };
  path() {
    return `vote/${BrowserStorage.get().game || 0}`;
  }

  voteSuccess() {
    const newData = { ...this.state.data, };
    newData.votes[this.id] = 'success';
    this.message(newData);
  }
  voteFail() {
    const newData = { ...this.state.data, };
    newData.votes[this.id] = 'fail';
    this.message(newData);
  }
  voteClear() {
    const newData = { ...this.state.data, };
    newData.votes = {};
    this.message(newData);
  }
  toggleReveal() {
    const newData = { ...this.state.data, };
    newData.showResults = !newData.showResults;
    this.message(newData);
  }

  render() {
    const { data } = this.state;

    if (!BrowserStorage.get().game) {
      return <h3>you must be in a game to vote</h3>;
    }
    return (
      <div>
        <h1>Vote</h1>

        {data.votes[this.id] ? (
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

        {data.showResults && Object.keys(data.votes).length ? (
          <div>
            {Object.keys(data.votes).map(key => (
              <div key={key}>
                {key}: {data.votes[key]}
              </div>
            ))}
          </div>
        ) : (
            <p>
              {Object.keys(data.votes).length} votes counted
            </p>
          )}
      </div>
    );
  }
}
