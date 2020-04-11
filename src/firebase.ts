import firebase from 'firebase/app';
import 'firebase/database';
import { GameData, PlayerData, VoteData } from './types';

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
    // firebase.analytics();
    this.db = firebase.database();
  }

  async getAllGames(){
    console.log('fetching all game data');
    return new Promise<GameData[]>((resolve, reject) => {
      this.db.ref(`game`).once('value', resp => {
        const data = resp.val();
        console.log('got:', data)
        resolve(Object.values(data) as GameData[]);
      });
    });
  }

  updateGame(data: GameData) {
    console.log('saving data:', data);
    this.db.ref(`game/${data.id}`).set(data);
  }
  updatePlayers(gameId: string, data: PlayerData) {
    this.db.ref(`game/${gameId}/players`).set(data);
  }
  updateVotes(gameId: string, data: VoteData) {
    this.db.ref(`game/${gameId}/votes`).set(data);
  }

  async getGameData(gameId: string){
    console.log('fetching game data');
    return new Promise<GameData>((resolve, reject) => {
      this.db.ref(`game/${gameId}`).once('value', resp => {
        const data = resp.val();
        console.log('got:', data)
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
