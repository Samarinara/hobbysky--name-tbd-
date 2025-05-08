// Define the global __TAURI_IPC__ interface
interface Window {
  __TAURI_IPC__?: {
    invoke<T>(command: string, args?: Record<string, unknown>): Promise<T>;
  };
}

// These are for compatibility only - we're using our own implementation
declare module '@tauri-apps/api/tauri' {
  export function invoke<T>(command: string, args?: Record<string, unknown>): Promise<T>;
}

declare module '@tauri-apps/api/window' {
  export function getCurrent(): any;
  export function getAll(): any[];
}

declare module '@tauri-apps/api/*' {
  const api: any;
  export default api;
} 