// Custom, browser-compatible EventEmitter
export class EventEmitter {
  private listeners: Map<string, Function[]>;

  constructor() {
    this.listeners = new Map();
  }

  on(eventName: string, handler: Function) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    const handlers = this.listeners.get(eventName) as Function[];
    // Add de-duplication logic: only push the handler if it's not already in the array
    if (handlers.indexOf(handler) === -1) {
      handlers.push(handler);
    }
  }

  off(eventName: string, handler: Function) {
    if (!this.listeners.has(eventName)) return;
    const handlers = this.listeners.get(eventName) as Function[];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  emit(eventName: string, ...args: any[]) {
    const handlers = this.listeners.get(eventName);
    if (handlers) {
      handlers.forEach((handler) => handler(...args));
    }
  }
}
