const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronAPI', {
  // File dialog

  openFile: async () => await ipcRenderer.invoke('dialog:openFile'),
  // Server control
  startServer: (executablePath, modelPath, host, port, ctx, keepTokens) => {
    ipcRenderer.send('start-server', executablePath, modelPath, host, port, ctx, keepTokens);
  },
  
  stopServer: () => {
    ipcRenderer.send('stop-server');
  },
  
  // DevTools
  toggleDevTools: () => {
    ipcRenderer.send('toggle-devtools');
  },
  
  // Server output listeners
  onServerOutput: (callback) => {
    ipcRenderer.on('server-output', (event, data) => callback(data));
  },
  
  onServerError: (callback) => {
    ipcRenderer.on('server-error', (event, data) => callback(data));
  },
  
  // Remove listeners (cleanup)
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});