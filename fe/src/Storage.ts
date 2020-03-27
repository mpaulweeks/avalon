import { RoleType } from "./Role";

export interface StorageLayer {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface UserState {
  id: string;
  game: string;
  role: RoleType;
}

export class BrowserStorage {
  store: StorageLayer = window.localStorage;

  set(data: UserState) {
    this.store.setItem('state', JSON.stringify(data));
  }
  get() {
    const stored = this.store.getItem('state');
    if (!stored) { return; }
    return JSON.parse(stored) as UserState;
  }
}
