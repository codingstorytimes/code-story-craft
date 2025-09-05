// ============================================================================
// Store (CRUD-style interface)
// ============================================================================

export class Store {
    key: string;
    defaults: any;
    storage: Storage;

    constructor({ key = '', defaults = {}, storage = localStorage } = {}) {
      this.key = key;
      this.defaults = { ...defaults };
      this.storage = storage;
    }
  
    /** Load all preferences from storage (resilient to corruption). */
    load() {
      try {
        const raw = this.storage.getItem(this.key);
        if (!raw) return { ...this.defaults };
        const parsed = JSON.parse(raw);
        return { ...this.defaults, ...parsed };
      } catch (err) {
        console.error(`Store.load: corrupted data for "${this.key}", resetting`, err);
        this.reset();
        return { ...this.defaults };
      }
    }
  
    /** Save full preferences (merged with defaults). */
    save(data = {}) {
      const toSave = { ...this.defaults, ...data };
      try {
        this.storage.setItem(this.key, JSON.stringify(toSave));
      } catch (err) {
        console.error(`Store.save: failed, attempting reset for "${this.key}"`, err);
        try {
          this.reset();
          this.storage.setItem(this.key, JSON.stringify(toSave));
        } catch (retryErr) {
          console.error('Store.save: retry failed', retryErr);
          throw new Error(`Failed to save preferences for "${this.key}"`);
        }
      }
      return toSave;
    }
  
    /** Reset (delete) all stored preferences. */
    reset() {
      try {
        this.storage.removeItem(this.key);
      } catch (err) {
        console.error(`Store.reset: failed for "${this.key}"`, err);
      }
    }
  
    /** Read a single key, with optional fallback. */
    get(k: string, fallback = undefined) {
      const all = this.load();
      return k in all ? all[k] : fallback;
    }
  
    /** Create or update one or more keys (partial update). */
    patch(partial: any) {
      const next = { ...this.load(), ...(partial || {}) };
      this.save(next);
      return next;
    }
  
    /** Delete a specific key. */
    delete(k: string) {
      const current = this.load();
      if (k in current) {
        delete current[k];
        this.save(current);
      }
      return current;
    }
  
    /** Replace entire preferences object (overwrites existing). */
    update(newData = {}) {
      const toSave = { ...this.defaults, ...newData };
      this.save(toSave);
      return toSave;
    }
  }