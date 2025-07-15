const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const windowStateKeeper = require('electron-window-state');

let mainWindow;
let childProcess;

//BEGIN dialog related code
// Handle file dialog request from renderer - using handle/invoke pattern
ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile']
    });
    if (canceled || filePaths.length === 0) return null;
    return filePaths[0];
});
//END dialog related code


ipcMain.on('start-server', (event, executablePath, modelPath, host, port, ctx) => {

    // Request the path from renderer process
    try {

        const args = ['-m', modelPath, '--host', host, '--port', port, "--ctx-size", ctx];

        // Extract the directory from executablePath dynamically.
        const workingDirectory = path.dirname(executablePath);

        // Log for debugging
        console.log(`Command Line: ${executablePath} ${args.join(' ')}`);
        console.log("Working Directory:", workingDirectory);  // Use extracted dir.

        childProcess = spawn(executablePath, args, { cwd: workingDirectory });

        childProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            event.reply('server-output', data.toString());
        });

        childProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            event.reply('server-error', data.toString());
        });
    }
    catch (error) {
        console.error("Failed to retrieve executable path:", error);
    }
});


ipcMain.on('stop-server', () => {
    if (childProcess) {
        childProcess.kill();
    }
});


//BEGIN devTools related code
// Listen for a request to open DevTools (e.g., via an event)
ipcMain.on('open-devtools', () => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
        window.webContents.openDevTools(); // Opens in the current focused window
    }
});

ipcMain.on('toggle-devtools', () => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
        if (window.webContents.isDevToolsOpened()) {
            window.closeDevTools(); // Close Dev Tools
        } else {
            window.openDevTools({ mode: 'detach' }); // Open as a detached panel
        }
    }
});
//END devTools related code


function createWindow() {
    // Load the previous window state or set defaults
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1100,
        defaultHeight: 1100
    });

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Let windowStateKeeper manage the window
    mainWindowState.manage(mainWindow);

    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

// Clean up on quit
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
