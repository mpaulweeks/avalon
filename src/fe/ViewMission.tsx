import React from 'react';
import { MissionVoteType, GameData, UserState, RoleType } from '../core/types';
import { FIREBASE } from '../core/firebase';
import { AllRoles } from '../core/role';
import { HostBox, Green, Red } from './shared';
import { getCurrentPlayers } from '../core/utils';

interface Props {
  isHost: boolean;
  data: GameData;
  storage: UserState;
}
interface State { }

export class ViewMission extends React.Component<Props, State> {
  pid = this.props.storage.pid;
  state: State = {};

  getMyRole() {
    const { storage, data } = this.props;
    const me = data.players[storage.pid] || {
      name: storage.name,
    };
    return AllRoles[me.role || RoleType.BasicBlue];
  }

  async voteSuccess() {
    await FIREBASE.updateMissionTally(this.props.data.gid, this.pid, MissionVoteType.Success);
  }
  async voteFail() {
    await FIREBASE.updateMissionTally(this.props.data.gid, this.pid, MissionVoteType.Fail);
  }
  async voteClear() {
    const newVotes = { ...this.props.data.mission, };
    newVotes.tally = {};
    newVotes.showResults = false;
    await FIREBASE.updateMission(this.props.data.gid, newVotes);
  }
  async toggleReveal() {
    const newVotes = { ...this.props.data.mission, };
    newVotes.showResults = !newVotes.showResults;
    await FIREBASE.updateMission(this.props.data.gid, newVotes);
  }

  render() {
    const { isHost, data } = this.props;
    const { nominations, mission } = data;
    const isNom = nominations.roster.includes(this.pid);

    const sortedPlayers = getCurrentPlayers(data);
    const pendingTally = sortedPlayers.filter(p => nominations.roster.includes(p.pid) && !mission.tally[p.pid]);

    return (
      <div>
        <h1>Mission Vote</h1>

        {isNom ? (
          <div>
            <h3> cast your mission vote </h3>
            {mission.tally[this.pid] ? (
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
        {mission.showResults && Object.keys(mission.tally).length ? (
          <div>
            {Object.values(mission.tally).sort().reverse().map((vote, i) => (
              <div key={i}>
                {vote === MissionVoteType.Success ? (
                  <Green>{vote.toUpperCase()}</Green>
                ) : (
                    <Red>{vote.toUpperCase()}</Red>
                  )}
              </div>
            ))}
          </div>
        ) : (
            <div>
              {Object.keys(mission.tally).length}/{nominations.roster.length} votes counted
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

        {isHost && (
          <HostBox>
            <button onClick={() => this.toggleReveal()}>{mission.showResults ? 'hide' : 'show'} votes</button>
            <button onClick={() => this.voteClear()}>clear all votes</button>
          </HostBox>
        )}
      </div>
    );
  }
}
