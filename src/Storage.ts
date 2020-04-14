import { hri } from "human-readable-ids";
import { APP_VERSION } from "./utils";

export interface StorageLayer {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function randomId(length: number) {
  return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
}

export interface UserState {
  v: string;
  id: string;
  name?: string;
  game?: string;
}

export class BrowserStorage {
  static store: StorageLayer = window.localStorage;

  private static getMinor(v: string) {
    return (v || '0.0.0').split('.').slice(0, 2).join('.');
  }

  static reset() {
    this.set({
      v: APP_VERSION,
      id: hri.random(),
      name: undefined,
      game: undefined,
    });
  }
  static set(data: UserState) {
    this.store.setItem('state', JSON.stringify(data));
  }
  static get(): UserState {
    const stored = this.store.getItem('state') || '{}';
    const data = JSON.parse(stored as any) as UserState;
    const isValid = data && this.getMinor(data.v) === this.getMinor(APP_VERSION);
    if (isValid) {
      return data;
    }
    this.reset();
    return this.get();
  }
}
