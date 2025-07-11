const setupPersistentTools = () => {
  const persistenceKey = 'graphscript-persistence:';

  const saveData = (key: string, value: string) => {
    localStorage.setItem(`${persistenceKey}${key}`, value);
  };

  const loadData = (key: string): string | null => {
    return localStorage.getItem(`${persistenceKey}${key}`);
  };

  const wipeData = (key: string) => {
    localStorage.removeItem(`${persistenceKey}${key}`);
  };

  return {
    saveData,
    loadData,
    wipeData,
  }
};

export const {
  saveData,
  loadData,
  wipeData,
} = setupPersistentTools();

