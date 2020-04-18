import { RoleType } from "./Role";

export type MissionResult = 'blue' | 'red' | 'neutral';
export const MissionResultType = {
  Blue: 'blue victory' as MissionResult,
  Red: 'red victory' as MissionResult,
  Neutral: 'neutral' as MissionResult,
};
export const MissionResults = Object.values(MissionResultType);

export interface MissionData {
  result: MissionResult;
  required: number;
  neededFails: number;
  roster?: string[] | null;
}

export interface BoardData {
  missions: MissionData[];
  vetos: number;
}

export interface PlayerData {
  [key: string]: {
    id: string;
    name: string;
    role?: RoleType | null;
  }
};

export interface TurnData {
  current: string;
  order: string[];
};

export type Nomination = 'approve' | 'reject';
export const NominationType = {
  Approve: 'approve' as Nomination,
  Reject: 'reject' as Nomination,
};

export interface NominationData {
  showResults: boolean;
  roster: string[];
  tally: {
    [key: string]: Nomination;
  };
};

export type Vote = 'success' | 'fail';
export const VoteType = {
  Success: 'success' as Vote,
  Fail: 'fail' as Vote,
};

export interface VoteData {
  showResults: boolean;
  tally: {
    [key: string]: Vote;
  };
};

export interface GameData {
  id: string;
  host?: string;
  board: BoardData;
  nominations: NominationData;
  players: PlayerData;
  roles: RoleType[];
  turn: TurnData | null;
  vetoes: number;
  votes: VoteData;
}
