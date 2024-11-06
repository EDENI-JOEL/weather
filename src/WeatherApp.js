import React, { useState, useEffect } from 'react';
import './WeatherApp.css';

const API_KEY = '5f76b4a15246e53e38f042637f8e7574';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

function WeatherApp() {
  const [city, setCity] = useState('Lagos');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    fetchWeatherData(city);
  }, []);

  const kelvinToCelsius = (kelvin) => Math.round(kelvin - 273.15);

  const fetchWeatherData = async (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch current weather
      const weatherResponse = await fetch(`${WEATHER_API_URL}?q=${cityName}&appid=${API_KEY}`);
      const weatherResult = await weatherResponse.json();
      if (weatherResult.cod !== 200) throw new Error(weatherResult.message);
      setWeatherData(weatherResult);

      // Fetch forecast data
      const forecastResponse = await fetch(`${FORECAST_API_URL}?q=${cityName}&appid=${API_KEY}`);
      const forecastResult = await forecastResponse.json();
      if (forecastResult.cod !== "200") throw new Error(forecastResult.message);
      
      // Get next 4 forecasts (3-hour intervals)
      const nextFourForecasts = forecastResult.list.slice(0, 4);
      setForecastData(nextFourForecasts);

    } catch (err) {
      console.log(err);
      setError('City not found or network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
    setIsTyping(true);
    
    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      setIsTyping(false);
      if (value.trim()) {
        fetchWeatherData(value);
      }
    }, 1000); // Wait for 1 second after user stops typing

    setTypingTimeout(timeout);
  };

  const handleSearch = () => {
    if (city.trim()) {
      setIsTyping(false);
      fetchWeatherData(city);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="weather-card">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={handleInputChange}
        />
        {loading && <div className="loading-spinner" />}
        <button onClick={handleSearch} disabled={loading || isTyping}>
          Search
        </button>
      </div>
      {error && !isTyping && <div className="error-message">{error}</div>}
      {weatherData && (
        <div className="weather-info">
          <div className="city">{`${weatherData.name}, ${weatherData.sys.country}`}</div>
          <div className="date">
            {new Date(weatherData.dt * 1000).toLocaleString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit',
            })}
          </div>
          <div className="weather-icon">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
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

          {forecastData && (
            <div className="forecast-section">
              <h3 className="forecast-title">4-Hour Forecast</h3>
              <div className="forecast-container">
                {forecastData.map((forecast, index) => (
                  <div key={index} className="forecast-item">
                    <div className="forecast-time">{formatTime(forecast.dt)}</div>
                    <img
                      src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                      alt="Weather Icon"
                      className="forecast-icon"
                    />
                    <div className="forecast-temp">
                      {`${kelvinToCelsius(forecast.main.temp)}°C`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WeatherApp;