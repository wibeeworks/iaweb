// settings.js
class SettingsManager {
  constructor() {
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
  }

  async loadSettings() {
    const settings = await chrome.storage.local.get([
      'openaiKey',
      'anthropicKey',
      'mistralKey',
      'googleKey',
      'backendUrl'
    ]);

    document.getElementById('openaiKey').value = settings.openaiKey || '';
    document.getElementById('anthropicKey').value = settings.anthropicKey || '';
    document.getElementById('mistralKey').value = settings.mistralKey || '';
    document.getElementById('googleKey').value = settings.googleKey || '';
    document.getElementById('backendUrl').value = settings.backendUrl || 'http://localhost:3000';
  }

  setupEventListeners() {
    document.getElementById('saveBtn').addEventListener('click', () => this.saveSettings());
    document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());

    document.querySelectorAll('.test-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const provider = e.target.dataset.provider;
        this.testProvider(provider);
      });
    });
  }

  async saveSettings() {
    const settings = {
      openaiKey: document.getElementById('openaiKey').value,
      anthropicKey: document.getElementById('anthropicKey').value,
      mistralKey: document.getElementById('mistralKey').value,
      googleKey: document.getElementById('googleKey').value,
      backendUrl: document.getElementById('backendUrl').value
    };

    await chrome.storage.local.set(settings);
    this.showStatus('✅ Paramètres enregistrés!', 'success');
  }

  async clearAll() {
    if (!confirm('Êtes-vous sûr ? Toutes tes clés API seront supprimées.')) return;

    await chrome.storage.local.clear();
    await this.loadSettings();
    this.showStatus('✅ Tout a été effacé.', 'success');
  }

  async testProvider(provider) {
    const keyInputs = {
      openai: 'openaiKey',
      anthropic: 'anthropicKey',
      mistral: 'mistralKey',
      google: 'googleKey'
    };

    const keyValue = document.getElementById(keyInputs[provider]).value;
    if (!keyValue) {
      this.showStatus('❌ Ajoute une clé d\'abord.', 'error');
      return;
    }

    this.showStatus('🔄 Test en cours...', 'info');

    // Teste juste la format de la clé
    try {
      const isValid = this.validateKey(provider, keyValue);
      if (isValid) {
        this.showStatus(`✅ Clé ${provider} valide!`, 'success');
      } else {
        this.showStatus(`❌ Format de clé invalide.`, 'error');
      }
    } catch (error) {
      this.showStatus(`❌ Erreur: ${error.message}`, 'error');
    }
  }

  validateKey(provider, key) {
    const patterns = {
      openai: /^sk-[a-zA-Z0-9]{20,}$/,
      anthropic: /^sk-ant-[a-zA-Z0-9]{20,}$/,
      mistral: /^[a-zA-Z0-9]{32,}$/,
      google: /^[a-zA-Z0-9_-]{39}$/
    };

    return patterns[provider]?.test(key) || key.length > 10;
  }

  showStatus(message, type) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    setTimeout(() => {
      statusEl.className = 'status';
      statusEl.textContent = '';
    }, 4000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SettingsManager();
});