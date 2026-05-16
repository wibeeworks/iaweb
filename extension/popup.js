// popup.js — Version Firefox
class PopupManager {
  constructor() {
    this.conversations = {};
    this.currentConversationId = null;
    this.backendUrl = null;
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.loadConversations();
    this.setupEventListeners();
    this.createNewConversation();
  }

  async loadSettings() {
    const settings = await browser.storage.local.get(['backendUrl']);
    this.backendUrl = settings.backendUrl || 'http://localhost:3000';
  }

  async loadConversations() {
    const data = await browser.storage.local.get(['conversations', 'currentConversationId']);
    this.conversations = data.conversations || {};
    this.currentConversationId = data.currentConversationId;
  }

  async saveConversations() {
    await browser.storage.local.set({
      conversations: this.conversations,
      currentConversationId: this.currentConversationId
    });
  }

  createNewConversation() {
    const conversationId = Date.now().toString();
    this.currentConversationId = conversationId;
    this.conversations[conversationId] = {
      id: conversationId,
      createdAt: new Date().toLocaleString(),
      messages: [],
      aiProvider: ''
    };
    this.saveConversations();
    this.renderConversation();
  }

  renderConversation() {
    const area = document.getElementById('conversationArea');
    const conv = this.conversations[this.currentConversationId];

    area.innerHTML = '';

    if (!conv || !conv.messages.length) {
      area.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">Nouvelle conversation. Clique sur une action ou écris une question.</p>';
    } else {
      conv.messages.forEach(msg => {
        const msgEl = document.createElement('div');
        msgEl.className = `message ${msg.role}`;
        msgEl.textContent = msg.content;
        area.appendChild(msgEl);
      });
    }

    area.scrollTop = area.scrollHeight;
  }

  setupEventListeners() {
    document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
    document.getElementById('userInput').addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') this.sendMessage();
    });

    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.executeAction(e.target.closest('.action-btn').dataset.action);
      });
    });

    document.getElementById('settingsBtn').addEventListener('click', () => {
      browser.runtime.openOptionsPage();
    });

    document.getElementById('deleteConvBtn').addEventListener('click', () => {
      this.deleteConversation();
    });

    document.getElementById('aiProvider').addEventListener('change', (e) => {
      this.conversations[this.currentConversationId].aiProvider = e.target.value;
      this.saveConversations();
    });
  }

  async sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (!text) return;

    const aiProvider = document.getElementById('aiProvider').value;
    if (!aiProvider) {
      alert('Veuillez choisir une IA.');
      return;
    }

    const conv = this.conversations[this.currentConversationId];
    conv.messages.push({ role: 'user', content: text });
    conv.aiProvider = aiProvider;
    input.value = '';
    this.renderConversation();
    this.saveConversations();

    const pageContent = await this.getPageContent();

    this.showLoading(true);
    try {
      const response = await fetch(`${this.backendUrl}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          aiProvider: aiProvider,
          pageContent: pageContent,
          conversationHistory: conv.messages.slice(0, -1)
        })
      });

      if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);

      const data = await response.json();
      conv.messages.push({ role: 'ai', content: data.response });
      this.saveConversations();
      this.renderConversation();
    } catch (error) {
      conv.messages.push({ role: 'error', content: `Erreur : ${error.message}` });
      this.saveConversations();
      this.renderConversation();
    } finally {
      this.showLoading(false);
    }
  }

  async executeAction(action) {
    const aiProvider = document.getElementById('aiProvider').value;
    if (!aiProvider) {
      alert('Veuillez choisir une IA.');
      return;
    }

    const prompts = {
      summarize: 'Résume le contenu principal de cette page en 3-4 points clés.',
      explain: 'Explique les concepts clés de cette page de manière simple.',
      extract: 'Extrais les 5 points les plus importants de cette page.',
      translate: 'Traduis le contenu principal en anglais.'
    };

    document.getElementById('userInput').value = prompts[action];
    setTimeout(() => this.sendMessage(), 100);
  }

  async getPageContent() {
    return new Promise((resolve) => {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { action: 'getPageContent' }).then((response) => {
          resolve(response?.content || 'Contenu indisponible.');
        }).catch(() => {
          resolve('Contenu indisponible.');
        });
      });
    });
  }

  deleteConversation() {
    const confirmed = confirm('Êtes-vous sûr ? Cette conversation sera supprimée.');
    if (!confirmed) return;

    delete this.conversations[this.currentConversationId];
    const remaining = Object.keys(this.conversations);

    if (remaining.length === 0) {
      this.createNewConversation();
    } else {
      this.currentConversationId = remaining[0];
      this.saveConversations();
      this.renderConversation();
    }
  }

  showLoading(show) {
    document.getElementById('loadingIndicator').classList.toggle('hidden', !show);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});