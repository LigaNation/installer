const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electronAPI',
  {
    installSoftware: (software) => ipcRenderer.invoke('install-software', software),
    selectSoftwarePath: () => ipcRenderer.invoke('select-software-path'),
    onInstallationProgress: (callback) => {
      ipcRenderer.on('installation-progress', (event, progress) => callback(progress));
    }
  }
);