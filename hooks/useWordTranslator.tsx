import { useEffect, useRef, useCallback } from 'react';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

type TranslationCache = Map<string, string>;

export const useWordTranslator = (
  containerRef: React.RefObject<HTMLElement>,
  sourceLang: string = 'ta', // target language of the sentence (e.g., Tamil)
  targetLang: string = 'en'   // user's known language
) => {
  const workerRef = useRef<Worker | null>(null);
  const cacheRef = useRef<TranslationCache>(new Map());
  const pendingRef = useRef<Map<string, Promise<string>>>(new Map());

  // Initialize worker
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

  // Helper to get translation
  const getTranslation = useCallback(async (word: string): Promise<string> => {
    if (cacheRef.current.has(word)) return cacheRef.current.get(word)!;
    if (pendingRef.current.has(word)) return pendingRef.current.get(word)!;
    const promise = new Promise<string>((resolve) => {
      if (!workerRef.current) {
        resolve(word); // fallback if no worker
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

  // Attach tippy to every text node inside container
  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll('.word-tippy');
    elements.forEach((el) => {
      const word = el.getAttribute('data-word');
      if (!word) return;
      tippy(el, {
        content: 'Loading...',
        placement: 'top',
        theme: 'light',
        arrow: true,
        interactive: false,
        onShow: async (instance) => {
          const translation = await getTranslation(word);
          instance.setContent(translation);
        }
      });
    });
  }, [containerRef, getTranslation]);

  // Utility to parse sentences and wrap words in spans
  const parseAndWrapWords = useCallback((sentence: string): string => {
    // Simple tokenization (split on spaces and punctuation)
    // You can improve with a proper tokenizer for Indian languages
    const words = sentence.split(/(\s+)/);
    return words.map(part => {
      const trimmed = part.trim();
      if (trimmed && !/[\s]/.test(trimmed)) {
        // Check if it's a word (not just punctuation)
        const wordOnly = trimmed.replace(/[.,!?;:]/g, '');
        if (wordOnly.length > 0) {
          return `<span class="word-tippy cursor-pointer border-b border-dotted border-gray-400" data-word="${wordOnly}">${part}</span>`;
        }
      }
      return part;
    }).join('');
  }, []);
};