//const settingsManager = new SettingsManager();


function openSettingsModal() {
    document.getElementById("settingsOverlay").style.display = "block";
    const dialog = document.getElementById("settingsDialog");
    if (typeof dialog.show === 'function') {
        dialog.show();
    }
    
}

function closeSettingsModal() {
    // Save all form inputs in the modal before closing it
    const settings = {
        llamaServerPath: document.getElementById('llamaServerPath').value,
        host: document.getElementById('defaultHost').value,
        port: parseInt(document.getElementById('defaultPort').value, 10),
        ctxSize: parseInt(document.getElementById('defaultCtxSize').value, 10),
        keepTokens: parseInt(document.getElementById('defaultKeepTokens').value, 10)
    };
    settingsManager.saveAll(settings);

    const dialog = document.getElementById("settingsDialog");
    if (typeof dialog.close === 'function') {
        dialog.close();
    }

    // Rest of the close modal code
    document.getElementById("settingsOverlay").style.display = "none";

}


const toggle = document.getElementById("themeToggle");
toggle.addEventListener('change', () => {
    if (toggle.checked) {
        // Set dark theme on the <html> tag
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        // set to light theme
        document.documentElement.removeAttribute("data-theme", "light");
    }
});


// renderer.js or settings.js
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeSettingsModal();
    }
});

//***************************/
// BEGIN Auto Save
// Auto-Save Input Values
function setupAutoSave() { // Accept SettingsManager instance as a parameter or create it here
    //const settingsManager = (settingsManagerInstance) ? settingsManager : new SettingsManager(); 
    //const settingsManager = settingsManagerInstance;
    // Main Interface Auto-save
    document.getElementById('modelPath').addEventListener('change', (e) => {
        settingsManager.saveSetting('modelPath', e.target.value);
    });

    ['host', 'port', 'ctx', 'keepTokens'].forEach(id => {
        document.getElementById(id).addEventListener('blur', (e) => {
            const value = id === 'port' || id === 'defaultPort' ? parseInt(e.target.value, 10) : e.target.value;
            settingsManager.saveSetting(id === 'ctx' ? 'ctxSize' : id, value);
        });
    });

    // Settings Modal Auto-save
    document.getElementById('llamaServerPath').addEventListener('change', (e) => {
        settingsManager.saveSetting('llamaServerPath', e.target.value);
    });

    ['defaultHost', 'defaultPort', 'defaultCtxSize', 'defaultKeepTokens'].forEach(id => {
        document.getElementById(id).addEventListener('blur', (e) => {
            const value = id === 'defaultPort' ? parseInt(e.target.value, 10) : e.target.value;
            settingsManager.saveSetting(id.replace('default', ''), value);
        });
    });

    toggle.addEventListener('change', () => {
        settingsManager.saveThemePreference(toggle.checked);
    });
}


// END Auto Save


document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings into form inputs
    settingsManager.loadAndPopulate();
    // setup auto save
    setupAutoSave();

});