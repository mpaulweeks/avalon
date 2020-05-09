import React from 'react';
import { MissionVoteType, GameData, UserState, RoleType } from '../core/types';
import { FIREBASE } from '../core/firebase';
import { AllRoles } from '../core/role';
import { HostBox, Green, Red, Blue } from './shared';
import { sortObjVals } from '../core/utils';

interface Props {
  isHost: boolean;
  data: GameData;
  storage: UserState;
}
interface State { }

export class ViewLady extends React.Component<Props, State> {
  pid = this.props.storage.pid;
  state: State = {};

  async examine(sawPid: string) {
    const { pid } = this;
    const { gid } = this.props.data;
    await FIREBASE.giveLadyTo(gid, sawPid);
    await FIREBASE.takeLadyFrom(gid, pid);
    await FIREBASE.ladySaw(gid, pid, sawPid);
  }

  render() {
    const { data } = this.props;
    const { players, includeLady } = data;

    const myPlayer = players[this.pid];
    const examinedPlayer = myPlayer.sawLady && players[myPlayer.sawLady];
    const examinedRole = examinedPlayer && examinedPlayer.role && AllRoles[examinedPlayer.role];
    const ExaminedColor = examinedRole && examinedRole.isRed ? Red : Blue;

    const currentPlayer = Object.values(players).filter(p => p.hasLady)[0];
    const currentName = currentPlayer && currentPlayer.name;
    const previousOwners = Object.values(players).filter(p => !!p.sawLady);
    const eligible = Object.values(players).filter(p => p.pid !== this.pid && !p.sawLady);

    return (
      <div>
        <h1>Lady of the Lake</h1>

        <p>
          At the beginning of the game, the Lady of the Lake (aka Lady) is given to the last player in the turn order.
        </p>
        <p>
          After the 2nd, 3rd, and 4th mission in finished, the player with the Lady will choose one player to examine.
        </p>
        <p>
          They will learn the team color (Red/Blue) of the chosen player. They will NOT learn their identity (eg: Merlin).
        </p>
        <p>
          After this information is revealed, the Lady will transfer to the examined player, so that they may use it after the next mission.
        </p>
        <p>
          A player that used the Lady cannot have the Lady used on them.
        </p>

        {(includeLady && currentPlayer) ? (
          <div>
            <h3>{currentName} has the Lady of the Lake</h3>
            {previousOwners.length > 0 && (
              <div>
                Previous Lady holders: {previousOwners.map(p => p.name).join(', ')}
              </div>
            )}
            {currentPlayer.pid === this.pid && (
              <div>
                <p>
                  <u>
                    Choose a player to examine:
                  </u>
                </p>
                <div>
                  {eligible.map(p => (
                    <button
                      key={p.pid}
                      onClick={() => this.examine(p.pid)}>
                        {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {(examinedPlayer && examinedRole) && (
              <h3>
                You examined {examinedPlayer.name} and saw <ExaminedColor>{examinedRole.isRed ? 'RED' : 'BLUE'}</ExaminedColor>
              </h3>
            )}
          </div>
        ) : (
          <h3>
            <Red>
              Lady of the Lady is not enabled for this game
            </Red>
          </h3>
        )}
      </div>
    )
  }
}
