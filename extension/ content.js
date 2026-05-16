// content.js
// Injecté dans les pages pour extraire le contenu

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageContent') {
    const content = extractMainContent();
    sendResponse({ content });
  }
});

function extractMainContent() {
  // Retire les scripts, styles et éléments invisibles
  const cloned = document.documentElement.cloneNode(true);
  
  ['script', 'style', 'noscript', 'meta', 'link'].forEach(tag => {
    cloned.querySelectorAll(tag).forEach(el => el.remove());
  });

  // Récupère le texte
  let text = cloned.body?.innerText || cloned.innerText || '';
  
  // Limite à 10 000 caractères (respecte les limites d'API)
  if (text.length > 10000) {
    text = text.substring(0, 10000) + '\n[Contenu tronqué...]';
  }

  return text.trim();
}