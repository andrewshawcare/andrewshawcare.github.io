import { Processor } from "./processor.js";

type Predicate<T> = (item: T) => boolean;

export class FilterProcessor<T> implements Processor<T> {
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
