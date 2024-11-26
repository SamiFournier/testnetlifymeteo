import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import type { GeocodingData } from '../types/weather';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  onCitySelect: (city: GeocodingData) => void;
  onSearch: (query: string) => Promise<GeocodingData[]>;
}

export function SearchBar({ onCitySelect, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Debounce la valeur de recherche
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Utilise la valeur debounced pour la recherche
  useEffect(() => {
    const searchCities = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const cities = await onSearch(debouncedQuery);
        setResults(cities);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    searchCities();
  }, [debouncedQuery, onSearch]);

  const handleSelect = (city: GeocodingData) => {
    onCitySelect(city);
    setQuery(city.name);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une ville..."
          className="w-full px-4 py-2 pl-10 bg-white bg-opacity-90 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute inset-y-0 left-3 flex items-center">
          {loading ? (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-10">
          {results.map((city) => (
            <button
              key={`${city.lat}-${city.lon}`}
              onClick={() => handleSelect(city)}
              className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
            >
              <span className="font-medium">{city.name}</span>
              {city.state && (
                <span className="text-gray-500 ml-1">({city.state})</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}