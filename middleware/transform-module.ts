import { Module } from "./module.js";

type Selector<T, U> = (item: T) => U | void;
type Transform<U> = (selection: U) => U;

export class TransformModule<T, U> implements Module<T> {
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
