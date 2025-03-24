import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

export const useWordList = () => {
  const [wordList, setWordList] = useState([]);
  const [fuseInstance, setFuseInstance] = useState(null);

  useEffect(() => {
    const loadWords = async () => {
      try {
        const responseUtf8 = await fetch('/br-utf8.txt');
        const textUtf8 = await responseUtf8.text();
        const wordsUtf8 = textUtf8.split(/\r?\n/).map(word => word.trim()).filter(word => word);

        const responseNoAccents = await fetch('/br-sem-acentos.txt');
        const textNoAccents = await responseNoAccents.text();
        const wordsNoAccents = textNoAccents.split(/\r?\n/).map(word => word.trim()).filter(word => word);

        const combinedWords = [...new Set([...wordsUtf8, ...wordsNoAccents])];
        setWordList(combinedWords);

        const fuse = new Fuse(combinedWords, {
          shouldSort: true,
          threshold: 0.4,
          minMatchCharLength: 1,
          includeScore: true,
          ignoreLocation: true,
        });
        setFuseInstance(fuse);
      } catch (error) {
        console.error('Erro ao carregar arquivos de palavras:', error);
      }
    };

    loadWords();
  }, []);

  return { wordList, fuseInstance };
};