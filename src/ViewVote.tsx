import React from 'react';
import { BrowserStorage, UserState } from './Storage';
import { VoteType, GameData } from './types';
import { FIREBASE } from './firebase';
import { RoleData, Roles } from './Role';

interface Props {
  isHost: boolean;
  data: GameData;
  storage: UserState;
}
interface State { }

export class ViewVote extends React.Component<Props, State> {
  id = BrowserStorage.get().id;
  state: State = {};

  voteSuccess() {
    const newVotes = { ...this.props.data.votes, };
    newVotes.tally[this.id] = VoteType.Success;
    FIREBASE.updateVotes(this.props.data.id, newVotes);
  }
  voteFail() {
    const newVotes = { ...this.props.data.votes, };
    newVotes.tally[this.id] = VoteType.Fail;
    FIREBASE.updateVotes(this.props.data.id, newVotes);
  }
  voteClear() {
    const newVotes = { ...this.props.data.votes, };
    newVotes.tally = {};
    FIREBASE.updateVotes(this.props.data.id, newVotes);
  }
  toggleReveal() {
    const newVotes = { ...this.props.data.votes, };
    newVotes.showResults = !newVotes.showResults;
    FIREBASE.updateVotes(this.props.data.id, newVotes);
  }

  render() {
    const { isHost, storage, data } = this.props;
    const { votes } = data;
    const me = data.players[storage.id] || {
      name: storage.name,
    };
    const myData = RoleData[me.role || Roles.BasicBlue];
    const canThrowRed = myData.isRed || !me.role;
    return (
      <div>
        <h1>Vote</h1>

        {votes.tally[this.id] ? (
          <h3> you have voted </h3>
        ) : (
            <div>
              <button onClick={() => this.voteSuccess()}>vote SUCCESS</button>
              {canThrowRed && <button onClick={() => this.voteFail()}>vote FAIL</button>}
            </div>
          )}

        <hr />

        <div>
          <button onClick={() => this.voteClear()}>clear all votes</button>
        </div>

        {isHost && (
          <div>
            <hr />
            <div>
              admin controls: <button onClick={() => this.toggleReveal()}>{votes.showResults ? 'hide' : 'show'} votes</button>
            </div>
          </div>
        )}

        <h3>results!</h3>

        {votes.showResults && Object.keys(votes.tally).length ? (
          <div>
            {Object.values(votes.tally).map((vote, i) => (
              <div key={i}>
                {vote.toUpperCase()}
              </div>
            ))}
          </div>
        ) : (
            <p>
              {Object.keys(votes.tally).length} votes counted
            </p>
          )}
      </div>
    );
  }
}
