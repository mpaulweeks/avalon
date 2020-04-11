import React from 'react';
import { BrowserStorage, UserState } from './Storage';
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
    const { id, turn } = this.props.data;
    if (!turn) { return; }
    const currentIndex = turn.order.indexOf(turn.current);
    const nextIndex = (currentIndex + 1) % turn.order.length;
    const newCurrent = turn.order[nextIndex];
    FIREBASE.updateTurn(id, {
      ...turn,
      current: newCurrent,
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

  render() {
    const { isHost, data } = this.props;
    const hostData = data.host && data.players[data.host];
    const hostName = hostData ? hostData.name : '???';

    const storage = BrowserStorage.get();
    const me = data.players[storage.id] || {
      name: storage.name,
    };

    const { board, turn } = data;

    return (
      <div>
        <h1>Game #{data.id}</h1>
        <div>i am: {me.name}</div>
        <div>host: {hostName}</div>
        <br />
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
              {m.neededFails > 1 && `${m.neededFails} fails needed`}
            </div>
          ))}
        </Board>

      </div>
    );
  }
}
