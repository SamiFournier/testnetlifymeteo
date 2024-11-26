import React, { useEffect, useState } from 'react';
import { WeatherCard } from './components/WeatherCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { fetchWeatherData } from './utils/api';
import type { WeatherData, ForecastData } from './types/weather';

export default function App() {
  const [weather, setWeather] = useState<{ current: WeatherData; forecast: ForecastData } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const getWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherData('Paris');
      setWeather(data);
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Erreur inattendue lors du chargement des données météo'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(count => count + 1);
  };

  useEffect(() => {
    getWeather();
    
    // Rafraîchir les données toutes les 5 minutes
    const interval = setInterval(getWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [retryCount]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={handleRetry} />;
  if (!weather) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <WeatherCard current={weather.current} forecast={weather.forecast} />
    </div>
  );
}