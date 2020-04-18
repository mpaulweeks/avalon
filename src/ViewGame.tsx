import React from 'react';
import { UserState } from './Storage';
import { GameData, MissionResults } from './types';
import { FIREBASE } from './firebase';
import { HostBox, Board, MissionIcon } from './shared';

interface Props {
  data: GameData;
  isHost: boolean;
  storage: UserState;
}
interface State { }

export class ViewGame extends React.Component<Props, State> {
  nextTurn() {
    const { id, turn, nominations, votes } = this.props.data;
    if (!turn) { return; }
    const currentIndex = turn.order.indexOf(turn.current);
    const nextIndex = (currentIndex + 1) % turn.order.length;
    const newCurrent = turn.order[nextIndex];
    FIREBASE.updateTurn(id, {
      ...turn,
      current: newCurrent,
    });
    FIREBASE.updateNominations(id, {
      ...nominations,
      showResults: false,
      tally: {},
    });
    FIREBASE.updateVotes(id, {
      ...votes,
      showResults: false,
      tally: {},
    });
  }
  missionChange(mIndex: number) {
    const { isHost, data } = this.props;
    if (!isHost) { return; }
    const { id, board } = data;
    const mission = board.missions[mIndex];
    const currIndex = MissionResults.indexOf(mission.result);
    const nextIndex = (currIndex + 1) % MissionResults.length;
    const nextState = MissionResults[nextIndex];
    mission.result = nextState;
    FIREBASE.updateBoard(id, board);
  }

  setMissionNoms(mIndex: number) {
    const { isHost, data } = this.props;
    if (!isHost) { return; }
    const { id, board } = data;
    const mission = board.missions[mIndex];
    mission.roster = data.nominations.roster;
    FIREBASE.updateBoard(id, board);
  }
  clearMissionNoms(mIndex: number) {
    const { isHost, data } = this.props;
    if (!isHost) { return; }
    const { id, board } = data;
    const mission = board.missions[mIndex];
    mission.roster = null;
    FIREBASE.updateBoard(id, board);
  }
  addVeto(delta: number) {
    const { isHost, data } = this.props;
    if (!isHost) { return; }
    const { id, vetoes } = data;
    FIREBASE.updateVetoes(id, vetoes + delta);
  }

  render() {
    const { isHost, data } = this.props;
    const { board, turn, players, vetoes } = data;

    return (
      <div>
        <h1>Game #{data.id}</h1>
        {turn && (
          <div>
            {isHost && (
              <HostBox>
                <button onClick={() => this.nextTurn()}>
                  Next Turn
                </button>
              </HostBox>
            )}
          </div>
        )}

        <Board>
          {board.missions.map((m, index) => (
            <div key={index}>
              <MissionIcon result={m.result} onClick={() => this.missionChange(index)}>
                {m.required}
              </MissionIcon>
              {m.neededFails > 1 ? (
                <div>
                  {m.neededFails} fails needed
                </div>
              ) : <br />}
              {m.roster && m.roster.map(pid => (
                <div key={pid}>
                  {players[pid].name}
                </div>
              ))}
              {isHost && (
                <HostBox>
                  {m.roster ? (
                    <button onClick={() => this.clearMissionNoms(index)}>
                      remove<br />noms
                    </button>
                  ) : (
                      <button onClick={() => this.setMissionNoms(index)}>
                        set<br />noms
                      </button>
                    )}
                </HostBox>
              )}
            </div>
          ))}
        </Board>
        <div>
          Missions are played left to right. The number is how many people are required for each mission.
          <br />
          It only takes 1 FAIL to win the mission for Red. First team to 3 missions wins.
        </div>

        <h3>
          Vetoes: {vetoes}/4
        </h3>
        <div>
          When the number of vetoes reaches 4, the nomination automatically goes to mission without a group vote.
        </div>

        {isHost && (
          <HostBox>
            <button onClick={() => this.addVeto(1)}>+</button>
            <button onClick={() => this.addVeto(-1)}>-</button>
          </HostBox>
        )}

      </div>
    );
  }
}
