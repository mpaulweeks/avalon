import { RoleType } from "./Role";

export const Version = '1.0.2';

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
  votes: VoteData;
}

export const isDev = window.location.href.includes('localhost');
export const isDebug = window.location.href.includes('#d');

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
export function shuffle<T>(orig: T[]): T[] {
  const array = orig.concat();
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

export function getBoardFor(count: number) {
  let missions = [ // === 5
    { required: 2, neededFails: 1, result: MissionResultType.Neutral },
    { required: 3, neededFails: 1, result: MissionResultType.Neutral },
    { required: 2, neededFails: 1, result: MissionResultType.Neutral },
    { required: 3, neededFails: 1, result: MissionResultType.Neutral },
    { required: 3, neededFails: 1, result: MissionResultType.Neutral },
  ];
  if (count === 6) {
    missions = [
      { required: 2, neededFails: 1, result: MissionResultType.Neutral },
      { required: 3, neededFails: 1, result: MissionResultType.Neutral },
      { required: 4, neededFails: 1, result: MissionResultType.Neutral },
      { required: 3, neededFails: 1, result: MissionResultType.Neutral },
      { required: 4, neededFails: 1, result: MissionResultType.Neutral },
    ];
  }
  if (count === 7) {
    missions = [
      { required: 2, neededFails: 1, result: MissionResultType.Neutral },
      { required: 3, neededFails: 1, result: MissionResultType.Neutral },
      { required: 3, neededFails: 1, result: MissionResultType.Neutral },
      { required: 4, neededFails: 2, result: MissionResultType.Neutral },
      { required: 4, neededFails: 1, result: MissionResultType.Neutral },
    ];
  }
  if (count >= 8) {
    missions = [
      { required: 3, neededFails: 1, result: MissionResultType.Neutral },
      { required: 4, neededFails: 1, result: MissionResultType.Neutral },
      { required: 4, neededFails: 1, result: MissionResultType.Neutral },
      { required: 5, neededFails: 2, result: MissionResultType.Neutral },
      { required: 5, neededFails: 1, result: MissionResultType.Neutral },
    ];
  }
  return {
    vetos: 0,
    missions: missions,
  };
}
