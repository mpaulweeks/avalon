import { hri } from "human-readable-ids";
import { UserState, ViewTab, ViewTabType } from "./types";
import { APP_VERSION } from "./utils";

export interface StorageLayer {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

class StorageSingleton {
  store: StorageLayer = window.localStorage;
  onSet: (val: UserState) => Promise<void> = () => Promise.resolve();

  private getMinor(v: string) {
    return (v || '0.0.0').split('.').slice(0, 2).join('.');
  }

  reset() {
    this.set({
      v: APP_VERSION,
      pid: hri.random(),
      name: undefined,
      gid: undefined,
      view: ViewTabType.Reset,
    });
  }
  private set(data: UserState): Promise<void> {
    this.store.setItem('state', JSON.stringify(data));
    return this.onSet(data);
  }
  setName(name: string) {
    return this.set({
      ...this.get(),
      name: name,
    });
  }
  setGame(gid: string) {
    return this.set({
      ...this.get(),
      gid: gid,
    });
  }
  setView(view: ViewTab) {
    return this.set({
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
