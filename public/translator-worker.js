// public/translator-worker.js
self.onmessage = async (e) => {
    const { word, sourceLang, targetLang } = e.data;
    // 1. Check cache (optional – you can also cache in main thread)
    // 2. Translate using a local model or fetch an API
    // For demo, we call a mock endpoint (replace with your IndicTrans2 API)
    const response = await fetch('/api/translate-word', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, source: sourceLang, target: targetLang })
    });
    const data = await response.json();
    self.postMessage({ word, translation: data.translation });
  };