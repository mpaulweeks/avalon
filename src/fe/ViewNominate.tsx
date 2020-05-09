import React from 'react';
import { GameData, NominationType, MissionResultType, UserState } from '../core/types';
import { FIREBASE } from '../core/firebase';
import { HostBox, Green, Red } from './shared';
import { getCurrentPlayers } from '../core/utils';

interface Props {
  isHost: boolean;
  data: GameData;
  storage: UserState;
}
interface State { }

export class ViewNominate extends React.Component<Props, State> {
  pid = this.props.storage.pid;
  state: State = {};

  async voteSuccess() {
    await FIREBASE.updateNominationsTally(this.props.data.gid, this.pid, NominationType.Approve);
  }
  async voteFail() {
    await FIREBASE.updateNominationsTally(this.props.data.gid, this.pid, NominationType.Reject);
  }
  async voteClear() {
    const newVotes = { ...this.props.data.nominations, };
    newVotes.tally = {};
    newVotes.showResults = false;
    newVotes.dealerLocked = false;
    await FIREBASE.updateNominations(this.props.data.gid, newVotes);
  }
  async toggleReveal() {
    const newVotes = { ...this.props.data.nominations, };
    newVotes.showResults = !newVotes.showResults;
    await FIREBASE.updateNominations(this.props.data.gid, newVotes);
  }
  async lockTheNoms() {
    const isDealer = this.getIsDealer();
    if (!isDealer) {
      return alert('only the dealer should be able to lock the nom! error!');
    }
    const newVotes = { ...this.props.data.nominations, };
    newVotes.dealerLocked = true;
    await FIREBASE.updateNominations(this.props.data.gid, newVotes);
  }

  async getIsDealer() {
    const { data } = this.props;
    const { nominations } = data;
    return data.turn && (data.turn.current === this.pid) && !nominations.showResults;
  }

  async addToRoster(pid: string) {
    const { nominations } = this.props.data;
    const newRoster = [...nominations.roster];
    newRoster.push(pid);
    newRoster.sort();
    await FIREBASE.updateNominations(this.props.data.gid, {
      ...nominations,
      roster: newRoster,
    });
  }
  async removeFromRoster(pid: string) {
    const { nominations } = this.props.data;
    const newRoster = [...nominations.roster];
    const index = newRoster.findIndex(p => p === pid);
    if (index >= 0) {
      newRoster.splice(index, 1);
      await FIREBASE.updateNominations(this.props.data.gid, {
        ...nominations,
        roster: newRoster,
      });
    }
  }

  render() {
    const { isHost, data } = this.props;
    const { nominations, players } = data;
    const isDealer = this.getIsDealer();
    const sortedPlayers = getCurrentPlayers(data);
    const outOfRoster = sortedPlayers.filter(p => !nominations.roster.includes(p.pid));
    const sortedTally = Object.keys(nominations.tally).sort();
    const pendingTally = sortedPlayers.filter(p => !nominations.tally[p.pid]);

    const currentMission = data.board.missions.filter(m => m.result === MissionResultType.Neutral)[0];
    const currentNeeded = currentMission ? currentMission.required : '???';

    return (
      <div>
        <h1>Nominate for Mission</h1>

        <div>This mission requires {currentNeeded} people.</div>

        <h3>Nominated:</h3>
        <div>
          {nominations.roster.length ? (
            (isDealer && !nominations.dealerLocked) ? nominations.roster.map((pid, i) => (
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

        {isDealer && (
          nominations.dealerLocked ? (
            <div>
              <br />
              <button onClick={() => this.voteClear()}>Clear votes and change the nomination</button>
            </div>
          ) : (
              <div>
                <h3>Add to Nomination:</h3>
                <div>
                  {outOfRoster.length > 0 ? (
                    outOfRoster.map((p, i) => (
                      <button key={i} onClick={() => this.addToRoster(p.pid)}>
                        {p.name}
                      </button>
                    ))
                  ) : (
                      'everyone has been nominated'
                    )}
                </div>
              </div>
            ))}

        {!nominations.dealerLocked ? (
          <div>
            <h3>
              waiting for nomination to be locked in...
            </h3>
            {isDealer && (
              <div>
                <button onClick={() => this.lockTheNoms()}>Lock and start voting</button>
              </div>
            )}
          </div>
        ) : (
            <div>
              <h3>cast your vote for who goes on the mission</h3>

              {nominations.tally[this.pid] && (
                <div>
                  you have voted
                </div>
              )}
              {!nominations.showResults && (
                <div>
                  <button onClick={() => this.voteSuccess()}>vote SUPPORT</button>
                  <button onClick={() => this.voteFail()}>vote REJECT</button>
                </div>
              )}

              {isHost && (
                <HostBox>
                  <button onClick={() => this.toggleReveal()}>{nominations.showResults ? 'hide' : 'show'} votes</button>
                  <button onClick={() => this.voteClear()}>clear all votes</button>
                </HostBox>
              )}

              <h3>results!</h3>

              {nominations.showResults && Object.keys(nominations.tally).length ? (
                <div>
                  {sortedTally.map((pid, i) => (
                    <div key={i}>
                      {data.players[pid].name}:&nbsp;
                      {nominations.tally[pid] === NominationType.Approve ? (
                        <Green>{nominations.tally[pid].toUpperCase()}</Green>
                      ) : (
                          <Red>{nominations.tally[pid].toUpperCase()}</Red>
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                  <div>
                    {Object.keys(nominations.tally).length}/{sortedPlayers.length} votes counted
                    {pendingTally.length ? (
                      <div>
                        <br />
                    waiting for:
                        {pendingTally.map(p => (
                          <div key={p.pid}>{p.name}</div>
                        ))}
                      </div>
                    ) : ''}
                  </div>
                )}
            </div>
          )}
      </div>
    );
  }
}
