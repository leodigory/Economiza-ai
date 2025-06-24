// Função para gerar iniciais a partir de um texto (nome ou email)
export const generateInitials = text => {
  if (!text) return '?';
  const words = text.split(' ').filter(word => word.length > 0);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return words
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 3);
};

// Função para gerar cor única baseada no texto
export const generateColor = text => {
  const colors = [
    '#4CAF50',
    '#2196F3',
    '#FF9800',
    '#9C27B0',
    '#607D8B',
    '#795548',
    '#E91E63',
    '#00BCD4',
    '#8BC34A',
    '#FF5722',
    '#3F51B5',
    '#009688',
    '#FFC107',
    '#673AB7',
    '#FFEB3B',
  ];
  const hash = text
    .split('')
    .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & a, 0);
  return colors[Math.abs(hash) % colors.length];
};
