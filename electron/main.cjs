const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('install-software', async (event, { path: softwarePath, silent }) => {
  try {
    if (!softwarePath) {
      return { success: false, error: 'No path provided' };
    }

    // Simulate progress
    for (let i = 0; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      event.sender.send('installation-progress', i * 10);
    }

    if (softwarePath.endsWith('.exe')) {
      const args = silent ? ['/S', '/silent', '/quiet', '/norestart'] : [];
      const installation = spawn(softwarePath, args);
      
      return new Promise((resolve) => {
        installation.on('close', (code) => {
          resolve({ success: code === 0, code });
        });
      });
    } else if (softwarePath.endsWith('.msi')) {
      const args = ['msiexec', '/i', softwarePath];
      if (silent) args.push('/quiet', '/norestart');
      
      const installation = spawn('cmd.exe', ['/c', ...args]);
      
      return new Promise((resolve) => {
        installation.on('close', (code) => {
          resolve({ success: code === 0, code });
        });
      });
    }
    
    return { success: false, error: 'Unsupported file format' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('select-software-path', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Executables', extensions: ['exe', 'msi'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (result.canceled) {
    return null;
  }
  
  return result.filePaths[0];
});