import { Role, Roles, RoleType } from './types';

export interface RoleData {
  isRed: boolean;
  name: string;
  description: string;
  sees: Role[];
};

const reds = [RoleType.BasicRed, RoleType.Assassin, RoleType.Morgana, RoleType.Mordred, RoleType.Oberon];
const redsMinusMordred = reds.filter(r => r !== RoleType.Mordred);
const redsMinusOberon = reds.filter(r => r !== RoleType.Oberon);

export const AllRoles: { [key in typeof Roles[number]]: RoleData } = {
  BasicBlue: {
    isRed: false,
    name: 'Basic Blue',
    description: 'You know nothing. Good luck!',
    sees: [],
  },
  Merlin: {
    isRed: false,
    name: 'Merlin',
    description: 'Those are the red players.',
    sees: redsMinusMordred,
  },
  Percival: {
    isRed: false,
    name: 'Percival',
    description: 'You see two players. One is your ally Merlin, the other is the enemy Morgana. You must figure out which is which.',
    sees: [RoleType.Merlin, RoleType.Morgana],
  },
  BasicRed: {
    isRed: true,
    name: 'Basic Red',
    description: 'They are your fellow Red players.',
    sees: redsMinusOberon,
  },
  Assassin: {
    isRed: true,
    name: 'Assassin',
    description: 'They are your fellow Red players. You get to guess Merlin at the end of the game.',
    sees: redsMinusOberon,
  },
  Mordred: {
    isRed: true,
    name: 'Mordred',
    description: 'They are your fellow Red players. Merlin cannot see you',
    sees: redsMinusOberon,
  },
  Morgana: {
    isRed: true,
    name: 'Morgana',
    description: 'They are your fellow Red players. Percival sees you and Merlin. Try to confuse them.',
    sees: redsMinusOberon,
  },
  Oberon: {
    isRed: true,
    name: 'Oberon',
    description: 'You cannot see your Red allies.',
    sees: [],
  },
};
