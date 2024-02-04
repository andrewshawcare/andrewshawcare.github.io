import { Module } from "./module.js";

export class SequentialModule<T> implements Module<T> {
  modules: Module<T>[];

  constructor({ modules }: { modules: Module<T>[] }) {
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
