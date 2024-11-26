import { Handler } from '@netlify/functions';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { city } = event.queryStringParameters || {};

    if (!city) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Le paramètre city est requis' }),
      };
    }

    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(city)},fr&limit=5&type=city&appid=${API_KEY}`
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: data.message || 'Erreur API géocodage' }),
      };
    }

    if (!data || !data.length) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Ville non trouvée' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erreur serveur' }),
    };
  }
};