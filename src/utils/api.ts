import type { WeatherData, WeatherError, GeocodingData } from '../types/weather';

export async function searchCities(query: string): Promise<GeocodingData[]> {
  try {
    const response = await fetch(
      `/api/geocode?city=${encodeURIComponent(query)}`
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
      `/api/weather?lat=${lat}&lon=${lon}`
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