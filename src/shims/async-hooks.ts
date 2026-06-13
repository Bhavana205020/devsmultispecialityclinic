// Browser shim for node:async_hooks. TanStack Router's Scripts/HeadContent
// imports pull in @tanstack/start-storage-context, which expects AsyncLocalStorage
// on the server. In a static SPA build there is no server, so we provide a no-op.
export class AsyncLocalStorage<T> {
  private store: T | undefined;
  getStore(): T | undefined {
    return this.store;
  }
  run<R>(store: T, callback: () => R): R {
    const prev = this.store;
    this.store = store;
    try {
      return callback();
    } finally {
      this.store = prev;
    }
  }
  enterWith(store: T) {
    this.store = store;
  }
  disable() {
    this.store = undefined;
  }
}
export default { AsyncLocalStorage };
