import React from 'react';
import { BrowserStorage, UserState } from './Storage';
import { GameData, NominationType, shuffle } from './types';
import { FIREBASE } from './firebase';
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
    newVotes.tally[this.id] = NominationType.Approve;
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

  addToRoster(pid: string) {
    const { nominations } = this.props.data;
    const newRoster = [...nominations.roster];
    newRoster.push(pid);
    newRoster.sort();
    FIREBASE.updateNominations(this.props.data.id, {
      ...nominations,
      roster: newRoster,
    });
  }
  removeFromRoster(pid: string) {
    const { nominations } = this.props.data;
    const newRoster = [...nominations.roster];
    const index = newRoster.findIndex(p => p === pid);
    if (index >= 0) {
      newRoster.splice(index, 1);
      FIREBASE.updateNominations(this.props.data.id, {
        ...nominations,
        roster: newRoster,
      });
    }
  }

  render() {
    const { isHost, data } = this.props;
    const { nominations, players } = data;
    const isDealer = data.turn && data.turn.current === this.id;
    const outOfRoster = Object.keys(players).filter(pid => !nominations.roster.includes(pid));
    outOfRoster.sort();
    const shuffledTally = shuffle(Object.keys(nominations.tally));
    return (
      <div>
        <h1>Nominate for Mission</h1>

        <h3>Nominated:</h3>
        <div>
          {nominations.roster.length ? (
            isDealer ? nominations.roster.map((pid, i) => (
              <button key={i} onClick={() => this.removeFromRoster(pid)}>
                {players[pid].name}
              </button>
            )) : (
                nominations.roster.map(pid => players[pid].name).join(', ')
              )
          ) : (
              'nobody has been nominated yet'
            )}
        </div>

        {isDealer && outOfRoster.length > 0 && (
          <div>
            <h3>Eligible:</h3>
            <div>
              {outOfRoster.map((pid, i) => (
                <button key={i} onClick={() => this.addToRoster(pid)}>
                  {players[pid].name}
                </button>
              ))}
            </div>
          </div>
        )}

        <hr />

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
