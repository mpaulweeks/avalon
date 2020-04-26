import { Role, Roles, RoleType } from './types';

export interface RoleData {
  isRed: boolean;
  name: string;
  sees: Role[];
};

const reds = [RoleType.BasicRed, RoleType.Assassin, RoleType.Morgana, RoleType.Mordred, RoleType.Oberon];
const redsMinusMordred = reds.filter(r => r !== RoleType.Mordred);
const redsMinusOberon = reds.filter(r => r !== RoleType.Oberon);

export const AllRoles: { [key in typeof Roles[number]]: RoleData } = {
  BasicBlue: {
    isRed: false,
    name: 'Basic Blue',
    sees: [],
  },
  Merlin: {
    isRed: false,
    name: 'Merlin',
    sees: redsMinusMordred,
  },
  Percival: {
    isRed: false,
    name: 'Percival',
    sees: [RoleType.Merlin, RoleType.Morgana],
  },
  BasicRed: {
    isRed: true,
    name: 'Basic Red',
    sees: redsMinusOberon,
  },
  Assassin: {
    isRed: true,
    name: 'Assassin',
    sees: redsMinusOberon,
  },
  Mordred: {
    isRed: true,
    name: 'Mordred',
    sees: redsMinusOberon,
  },
  Morgana: {
    isRed: true,
    name: 'Morgana',
    sees: redsMinusOberon,
  },
  Oberon: {
    isRed: true,
    name: 'Oberon',
    sees: [],
  },
};
