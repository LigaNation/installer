/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    installSoftware: (software: { path: string; silent: boolean }) => Promise<{ success: boolean; error?: string }>;
    selectSoftwarePath: () => Promise<string>;
    onInstallationProgress: (callback: (progress: number) => void) => void;
  }
}