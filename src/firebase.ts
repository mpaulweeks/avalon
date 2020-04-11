import firebase from 'firebase/app';
import 'firebase/database';
import { RoleType } from './Role';
import { BoardData, GameData, NominationData, PlayerData, TurnData, VoteData } from './types';

const config = {
  apiKey: "AIzaSyAEz0EOh3rS5AQ1XyG4YQcHVtI9QvjbLQY",
  authDomain: "avalon-db-d62ad.firebaseapp.com",
  databaseURL: "https://avalon-db-d62ad.firebaseio.com",
  projectId: "avalon-db-d62ad",
  storageBucket: "avalon-db-d62ad.appspot.com",
  messagingSenderId: "964793644074",
  appId: "1:964793644074:web:1cce0c458aa896732fbf53",
  measurementId: "G-E2SERHMFE4"
};

export interface IFirebase {
}

class FirebaseSingleton implements IFirebase {
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
    const { id, nominations, players, turn, votes } = game;
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
    await this.updateNominations(id, nominations);
    await this.updatePlayers(id, players);
    await this.updateTurn(id, turn);
    await this.updateVotes(id, votes);
  }
  deleteAllGames() {
    this.db.ref(`game`).set({});
  }

  updateGame(data: GameData) {
    console.log('saving data:', data);
    return this.db.ref(`game/${data.id}`).set(data);
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
  updateRoles(gameId: string, data: RoleType[]) {
    return this.db.ref(`game/${gameId}/roles`).set(data);
  }
  updateTurn(gameId: string, data: TurnData | null) {
    return this.db.ref(`game/${gameId}/turn`).set(data || null);
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
