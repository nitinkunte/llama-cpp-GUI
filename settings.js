// settings.js
function openSettingsModal() {
  document.getElementById("settingsOverlay").style.display = "block";
  const dialog = document.getElementById("settingsDialog");
  if (typeof dialog.show === 'function') {
    dialog.show();
  }
}

/* function closeSettingsModal() {
  document.getElementById("settingsOverlay").style.display = "none";
  const dialog = document.getElementById("settingsDialog");
  if (typeof dialog.close === 'function') {
    dialog.close();
  }
} */
function closeSettingsModal() {
  // Save all form inputs in the modal before closing it
  const settings = {
    llamaServerPath: document.getElementById('llamaServerPath').value,
    host: document.getElementById('defaultHost').value,
    port: parseInt(document.getElementById('defaultPort').value, 10),
    ctxSize: parseInt(document.getElementById('defaultCtxSize').value, 10)
  };
  settingsManager.saveAll(settings);

  // Rest of the close modal code
  document.getElementById("settingsOverlay").style.display = "none";
  const dialog = document.getElementById("settingsDialog");
  if (typeof dialog.close === 'function') {
    dialog.close();
  }
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
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeSettingsModal();
  }
});

//***************************/
// BEGIN Auto Save
// Auto-Save Input Values
function setupAutoSave(settingsManagerInstance) { // Accept SettingsManager instance as a parameter or create it here
  const settingsManager = new SettingsManager(); // Create an instance of SettingsManager

  // Main Interface Auto-save
  document.getElementById('modelPath').addEventListener('change', (e) => {
    settingsManager.saveSetting('modelPath', e.target.value);
  });

  ['host', 'port', 'ctx'].forEach(id => {
    document.getElementById(id).addEventListener('blur', (e) => {
      const value = id === 'port' || id === 'defaultPort' ? parseInt(e.target.value, 10) : e.target.value;
      settingsManager.saveSetting(id === 'ctx' ? 'ctxSize' : id, value);
    });
  });

  // Settings Modal Auto-save
  document.getElementById('llamaServerPath').addEventListener('change', (e) => {
    settingsManager.saveSetting('llamaServerPath', e.target.value);
  });

  ['defaultHost', 'defaultPort'].forEach(id => {
    document.getElementById(id).addEventListener('blur', (e) => {
      const value = id === 'defaultPort' ? parseInt(e.target.value, 10) : e.target.value;
      settingsManager.saveSetting(id.replace('default', ''), value);
    });
  });

  toggle.addEventListener('change', () => {
    settingsManager.saveThemePreference(toggle.checked);
  });
}

// Call setupAutoSave after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() { // Wrap in an event listener to ensure the DOM is ready
  const settingsManager = new SettingsManager(); // Create instance of SettingsManager here or pass it from renderer.js
  setupAutoSave(settingsManager);
});

// END Auto Save
