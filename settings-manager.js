class SettingsManager {
  constructor() {
    // Default values (if not found in localStorage)
    this.defaults = {
      modelPath: "",
      host: "0.0.0.0",
      port: 10000,
      ctxSize: 32000,
      keepTokens: 0
    };
  }

  /**
   * Load a specific setting from localStorage or use default if not found.
   */
  loadSetting(key) {
    const savedValue = localStorage.getItem(this.generateKey(key));
    return savedValue !== null ? JSON.parse(savedValue) : this.defaults[key];
  }

  /**
   * Save a specific setting to localStorage.
   * @param {string} key - The name of the setting (e.g., 'host', 'port').
   * @param {*} value - The new value for the setting.
   */
  saveSetting(key, value) {
    const storageKey = this.generateKey(key);
    if (value !== undefined && value !== null) {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } else {
      // If you want to remove a key when it's set to null or undefined
      localStorage.removeItem(storageKey);
    }
  }

  /**
   * Save all current values (e.g., from input fields).
   */
  saveAll(settings) {
    Object.keys(settings).forEach(key => this.saveSetting(key, settings[key]));
  }

  /**
   * Loads and populates the form inputs with saved settings.
   */
  loadAndPopulate() {
    const settings = {};
    for (const key in this.defaults) {
      if (this.defaults.hasOwnProperty(key)) {
        settings[key] = this.loadSetting(key);
      }
    }

    // Load theme separately
    const isDarkMode = localStorage.getItem('darkTheme') === 'true';

    document.getElementById('modelPath').value = settings.modelPath;
    document.getElementById('host').value = settings.host;
    document.getElementById('port').value = settings.port;
    document.getElementById('ctx').value = settings.ctxSize;
    document.getElementById('keepTokens').value = settings.keepTokens;  

    // For the settings modal
    document.getElementById('llamaServerPath').value = this.loadSetting('llamaServerPath') || '/usr/local/bin/llama-server';
    document.getElementById('defaultHost').value = settings.host;
    document.getElementById('defaultPort').value = settings.port;
    document.getElementById('defaultCtxSize').value = settings.ctxSize;
    document.getElementById('defaultKeepTokens').value = settings.keepTokens;

    // For theme toggle
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      document.getElementById('themeToggle').checked = true;
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.getElementById('themeToggle').checked = false;
    }
  }

  /**
   * Helper method to generate a unique key for each setting.
   */
  generateKey(key) {
    return `llamaSetting_${key}`;
  }
}
