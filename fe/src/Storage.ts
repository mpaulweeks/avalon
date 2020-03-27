export interface StorageLayer {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface UserState {
  id: string;
  game?: string;
}

export class BrowserStorage {
  static store: StorageLayer = window.localStorage;

  static set(data: UserState) {
    this.store.setItem('state', JSON.stringify(data));
  }
  static get() {
    const stored = this.store.getItem('state');
    if (!stored) {
      const defaultState = {
        id: '' + Math.floor(Math.random() * 1000000),
        game: undefined,
      };
      this.set(defaultState);
      return defaultState;
    }
    return JSON.parse(stored) as UserState;
  }
}
