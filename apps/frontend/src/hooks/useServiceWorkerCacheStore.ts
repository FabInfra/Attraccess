import { useCallback } from 'react';

export function useServiceWorkerCacheStore() {
  const getByKey = useCallback(async (key: string): Promise<string | null> => {
    try {
      const response = await fetch(`/--pwa-shared-data?key=${key}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching from SW Key-Value Store', error);
      return null;
    }
  }, []);

  const setByKey = useCallback(async (key: string, value: string) => {
    await fetch('/--pwa-shared-data', {
      method: 'POST',
      body: JSON.stringify({
        key,
        value,
      }),
    });
  }, []);

  const deleteKey = useCallback(async (key: string) => {
    await fetch('/--pwa-shared-data', {
      method: 'DELETE',
    });
  }, []);

  return {
    getByKey,
    setByKey,
    deleteKey,
  };
}
