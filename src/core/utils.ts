import { MissionResultType, GameData } from "./types";

export const APP_VERSION = '1.3.0';

export const isDev = window.location.href.includes('localhost');
export const isDebug = window.location.href.includes('?d');
if (!isDebug) {
  const orig = console.log;
  console.log = (...args: any[]) => { };
  orig('activate debug move to view logs'.toUpperCase());
}

export function randomId(length: number) {
  return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
}

export function sort<T, E>(arr: T[], keyFunc: (key: T) => E) {
  return arr.concat().sort((a, b) => {
    const ka = keyFunc(a);
    const kb = keyFunc(b);
    if (ka < kb) { return -1; }
    if (ka > kb) { return 1; }
    return 0;
  });
}

export function sortObjVals<T, E>(obj: { [key: string]: T }, keyFunc: (key: T) => E) {
  return sort(Object.values(obj), keyFunc);
}

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

export function getCurrentPlayers(game: GameData) {
  return (game.turn ? game.turn.order : []).map(pid => game.players[pid]);
}

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
