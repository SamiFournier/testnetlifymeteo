import type { WeatherData, WeatherError, GeocodingData } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export async function searchCities(query: string): Promise<GeocodingData[]> {
  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)},fr&limit=5&type=city&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la recherche des villes');
    }

    const data = await response.json();
    return data as GeocodingData[];
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Impossible de rechercher les villes');
  }
}

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${API_KEY}`
    );

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as WeatherError;
      throw new Error(
        errorData.message || 
        `Erreur ${response.status}: Impossible de charger les données météo`
      );
    }

    if (!data.main?.temp || !data.weather?.[0]) {
      throw new Error('Format de données météo invalide');
    }

    return data as WeatherData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur réseau: Impossible de contacter le serveur météo');
  }
}