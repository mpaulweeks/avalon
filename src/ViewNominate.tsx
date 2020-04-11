import React from 'react';
import { BrowserStorage, UserState } from './Storage';
import { VoteType, GameData, NominationType, shuffle } from './types';
import { FIREBASE } from './firebase';
import { RoleData, Roles } from './Role';
import { HostBox } from './shared';

interface Props {
  isHost: boolean;
  data: GameData;
  storage: UserState;
}
interface State { }

export class ViewNominate extends React.Component<Props, State> {
  id = BrowserStorage.get().id;
  state: State = {};

  voteSuccess() {
    const newVotes = { ...this.props.data.nominations, };
    newVotes.tally[this.id] = NominationType.Support;
    FIREBASE.updateNominations(this.props.data.id, newVotes);
  }
  voteFail() {
    const newVotes = { ...this.props.data.nominations, };
    newVotes.tally[this.id] = NominationType.Reject;
    FIREBASE.updateNominations(this.props.data.id, newVotes);
  }
  voteClear() {
    const newVotes = { ...this.props.data.nominations, };
    newVotes.tally = {};
    FIREBASE.updateNominations(this.props.data.id, newVotes);
  }
  toggleReveal() {
    const newVotes = { ...this.props.data.nominations, };
    newVotes.showResults = !newVotes.showResults;
    FIREBASE.updateNominations(this.props.data.id, newVotes);
  }

  render() {
    const { isHost, storage, data } = this.props;
    const { nominations } = data;
    const shuffledTally = shuffle(Object.keys(nominations.tally));
    return (
      <div>
        <h1>Nominate for Mission</h1>

        {nominations.tally[this.id] && (
          <h3> you have voted </h3>
        )}
        <div>
          <button onClick={() => this.voteSuccess()}>vote SUPPORT</button>
          <button onClick={() => this.voteFail()}>vote REJECT</button>
        </div>

        {isHost && (
          <HostBox>
            <button onClick={() => this.toggleReveal()}>{nominations.showResults ? 'hide' : 'show'} votes</button>
            <button onClick={() => this.voteClear()}>clear all votes</button>
          </HostBox>
        )}

        <h3>results!</h3>

        {nominations.showResults && Object.keys(nominations.tally).length ? (
          <div>
            {shuffledTally.map((pid, i) => (
              <div key={i}>
                {data.players[pid].name}: {nominations.tally[pid].toUpperCase()}
              </div>
            ))}
          </div>
        ) : (
            <p>
              {Object.keys(nominations.tally).length} votes counted
            </p>
          )}
      </div>
    );
  }
}
