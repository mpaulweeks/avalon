// enums

export type ViewTab = 'loading' | 'lobby' | 'game' | 'nominate' | 'mission' | 'setup' | 'reset' | 'debug';
export const ViewTabType = {
  Loading: 'loading' as ViewTab,
  Lobby: 'lobby' as ViewTab,
  Game: 'game' as ViewTab,
  Nominate: 'nominate' as ViewTab,
  Mission: 'mission' as ViewTab,
  Setup: 'setup' as ViewTab,
  Reset: 'reset' as ViewTab,
  Debug: 'debug' as ViewTab,
};

export type Vote = 'success' | 'fail';
export const VoteType = {
  Success: 'success' as Vote,
  Fail: 'fail' as Vote,
};

export type Nomination = 'approve' | 'reject';
export const NominationType = {
  Approve: 'approve' as Nomination,
  Reject: 'reject' as Nomination,
};

export type MissionResult = 'blue' | 'red' | 'neutral';
export const MissionResultType = {
  Blue: 'blue victory' as MissionResult,
  Red: 'red victory' as MissionResult,
  Neutral: 'neutral' as MissionResult,
};
export const MissionResults = Object.values(MissionResultType);

export const Roles = [
  'BasicBlue',
  'Merlin',
  'Percival',
  'BasicRed',
  'Assassin',
  'Mordred',
  'Morgana',
  'Oberon',
] as const;
export type Role = typeof Roles[number];
export const RoleType = Roles.reduce((obj, r) => {
  obj[r] = r;
  return obj;
}, {} as { [key in typeof Roles[number]]: Role });

// interfaces

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
    role?: Role | null;
  }
};

export interface TurnData {
  current: string;
  order: string[];
};

export interface NominationData {
  showResults: boolean;
  roster: string[];
  tally: {
    [key: string]: Nomination;
  };
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
  roles: Role[];
  turn: TurnData | null;
  vetoes: number;
  votes: VoteData;
}

export interface UserState {
  v: string;
  id: string;
  name?: string;
  game?: string;
  view: ViewTab;
}