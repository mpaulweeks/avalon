import { RoleType } from "./Role";

export interface PlayerData {
  [key: string]: {
    id: string;
    name: string;
    role?: RoleType | null;
  }
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
  roles: RoleType[];
  players: PlayerData;
  votes: VoteData;
}
