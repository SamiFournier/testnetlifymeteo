import React from 'react';
import { ThermometerSun, Wind, Droplets } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';
import type { WeatherData } from '../types/weather';

interface WeatherCardProps {
  weather: WeatherData;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 max-w-2xl w-full backdrop-blur-lg weather-card">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Météo à {weather.name}
        </h1>
        <p className="text-gray-600">{formatDate(weather.dt)}</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex flex-col items-center mb-4 md:mb-0">
          <WeatherIcon weatherMain={weather.weather[0].main} />
          <p className="text-4xl font-bold text-gray-800 mt-4">
            {Math.round(weather.main.temp)}°C
          </p>
          <p className="text-gray-600 capitalize mt-2">
            {weather.weather[0].description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors">
            <div className="flex items-center gap-2">
              <ThermometerSun className="text-orange-500" />
              <span className="text-gray-700">Ressenti</span>
            </div>
            <p className="text-2xl font-semibold text-gray-800 mt-2">
              {Math.round(weather.main.feels_like)}°C
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors">
            <div className="flex items-center gap-2">
              <Wind className="text-blue-500" />
              <span className="text-gray-700">Vent</span>
            </div>
            <p className="text-2xl font-semibold text-gray-800 mt-2">
              {Math.round(weather.wind.speed * 3.6)} km/h
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors">
            <div className="flex items-center gap-2">
              <Droplets className="text-blue-500" />
              <span className="text-gray-700">Humidité</span>
            </div>
            <p className="text-2xl font-semibold text-gray-800 mt-2">
              {weather.main.humidity}%
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Dernière mise à jour : {formatTime(weather.dt)}
      </div>
    </div>
  );
}