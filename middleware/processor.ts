export type Processor<T> = {
  process(item: T): T | void;
};
