export const safeStorage = {
  getItem: (key: string, fallback = ''): string => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key) || fallback;
      }
    } catch {
      // Storage might be blocked in third-party iframes
    }
    return fallback;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Storage might be blocked in third-party iframes
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Storage might be blocked in third-party iframes
    }
  }
};
