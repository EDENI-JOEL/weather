import React, { useState, useEffect } from 'react';
import './WeatherApp.css';

const API_KEY = 'e5f76b4a15246e53e38f042637f8e7574';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

function WeatherApp() {
  const [city, setCity] = useState('Lagos');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData(city);
  },);

  const kelvinToCelsius = (kelvin) => Math.round(kelvin - 273.15);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}`);
      const data = await response.json();
      if (data.cod !== 200) throw new Error(data.message);
      setWeatherData(data);
    } catch (err) {
      console.log(err)
      setError('City not found or network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (city.trim()) fetchWeatherData(city);
    else setError('Please enter a city name');
  };

  return (
    <div className="weather-card">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        {loading && <div className="loading-spinner" />}
        <button onClick={handleSearch} disabled={loading}>
          Search
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {weatherData && (
        <div className="weather-info">
          <div className="city">{`${weatherData.name}, ${weatherData.sys.country}`}</div>
          <div className="date">
            {new Date(weatherData.dt * 1000).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </div>
          <div className="weather-icon">
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="Weather Icon"
            />
          </div>
          <div className="temperature">{`${kelvinToCelsius(weatherData.main.temp)}°C`}</div>
          <div className="weather-condition">
            {weatherData.weather[0].description
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </div>
          <div className="weather-details">
            <div className="detail">
              <div className="detail-label">Humidity</div>
              <div className="detail-value">{`${weatherData.main.humidity}%`}</div>
            </div>
            <div className="detail">
              <div className="detail-label">Wind</div>
              <div className="detail-value">{`${Math.round(weatherData.wind.speed * 3.6)} km/h`}</div>
            </div>
            <div className="detail">
              <div className="detail-label">Feels Like</div>
              <div className="detail-value">{`${kelvinToCelsius(weatherData.main.feels_like)}°C`}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
