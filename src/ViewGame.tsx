import React from 'react';
import { BrowserStorage, UserState } from './Storage';
import { GameData } from './types';
import { FIREBASE } from './firebase';
import { HostBox, Flex, MissionIcon } from './shared';

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
    FIREBASE.updateTurnOrder(id, {
      ...turn,
      current: newCurrent,
    });
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
        <br/>
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

        <Flex>
          {board.missions.map(m => (
            <div>
              <MissionIcon result={m.result}>
                {m.required}
              </MissionIcon>
              {m.neededFails > 1 && `${m.neededFails} fails needed`}
            </div>
          ))}
        </Flex>

      </div>
    );
  }
}
