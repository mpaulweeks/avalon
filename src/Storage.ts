import { hri } from "human-readable-ids";

export interface StorageLayer {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function randomId(length: number) {
  return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
}

export interface UserState {
  id: string;
  name?: string;
  game?: string;
}

export class BrowserStorage {
  static store: StorageLayer = window.localStorage;

  static reset() {
    this.set({
      id: hri.random(),
      name: undefined,
      game: undefined,
    });
  }
  static set(data: UserState) {
    this.store.setItem('state', JSON.stringify(data));
  }
  static get(): UserState {
    let stored = this.store.getItem('state');
    if (!stored) {
      this.reset();
      stored = this.store.getItem('state');
    }
    return JSON.parse(stored as any) as UserState;
  }
}
