import { useCallback, useEffect, useRef } from 'react';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

type TranslationCache = Map<string, string>;

export const useWordTranslator = (sourceLang: string = 'ta', targetLang: string = 'en') => {
  const workerRef = useRef<Worker | null>(null);
  const cacheRef = useRef<TranslationCache>(new Map());
  const pendingRef = useRef<Map<string, Promise<string>>>(new Map());

  useEffect(() => {
    if (typeof window !== 'undefined' && !workerRef.current) {
      workerRef.current = new Worker('/translator-worker.js');
      workerRef.current.onmessage = (e) => {
        const { word, translation } = e.data;
        cacheRef.current.set(word, translation);
        pendingRef.current.delete(word);
      };
    }
    return () => workerRef.current?.terminate();
  }, []);

  const getTranslation = useCallback(async (word: string): Promise<string> => {
    if (cacheRef.current.has(word)) return cacheRef.current.get(word)!;
    if (pendingRef.current.has(word)) return pendingRef.current.get(word)!;
    const promise = new Promise<string>((resolve) => {
      if (!workerRef.current) {
        resolve(word);
        return;
      }
      const handler = (e: MessageEvent) => {
        if (e.data.word === word) {
          workerRef.current?.removeEventListener('message', handler);
          resolve(e.data.translation);
        }
      };
      workerRef.current.addEventListener('message', handler);
      workerRef.current.postMessage({ word, source: sourceLang, target: targetLang });
    });
    pendingRef.current.set(word, promise);
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

  const attachTooltips = useCallback(async (container: HTMLElement | null) => {
    if (!container) return;
    const elements = container.querySelectorAll('.word-tippy');
    if (elements.length === 0) return;

    // Collect all unique words
    const words = Array.from(elements)
      .map(el => el.getAttribute('data-word'))
      .filter((w): w is string => !!w);
    const uniqueWords = Array.from(new Set(words));  // fixed: replaced spread with Array.from

    // Pre‑fetch all translations (cached)
    await Promise.all(uniqueWords.map(word => getTranslation(word)));

    // Now create tooltips with the already‑known translation
    elements.forEach((el) => {
      const word = el.getAttribute('data-word');
      if (!word) return;
      const translation = cacheRef.current.get(word) || word;
      tippy(el, {
        content: translation,
        placement: 'top',
        theme: 'light',
        arrow: true,
        interactive: false,
      });
    });
  }, [getTranslation]);

  return { wrapWords, attachTooltips };
};