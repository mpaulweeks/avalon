import React from 'react';
import { BrowserStorage, UserState } from './Storage';
import { VoteType, GameData } from './types';
import { FIREBASE } from './firebase';
import { RoleData, Roles } from './Role';
import { HostBox, Green, Red } from './shared';

interface Props {
  isHost: boolean;
  data: GameData;
  storage: UserState;
}
interface State { }

export class ViewVote extends React.Component<Props, State> {
  id = BrowserStorage.get().id;
  state: State = {};

  getMyRole() {
    const { storage, data } = this.props;
    const me = data.players[storage.id] || {
      name: storage.name,
    };
    return RoleData[me.role || Roles.BasicBlue];
  }

  voteSuccess() {
    const newVotes = { ...this.props.data.votes, };
    newVotes.tally[this.id] = VoteType.Success;
    FIREBASE.updateVotes(this.props.data.id, newVotes);
  }
  voteFail() {
    if (!this.getMyRole().isRed) {
      alert('only red players can vote fail!');
      return;
    }
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
    const { isHost, data } = this.props;
    const { nominations, votes } = data;
    const isNom = nominations.roster.includes(this.id);
    return (
      <div>
        <h1>Mission Vote</h1>

        {isNom ? (
          <div>
            <h3> cast your mission vote </h3>
            {votes.tally[this.id] ? (
              <div> you have voted </div>
            ) : (
                <div>
                  <button onClick={() => this.voteSuccess()}>vote SUCCESS</button>
                  <button onClick={() => this.voteFail()}>vote FAIL</button>
                </div>
              )}
          </div>
        ) : (
            <div>
              only nominated players can vote during the mission
            </div>
          )}

        <h3>results!</h3>
        {votes.showResults && Object.keys(votes.tally).length ? (
          <div>
            {Object.values(votes.tally).sort().reverse().map((vote, i) => (
              <div key={i}>
                {vote === VoteType.Success ? (
                  <Green>{vote.toUpperCase()}</Green>
                ) : (
                    <Red>{vote.toUpperCase()}</Red>
                  )}
              </div>
            ))}
          </div>
        ) : (
            <p>
              {Object.keys(votes.tally).length}/{nominations.roster.length} votes counted
            </p>
          )}

        {isHost && (
          <HostBox>
            <button onClick={() => this.toggleReveal()}>{votes.showResults ? 'hide' : 'show'} votes</button>
            <button onClick={() => this.voteClear()}>clear all votes</button>
          </HostBox>
        )}
      </div>
    );
  }
}
