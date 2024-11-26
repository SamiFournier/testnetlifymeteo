import type { WeatherData, ForecastData, GeocodingData } from '../types/weather';

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erreur réseau' }));
    throw new Error(errorData.error || 'Erreur réseau');
  }

  const data = await response.json();
  return data as T;
}

export async function fetchWeatherData(city: string) {
  try {
    // Appel à la fonction serverless pour obtenir les coordonnées
    const geoResponse = await fetch(`/api/geocode?city=${encodeURIComponent(city)}`);
    const geoData = await handleApiResponse<GeocodingData>(geoResponse);
    
    // Appel à la fonction serverless pour obtenir la météo
    const weatherResponse = await fetch(
      `/api/weather?lat=${geoData.lat}&lon=${geoData.lon}`
    );
    const weatherData = await handleApiResponse<WeatherData>(weatherResponse);

    return {
      current: {
        name: geoData.name,
        dt: weatherData.current.dt,
        main: {
          temp: weatherData.current.temp,
          feels_like: weatherData.current.feels_like,
          humidity: weatherData.current.humidity,
          temp_min: weatherData.daily[0].temp.min,
          temp_max: weatherData.daily[0].temp.max
        },
        weather: weatherData.current.weather,
        wind: {
          speed: weatherData.current.wind_speed
        },
        sys: {
          country: geoData.country
        }
      },
      forecast: {
        list: weatherData.daily.slice(1, 4).map(day => ({
          dt: day.dt,
          main: {
            temp: day.temp.day,
            temp_min: day.temp.min,
            temp_max: day.temp.max
          },
          weather: [day.weather[0]],
          pop: day.pop
        }))
      }
    };
  } catch (error) {
    console.error('API error:', error);
    if (error instanceof Error) {
      throw new Error(`Erreur: ${error.message}`);
    }
    throw new Error('Erreur réseau: Impossible de contacter le serveur météo');
  }
}