import dotenv from 'dotenv';
import firebase from 'firebase/app';
import 'firebase/database';
import { BoardData, GameData, NominationData, PlayerData, Role, TurnData, VoteData } from './types';

dotenv.config();
const config = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
};

class FirebaseSingleton {
  private db: firebase.database.Database;
  isOnline = true;

  constructor() {
    firebase.initializeApp(config);
    this.db = firebase.database();
  }

  // debug
  async getAllGames() {
    console.log('fetching all game data');
    return new Promise<GameData[]>((resolve, reject) => {
      this.db.ref(`game`).once('value', resp => {
        const data = resp.val();
        console.log('got all games:', data)
        resolve(Object.values(data || {}) as GameData[]);
      });
    });
  }
  async kickPlayer(game: GameData, playerId: string) {
    const { gid, nominations, players, turn, votes } = game;
    nominations.roster = (nominations.roster || []).filter(pid => pid !== playerId);
    delete (nominations.tally || {})[playerId];
    delete (players || {})[playerId];
    if (turn) {
      turn.order = turn.order.filter(pid => pid !== playerId);
      if (turn.current === playerId) {
        turn.current = turn.order[0];
      }
    }
    delete (votes.tally || {})[playerId];
    await this.updateNominations(gid, nominations);
    await this.updatePlayers(gid, players);
    await this.updateTurn(gid, turn);
    await this.updateVotes(gid, votes);
  }
  deleteAllGames() {
    this.db.ref(`game`).set({});
  }

  updateGame(data: GameData) {
    console.log('saving data:', data);
    return this.db.ref(`game/${data.gid}`).set(data);
  }
  updateBoard(gameId: string, data: BoardData) {
    return this.db.ref(`game/${gameId}/board`).set(data);
  }
  updateNominations(gameId: string, data: NominationData) {
    return this.db.ref(`game/${gameId}/nominations`).set(data);
  }
  updatePlayers(gameId: string, data: PlayerData) {
    return this.db.ref(`game/${gameId}/players`).set(data);
  }
  updateRoles(gameId: string, data: Role[]) {
    return this.db.ref(`game/${gameId}/roles`).set(data);
  }
  updateTurn(gameId: string, data: TurnData | null) {
    return this.db.ref(`game/${gameId}/turn`).set(data || null);
  }
  updateVetoes(gameId: string, data: number) {
    return this.db.ref(`game/${gameId}/vetoes`).set(data);
  }
  updateVotes(gameId: string, data: VoteData) {
    return this.db.ref(`game/${gameId}/votes`).set(data);
  }

  async getGameData(gameId: string) {
    console.log('fetching game data');
    return new Promise<GameData>((resolve, reject) => {
      this.db.ref(`game/${gameId}`).once('value', resp => {
        const data = resp.val();
        console.log('got game data:', data)
        resolve(data as GameData);
      });
    });
  }

  joinGame(gameId: string, callback: (val: any) => void): void {
    console.log('enabling hook:', gameId);
    this.db.ref(`game/${gameId}`).on('value', data => {
      callback(data.val());
    });
  }
  leaveGame(gameId: string): void {
    console.log('disabling hook:', gameId);
    this.db.ref(`game/${gameId}`).off('value');
  }
}

export const FIREBASE = new FirebaseSingleton();
