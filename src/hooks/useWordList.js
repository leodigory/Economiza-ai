import { useState, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';

export const useWordList = () => {
  const [wordList, setWordList] = useState([]);
  const [fuseInstance, setFuseInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWords = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [responseUtf8, responseNoAccents] = await Promise.all([
        fetch('/br-utf8.txt'),
        fetch('/br-sem-acentos.txt')
      ]);

      if (!responseUtf8.ok || !responseNoAccents.ok) {
        throw new Error('Falha ao carregar arquivos de palavras');
      }

      const [textUtf8, textNoAccents] = await Promise.all([
        responseUtf8.text(),
        responseNoAccents.text()
      ]);

      const wordsUtf8 = textUtf8
        .split(/\r?\n/)
        .map(word => word.trim())
        .filter(word => word && word.length > 1);

      const wordsNoAccents = textNoAccents
        .split(/\r?\n/)
        .map(word => word.trim())
        .filter(word => word && word.length > 1);

      const combinedWords = [...new Set([...wordsUtf8, ...wordsNoAccents])];
      setWordList(combinedWords);

      const fuse = new Fuse(combinedWords, {
        shouldSort: true,
        threshold: 0.4,
        minMatchCharLength: 1,
        includeScore: true,
        ignoreLocation: true,
        keys: ['item'],
        findAllMatches: false,
      });
      
      setFuseInstance(fuse);
    } catch (error) {
      setError(error.message);
      console.error('Erro ao carregar arquivos de palavras:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  return { wordList, fuseInstance, isLoading, error, reload: loadWords };
};