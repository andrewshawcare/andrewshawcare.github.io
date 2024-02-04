import { Module } from "./module.js";

type Predicate<T> = (item: T) => boolean;

export class FilterModule<T> implements Module<T> {
  predicate: Predicate<T>;

  constructor({ predicate }: { predicate: Predicate<T> }) {
    this.predicate = predicate;
  }

  process(item: T): void | T {
    if (this.predicate(item)) {
      return item;
    }
  }
}
