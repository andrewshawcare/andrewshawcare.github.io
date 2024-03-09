import { Processor } from "./processor.js";

export class SequentialProcessor<T> implements Processor<T> {
  modules: Processor<T>[];

  constructor({ modules }: { modules: Processor<T>[] }) {
    this.modules = modules;
  }

  process(item: T): void | T {
    for (const module of this.modules) {
      if (typeof module.process(item) === "undefined") {
        break;
      }
    }
  }
}
