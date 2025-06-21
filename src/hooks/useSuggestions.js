import { useState, useMemo, useCallback, useEffect } from 'react';

export const useSuggestions = (value, wordList, fuseInstance) => {
  const [suggestions, setSuggestions] = useState([]);
  const [frequentWords, setFrequentWords] = useState({});
  const suggestionCache = useMemo(() => new Map(), []);

  const updateFrequentWords = useCallback((text) => {
    const safeText = typeof text === 'string' ? text : '';
    const words = safeText.trim().split(/\s+/).filter(word => word);
    setFrequentWords(prev => {
      const updated = { ...prev };
      words.forEach(word => {
        updated[word] = (updated[word] || 0) + 1;
      });
      return updated;
    });
  }, []);

  const getSuggestions = useCallback(() => {
    if (!fuseInstance || !wordList || !wordList.length) {
      return [];
    }

    const words = value.trim().split(/\s+/);
    const lastWord = words[words.length - 1]?.toLowerCase() || '';

    // Ignorar palavras com mais de 15 caracteres
    if (lastWord.length > 15) {
      return [];
    }

    if (lastWord.length < 2) {
      return [];
    }

    const cacheKey = lastWord;
    if (suggestionCache.has(cacheKey)) {
      return suggestionCache.get(cacheKey);
    }

    const fuseResults = fuseInstance.search(lastWord, { limit: 5 }).map(result => ({
      item: result.item,
      score: result.score,
    }));

    const frequent = Object.entries(frequentWords)
      .filter(([word]) => word.startsWith(lastWord))
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => ({ item: word, score: 0 }));

    const newSuggestions = [...frequent, ...fuseResults]
      .sort((a, b) => a.score - b.score)
      .map(result => result.item)
      .filter((item, index, self) => self.indexOf(item) === index)
      .slice(0, 3);

    suggestionCache.set(cacheKey, newSuggestions);
    return newSuggestions;
  }, [value, wordList, fuseInstance, frequentWords, suggestionCache]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newSuggestions = getSuggestions();
      setSuggestions(newSuggestions);
    }, 150);
    return () => clearTimeout(timeout);
  }, [value, getSuggestions]);

  return { suggestions, updateFrequentWords };
};