import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

export const useApiSuggestions = (text) => {
  const [suggestions, setSuggestions] = useState([]);
  const debouncedText = useDebounce(text, 200);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const trimmedText = debouncedText.trim();

      // Não busca sugestões se o campo estiver vazio ou terminar com espaço.
      if (!trimmedText || debouncedText.endsWith(' ')) {
        setSuggestions([]);
        return;
      }

      const words = trimmedText.split(/\s+/);
      const currentWord = words[words.length - 1];

      if (!currentWord) {
        setSuggestions([]);
        return;
      }

      try {
        const url = `https://api.dicionario-aberto.net/prefix/${encodeURIComponent(currentWord)}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Falha na requisição para a API Dicionario Aberto');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedSuggestions = data.map(item => ({ text: item.word }));
          setSuggestions(formattedSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Erro ao buscar sugestões de autocomplete:", error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedText]);

  return suggestions;
};
