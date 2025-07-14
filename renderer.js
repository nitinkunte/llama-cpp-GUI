const settingsManager = new SettingsManager();

function startServer() {
    const modelPath = document.getElementById('modelPath').value;
    const host = document.getElementById('host').value;
    const port = document.getElementById('port').value;
    const ctx = document.getElementById('ctx').value;

    const llamaServerPath = settingsManager.loadSetting("llamaServerPath");
    if (!modelPath || !host || !port) {
        alert("Please fill in required fields.");
        return;
    }

    // Now using the exposed API
    window.electronAPI.startServer(llamaServerPath, modelPath, host, port, ctx);
}

function stopServer() {
    window.electronAPI.stopServer();
}

/************************************/
//BEGIN Settings code
document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings into form inputs
    settingsManager.loadAndPopulate();

    // Set up server output listeners
    window.electronAPI.onServerOutput((data) => {
        const message = data + '\n';
        addLog(message);
    });

    window.electronAPI.onServerError((data) => {
        const message = 'Error: ' + data + '\n';
        addLog(message);
    });
});
//END Settings code

/**********************/
//BEGIN file selection dialog
/* document.getElementById('choose-model').addEventListener('click', async () => {
    try {
        const filePath = await window.electronAPI.showOpenDialog();
        console.log("before file");
        console.log(filePath);
        console.log("after file");
        if (filePath) {
            updateDisplay2(filePath);
        }
    } catch (error) {
        console.error('Error selecting file:', error);
        alert('Error selecting file: ' + error.message);
    }
}); */
document.getElementById('choose-model').addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile();
    if (filePath) {
        document.getElementById('modelPath').value = filePath;
        // Save the setting directly since programmatic value changes don't trigger 'change' events
        settingsManager.saveSetting('modelPath', filePath);
    }
});


/* function updateDisplay2(path) {
    if (!path) return;
    document.getElementById('modelPath').value = path;
    // Save the setting directly since programmatic value changes don't trigger 'change' events
    settingsManager.saveSetting('modelPath', path);
} */
//END file selection dialog

//************************************/
//BEGIN Log related code
function addLog(message) {
    const logs = document.getElementById('logs');
    if (!logs) return;

    // Check for server start message pattern: "main: server is listening on http://..."
    const match = message.match(/main:\s+server\s+is\s+listening\s+on\s+(http:\/\/[^:]*)\:(\d+)/i);

    if (match && match[1] && match[2]) {
        // Use the actual host and port from user input or app state
        const finalHost = document.getElementById('host').value;
        const finalPort = document.getElementById('port').value;

        const url = `http://${finalHost}:${finalPort}`;
        let urlWithLink = `<a href="${url}" target="_blank" style="color: blue;">${url}</a><br>`;
        let newMessage = message.replace(url, urlWithLink);
        logs.innerHTML += newMessage;
    } else {
        // Regular log message as text
        logs.textContent += '\n' + message;
    }
    // Auto-scroll to bottom if needed
    const scrollHeight = logs.scrollHeight;
    const clientHeight = logs.clientHeight;
    if (logs.scrollTop === scrollHeight - clientHeight) {
        logs.scrollIntoView(false);
    }
}

// Remove the old ipcRenderer listeners since they're now handled in DOMContentLoaded
//END log related code

//************************************/
// BEGIN DevTools related code


document.getElementById('toggle-devtools').addEventListener('click', () => {
    window.electronAPI.toggleDevTools();
});
// END DevTools related code