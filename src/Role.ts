
export const RoleTypes = [
  'BasicBlue',
  'Merlin',
  'Percival',
  'BasicRed',
  'Assassin',
  'Mordred',
  'Morgana',
] as const;
export type RoleType = typeof RoleTypes[number];

export const Roles = RoleTypes.reduce((obj, r) => {
  obj[r] = r;
  return obj;
}, {} as { [key in typeof RoleTypes[number]]: RoleType });

export interface Role {
  isRed: boolean;
  name: string;
  sees: RoleType[];
};

const redsMinusMordred = [Roles.BasicRed, Roles.Assassin, Roles.Morgana];
const redsPlusMordred = redsMinusMordred.concat([Roles.Mordred]);
export const RoleData: { [key in typeof RoleTypes[number]]: Role } = {
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
    sees: [Roles.Merlin, Roles.Morgana],
  },
  BasicRed: {
    isRed: true,
    name: 'Basic Red',
    sees: redsPlusMordred,
  },
  Assassin: {
    isRed: true,
    name: 'Assassin',
    sees: redsPlusMordred,
  },
  Mordred: {
    isRed: true,
    name: 'Mordred',
    sees: redsPlusMordred,
  },
  Morgana: {
    isRed: true,
    name: 'Morgana',
    sees: redsPlusMordred,
  },
};
