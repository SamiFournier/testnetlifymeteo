import React from 'react';
import { ThermometerSun, Wind, Droplets, Umbrella } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';
import type { WeatherData, ForecastData } from '../types/weather';

interface WeatherCardProps {
  current: WeatherData;
  forecast: ForecastData;
}

export function WeatherCard({ current, forecast }: WeatherCardProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDailyForecast = () => {
    // Get one forecast per day (excluding today)
    const dailyForecasts = forecast.list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!acc[date] && new Date(item.dt * 1000).getDate() !== new Date().getDate()) {
        acc[date] = item;
      }
      return acc;
    }, {} as Record<string, typeof forecast.list[0]>);

    return Object.values(dailyForecasts).slice(0, 3);
  };

  return (
    <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 max-w-2xl w-full backdrop-blur-lg weather-card">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Météo à {current.name}
        </h1>
        <p className="text-gray-600">{formatDate(current.dt)}</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex flex-col items-center mb-4 md:mb-0">
          <WeatherIcon weatherMain={current.weather[0].main} />
          <p className="text-4xl font-bold text-gray-800 mt-4">
            {Math.round(current.main.temp)}°C
          </p>
          <p className="text-gray-600 capitalize mt-2">
            {current.weather[0].description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors">
            <div className="flex items-center gap-2">
              <ThermometerSun className="text-orange-500" />
              <span className="text-gray-700">Ressenti</span>
            </div>
            <p className="text-2xl font-semibold text-gray-800 mt-2">
              {Math.round(current.main.feels_like)}°C
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors">
            <div className="flex items-center gap-2">
              <Wind className="text-blue-500" />
              <span className="text-gray-700">Vent</span>
            </div>
            <p className="text-2xl font-semibold text-gray-800 mt-2">
              {Math.round(current.wind.speed * 3.6)} km/h
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors">
            <div className="flex items-center gap-2">
              <Droplets className="text-blue-500" />
              <span className="text-gray-700">Humidité</span>
            </div>
            <p className="text-2xl font-semibold text-gray-800 mt-2">
              {current.main.humidity}%
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors">
            <div className="flex items-center gap-2">
              <ThermometerSun className="text-red-500" />
              <span className="text-gray-700">Max/Min</span>
            </div>
            <p className="text-lg font-semibold text-gray-800 mt-2">
              {Math.round(current.main.temp_max)}° / {Math.round(current.main.temp_min)}°
            </p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Prévisions sur 3 jours</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getDailyForecast().map((day, index) => (
            <div key={index} className="bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors">
              <p className="font-medium text-gray-700">{formatDate(day.dt)}</p>
              <div className="flex items-center justify-between mt-2">
                <WeatherIcon weatherMain={day.weather[0].main} className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-xl font-semibold text-gray-800">
                    {Math.round(day.main.temp)}°C
                  </p>
                  <p className="text-sm text-gray-600">
                    {Math.round(day.main.temp_min)}° / {Math.round(day.main.temp_max)}°
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                <Umbrella className="w-4 h-4" />
                <span>{Math.round(day.pop * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Dernière mise à jour : {formatTime(current.dt)}
      </div>
    </div>
  );
}