import { useState, useEffect, useCallback } from 'react';

const API_URL_STATES = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome';

export const useLocation = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Busca os estados na montagem
  useEffect(() => {
    setLoadingStates(true);
    fetch(API_URL_STATES)
      .then(res => res.json()).then(setStates)
      .catch(err => console.error("Erro ao buscar estados:", err))
      .finally(() => setLoadingStates(false));
  }, []);

  // Busca as cidades quando um estado é selecionado
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
      .then(res => res.json()).then(setCities)
      .catch(err => console.error("Erro ao buscar cidades:", err))
      .finally(() => setLoadingCities(false));
  }, [selectedState]);

  // Função para buscar localização automaticamente
  const getUserLocation = useCallback((onCoordsFetched) => {
    if (navigator.geolocation) {
      setLoadingStates(true);
      setLoadingCities(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        // Chama o callback com as coordenadas obtidas
        if (onCoordsFetched) {
          onCoordsFetched({ latitude, longitude });
        }

        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const geoData = await geoRes.json();
          if (geoData.address) {
            const { state: stateName, city: cityName } = geoData.address;
            const matchingState = states.find(s => s.nome === stateName);
            if (matchingState) {
              setSelectedState(matchingState.sigla); // Isso vai disparar o useEffect para buscar cidades
              // A API do IBGE é rápida, mas esperamos um pouco para o React atualizar o state
              // e então selecionamos a cidade
              setTimeout(() => {
                setSelectedCity(cityName);
              }, 500); // Um pequeno delay para garantir que a lista de cidades foi carregada
            }
          }
        } catch (error) {
          console.error("Erro na geocodificação:", error);
        } finally {
            setLoadingStates(false);
            setLoadingCities(false);
        }
      }, (error) => {
        console.error("Erro ao obter geolocalização:", error);
        alert("Não foi possível obter sua localização.");
        setLoadingStates(false);
        setLoadingCities(false);
      });
    }
  }, [states]);

  return {
    states,
    cities,
    selectedState,
    setSelectedState,
    selectedCity,
    setSelectedCity,
    loadingStates,
    loadingCities,
    getUserLocation,
  };
};
