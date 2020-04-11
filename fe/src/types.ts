import { RoleType } from "./Role";

export interface GameData {
  id: string;
  host?: string;
  roles: string[];
  players: {
    [key: string]: {
      id: string;
      name: string;
      role?: RoleType;
    };
  };
}
