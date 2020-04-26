import { hri } from "human-readable-ids";
import { UserState, Views, ViewType } from "./types";
import { APP_VERSION } from "./utils";

export interface StorageLayer {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

class StorageSingleton {
  store: StorageLayer = window.localStorage;
  onSet: (val: UserState) => void = () => { };

  private getMinor(v: string) {
    return (v || '0.0.0').split('.').slice(0, 2).join('.');
  }

  reset() {
    this.set({
      v: APP_VERSION,
      id: hri.random(),
      name: undefined,
      game: undefined,
      view: Views.Reset,
    });
  }
  private set(data: UserState) {
    this.store.setItem('state', JSON.stringify(data));
    this.onSet(data);
  }
  setName(name: string) {
    this.set({
      ...this.get(),
      name: name,
    });
  }
  setGame(game: string) {
    this.set({
      ...this.get(),
      game: game,
    });
  }
  setView(view: ViewType) {
    this.set({
      ...this.get(),
      view: view,
    });
  }
  get(): UserState {
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

export const STORAGE = new StorageSingleton();
