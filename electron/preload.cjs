const { contextBridge, ipcRenderer } = require('electron');

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