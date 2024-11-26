import React from 'react';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow, 
  CloudLightning, 
  CloudFog, 
  CloudDrizzle 
} from 'lucide-react';

interface WeatherIconProps {
  weatherMain: string;
  className?: string;
}

export function WeatherIcon({ weatherMain, className = "w-20 h-20" }: WeatherIconProps) {
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return <Sun className={`${className} text-yellow-400`} />;
    case 'rain':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'snow':
      return <CloudSnow className={`${className} text-blue-200`} />;
    case 'thunderstorm':
      return <CloudLightning className={`${className} text-purple-400`} />;
    case 'drizzle':
      return <CloudDrizzle className={`${className} text-blue-300`} />;
    case 'mist':
    case 'fog':
    case 'haze':
      return <CloudFog className={`${className} text-gray-400`} />;
    default:
      return <Cloud className={`${className} text-gray-400`} />;
  }
}