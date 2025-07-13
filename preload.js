const { contextBridge, ipcRenderer } = require('electron');




contextBridge.exposeInMainWorld('electronAPI', {
  // File dialog
  showOpenDialog: async () => {
    try {
      const filePath = await ipcRenderer.invoke('open-file-dialog');
      //updateDisplay(filePath);
      return filePath;
    } 
    catch (error) {
      console.error('Error opening file dialog:', error);
      return null;
    }
  },
  
  // Server control
  startServer: (executablePath, modelPath, host, port, ctx) => {
    ipcRenderer.send('start-server', executablePath, modelPath, host, port, ctx);
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