declare module 'trashable' {
  export interface TrashablePromise<T> extends Promise<T> {
    trash(): void;
  }

  export default function <T>(p: Promise<T>): TrashablePromise<T>
}
