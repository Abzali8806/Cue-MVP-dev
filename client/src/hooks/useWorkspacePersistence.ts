import { useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface WorkspaceData {
  workflowDescription: string;
  nodes: any[];
  edges: any[];
  credentials: Record<string, string>;
  generatedCode?: string;
  lastSaved: string;
}

export function useWorkspacePersistence() {
  const { user } = useAuth();

  const getStorageKey = useCallback(() => {
    return user?.id ? `workspace_${user.id}` : 'workspace_guest';
  }, [user?.id]);

  const getStorageType = useCallback(() => {
    // Use localStorage if user has remember me enabled, otherwise sessionStorage
    return user?.rememberMe ? localStorage : sessionStorage;
  }, [user?.rememberMe]);

  const saveWorkspace = useCallback((data: Partial<WorkspaceData>) => {
    const storage = getStorageType();
    const key = getStorageKey();
    
    try {
      const existing = storage.getItem(key);
      const existingData = existing ? JSON.parse(existing) : {};
      
      const updatedData: WorkspaceData = {
        ...existingData,
        ...data,
        lastSaved: new Date().toISOString(),
      };
      
      storage.setItem(key, JSON.stringify(updatedData));
    } catch (error) {
      console.warn('Failed to save workspace data:', error);
    }
  }, [getStorageKey, getStorageType]);

  const loadWorkspace = useCallback((): WorkspaceData | null => {
    const storage = getStorageType();
    const key = getStorageKey();
    
    try {
      const data = storage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to load workspace data:', error);
      return null;
    }
  }, [getStorageKey, getStorageType]);

  const clearWorkspace = useCallback(() => {
    const key = getStorageKey();
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to clear workspace data:', error);
    }
  }, [getStorageKey]);

  // Auto-save workspace data periodically
  const autoSave = useCallback((data: Partial<WorkspaceData>) => {
    // Debounce auto-save to avoid excessive storage writes
    const timeoutId = setTimeout(() => {
      saveWorkspace(data);
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [saveWorkspace]);

  // Migration between storage types when rememberMe changes
  useEffect(() => {
    if (user) {
      const key = getStorageKey();
      const currentStorage = getStorageType();
      const otherStorage = user.rememberMe ? sessionStorage : localStorage;
      
      // Migrate data if it exists in the other storage
      try {
        const otherData = otherStorage.getItem(key);
        if (otherData && !currentStorage.getItem(key)) {
          currentStorage.setItem(key, otherData);
          otherStorage.removeItem(key);
        }
      } catch (error) {
        console.warn('Failed to migrate workspace data:', error);
      }
    }
  }, [user?.rememberMe, getStorageKey, getStorageType]);

  return {
    saveWorkspace,
    loadWorkspace,
    clearWorkspace,
    autoSave,
  };
}