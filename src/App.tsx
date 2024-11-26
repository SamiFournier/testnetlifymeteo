import React, { useState } from 'react';
import { WeatherCard } from './components/WeatherCard';
import { SearchBar } from './components/SearchBar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { fetchWeatherData, searchCities } from './utils/api';
import type { WeatherData, GeocodingData } from './types/weather';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCitySelect = async (city: GeocodingData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherData(city.lat, city.lon);
      setWeather(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Erreur inattendue lors du chargement des données météo'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col items-center p-4 gap-4">
      <SearchBar onCitySelect={handleCitySelect} onSearch={searchCities} />
      
      {loading && <LoadingSpinner />}
      {error && <ErrorDisplay message={error} onRetry={() => setError(null)} />}
      {weather && !loading && !error && <WeatherCard weather={weather} />}
      
      {!weather && !loading && !error && (
        <div className="text-white text-center mt-8">
          <h2 className="text-2xl font-bold mb-2">Bienvenue sur Météo France</h2>
          <p>Recherchez une ville pour voir sa météo en temps réel</p>
        </div>
      )}
    </div>
  );
}

export default App;