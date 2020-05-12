import React from 'react';
import { ViewNominate } from './ViewNominate';
import { ViewMission } from './ViewMission';
import { ViewBoard } from './ViewBoard';
import { GameData, UserState } from '../core/types';

interface Props {
  data: GameData;
  isHost: boolean;
  storage: UserState;
}

export const ViewAll = (props: Props) => (
  <div>
    <ViewBoard {...props} />
    <ViewNominate {...props} />
    <ViewMission {...props} />
  </div>
);
