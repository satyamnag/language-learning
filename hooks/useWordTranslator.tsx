import { useCallback, useRef } from 'react';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

type TranslationCache = Map<string, string>;

export const useWordTranslator = (sourceLang: string = 'ta', targetLang: string = 'en') => {
  const cacheRef = useRef<TranslationCache>(new Map());
  const pendingRef = useRef<Map<string, Promise<string>>>(new Map());

  const getTranslation = useCallback(async (word: string): Promise<string> => {
    if (cacheRef.current.has(word)) return cacheRef.current.get(word)!;
    if (pendingRef.current.has(word)) return pendingRef.current.get(word)!;
    const promise = fetch('/api/translate-word', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, source: sourceLang, target: targetLang })
    })
      .then(res => res.json())
      .then(data => data.translation || word)
      .catch(() => word);
    pendingRef.current.set(word, promise);
    promise.then(translation => {
      cacheRef.current.set(word, translation);
      pendingRef.current.delete(word);
    });
    return promise;
  }, [sourceLang, targetLang]);

  const wrapWords = useCallback((sentence: string): string => {
    const words = sentence.split(/(\s+)/);
    return words.map(part => {
      const trimmed = part.trim();
      if (trimmed && !/[\s]/.test(trimmed)) {
        const wordOnly = trimmed.replace(/[.,!?;:]/g, '');
        if (wordOnly.length > 0) {
          return `<span class="word-tippy cursor-pointer border-b border-dotted border-gray-400" data-word="${wordOnly}">${part}</span>`;
        }
      }
      return part;
    }).join('');
  }, []);

  const attachTooltips = useCallback((container: HTMLElement | null) => {
    if (!container) return;
    const elements = container.querySelectorAll('.word-tippy');
    elements.forEach((el) => {
      const word = el.getAttribute('data-word');
      if (!word) return;
      let isLoading = false;
      tippy(el, {
        content: 'Loading...',
        placement: 'top',
        theme: 'light',
        arrow: true,
        interactive: false,
        onShow: (instance) => {
          if (!isLoading) {
            isLoading = true;
            getTranslation(word).then(translation => {
              instance.setContent(translation);
            });
          }
        }
      });
    });
  }, [getTranslation]);

  return { wrapWords, attachTooltips };
};