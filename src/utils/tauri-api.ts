/**
 * Tauri API wrapper
 * 
 * This file provides a centralized way to interact with the Tauri API
 * and handles fallbacks for development environments where the API might not be available.
 */

// Define our mock implementations for development mode
const mockInvoke = <T>(command: string, args?: Record<string, unknown>): Promise<T> => {
  console.warn(`Mock invoke called for command: ${command}`, args);
  
  // Return mock data based on the command
  // This allows development to proceed even without Tauri backend available
  if (command === 'login') {
    return Promise.resolve('mock-session-data' as unknown as T);
  } else if (command === 'get_timeline') {
    return Promise.resolve([] as unknown as T);
  } else if (command === 'create_post') {
    return Promise.resolve('mock-post-uri' as unknown as T);
  } else if (command === 'like_post') {
    return Promise.resolve(true as unknown as T);
  } else if (command === 'get_post_detail') {
    return Promise.resolve({} as unknown as T);
  } else if (command === 'get_post_replies') {
    return Promise.resolve([] as unknown as T);
  }
  
  return Promise.reject(new Error('Unimplemented mock for: ' + command));
};

// Check if we're in a Tauri environment
const isTauri = (): boolean => {
  return typeof window !== 'undefined' && window.__TAURI_IPC__ !== undefined;
};

// Simplified invoke function that works in both environments
export const invoke = <T>(command: string, args?: Record<string, unknown>): Promise<T> => {
  if (isTauri() && window.__TAURI_IPC__) {
    return window.__TAURI_IPC__.invoke(command, args);
  }
  return mockInvoke(command, args);
};

// Define global Tauri interfaces to avoid TS errors
declare global {
  interface Window {
    __TAURI_IPC__?: {
      invoke<T>(command: string, args?: Record<string, unknown>): Promise<T>;
    };
  }
} 