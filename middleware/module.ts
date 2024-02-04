export type Module<T> = {
  process(item: T): T | void;
};
