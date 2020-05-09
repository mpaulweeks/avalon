// enums

export type ViewTab = 'loading' | 'lobby' | 'game' | 'nominate' | 'mission' | 'lady' | 'setup' | 'reset' | 'debug';
export const ViewTabType = {
  Loading: 'loading' as ViewTab,
  Lobby: 'lobby' as ViewTab,
  Game: 'game' as ViewTab,
  Nominate: 'nominate' as ViewTab,
  Mission: 'mission' as ViewTab,
  Lady: 'lady' as ViewTab,
  Setup: 'setup' as ViewTab,
  Reset: 'reset' as ViewTab,
  Debug: 'debug' as ViewTab,
};

export type MissionVote = 'success' | 'fail';
export const MissionVoteType = {
  Success: 'success' as MissionVote,
  Fail: 'fail' as MissionVote,
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

export interface MissionBlueprint {
  result: MissionResult;
  required: number;
  neededFails: number;
  roster?: string[] | null;
}

export interface BoardData {
  missions: MissionBlueprint[];
  vetos: number;
}

export interface PlayerData {
  pid: string;
  name: string;
  role?: Role | null;
  hasLady: boolean;
  sawLady: string | null;
}

export interface PlayersById {
  [key: string]: PlayerData;
};

export interface TurnData {
  current: string;
  order: string[];
};

export interface NominationData {
  showResults: boolean;
  roster: string[];
  dealerLocked: boolean;
  tally: {
    [key: string]: Nomination;
  };
};

export interface MissionData {
  showResults: boolean;
  tally: {
    [key: string]: MissionVote;
  };
};

export interface GameData {
  gid: string;
  host?: string;
  board: BoardData;
  mission: MissionData;
  nominations: NominationData;
  players: PlayersById;
  roles: Role[];
  turn: TurnData | null;
  vetoes: number;
  includeLady: boolean;
  reveal: boolean;
}

export interface UserState {
  v: string;
  pid: string;
  name?: string;
  gid?: string;
  view: ViewTab;
}
