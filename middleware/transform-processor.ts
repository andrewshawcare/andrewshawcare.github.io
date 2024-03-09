import { Processor } from "./processor.js";

type Selector<T, U> = (item: T) => U | void;
type Transform<U> = (selection: U) => U;

export class TransformProcessor<T, U> implements Processor<T> {
  selector: Selector<T, U>;
  transform: Transform<U>;

  constructor({
    selector,
    transform,
  }: {
    selector: Selector<T, U>;
    transform: Transform<U>;
  }) {
    this.selector = selector;
    this.transform = transform;
  }

  process(item: T): T {
    const selection = this.selector(item);

    if (selection) {
      this.transform(selection);
    }

    return item;
  }
}
