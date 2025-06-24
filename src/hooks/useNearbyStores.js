import { useState, useCallback } from 'react';

// Função para calcular a distância (fórmula de Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distância em km
};

// Função simples para buscar logo no Google Images
async function fetchLogoFromGoogle(name, address = '') {
  try {
    // Monta a query: nome + "logo"
    const searchTerms = [name, 'logo'].filter(Boolean).join(' ');
    const query = encodeURIComponent(searchTerms);
    const url = `https://www.google.com/search?q=${query}&tbm=isch`;

    // Delay para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

    // Usar proxy alternativo confiável
    let response;
    try {
      response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
    } catch (proxyError) {
      // Tenta fallback para allorigins se o corsproxy.io falhar
      try {
        response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
      } catch (alloriginsError) {
        console.error('❌ Ambos os proxies falharam:', proxyError, alloriginsError);
        return null;
      }
    }
    if (!response.ok) {
      return null;
    }
    const html = await response.text();

    // Extrai URLs de imagem do HTML
    const imgMatches = html.match(/https?:\/\/[^"'\s]+\.(?:png|jpg|jpeg|webp)(?:\?[^"'\s]*)?/gi);

    if (imgMatches && imgMatches.length > 0) {
      // Filtra URLs válidas
      const validUrls = imgMatches.filter(url => {
        const isValid = !url.includes('googleusercontent') &&
                       !url.includes('gstatic.com') &&
                       !url.includes('google.com') &&
                       !url.includes('via.placeholder.com') &&
                       url.length > 20;
        return isValid;
      });

      if (validUrls.length > 0) {
        const logoUrl = validUrls[0];
        return logoUrl;
      } else {
      }
    } else {
    }
  } catch (e) {
    console.error('❌ Erro ao buscar logo:', e);
  }

  return null;
}

export const useNearbyStores = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNearbyStores = useCallback(async (latitude, longitude) => {
    setLoading(true);
    setError(null);

    const radius = 5000; // 5km de raio
    const query = `
      [out:json];
      (
        node["shop"="supermarket"](around:${radius},${latitude},${longitude});
        way["shop"="supermarket"](around:${radius},${latitude},${longitude});
        relation["shop"="supermarket"](around:${radius},${latitude},${longitude});
      );
      out center;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const stores = data.elements.reduce((acc, element) => {
        const name = element.tags?.name;

        // Só adiciona na lista se o mercado tiver um nome
        if (name) {
          const lat = element.lat || element.center.lat;
          const lon = element.lon || element.center.lon;
          const tags = element.tags || {};

          const street = tags['addr:street'] || '';
          const housenumber = tags['addr:housenumber'] || '';
          const bairro = tags['addr:suburb'] || tags['addr:neighbourhood'] || '';

          // Formata o endereço de forma limpa
          const address = [street, housenumber, bairro].filter(Boolean).join(', ');

          acc.push({
            id: element.id,
            osm_id: element.id,
            name: name,
            icon: '🛒',
            isCustom: false,
            distance: calculateDistance(latitude, longitude, lat, lon),
            coords: { lat, lon },
            address: address || 'Endereço não disponível'
          });
        }

        return acc;
      }, []).sort((a, b) => a.distance - b.distance); // Ordena por distância

      setLoading(false);
      return stores;

    } catch (e) {
      console.error("Erro ao buscar lojas próximas:", e);
      setError(e);
      setLoading(false);
      return [];
    }
  }, []);

  return { fetchNearbyStores, loading, error };
};

export { fetchLogoFromGoogle };
