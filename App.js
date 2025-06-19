import React, { useState, useEffect } from 'react';
import { WiDaySunny, WiRain, WiSnow, WiThunderstorm, WiCloudy, WiNightClear, WiDayCloudy } from 'weather-icons-react';
import './App.css';

const WeatherSimulator = () => {
  const [city, setCity] = useState('Delhi');
  const [forecast, setForecast] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getRandom = (min, max) => min + Math.random() * (max - min);

  const getSeason = (month) => {
    if (month >= 3 && month <= 5) return 'Summer';
    if (month >= 6 && month <= 9) return 'Monsoon';
    if (month >= 10 || month <= 2) return 'Winter';
    return 'Unknown';
  };

  const generateWeather = (isNight) => {
    const month = currentTime.getMonth() + 1;
    const season = getSeason(month);

    let temp = 0;
    if (season === 'Summer') temp = getRandom(32, 44);
    else if (season === 'Monsoon') temp = getRandom(25, 34);
    else if (season === 'Winter') temp = getRandom(12, 24);
    if (isNight) temp -= getRandom(2.5, 6);

    let humidity = 0;
    if (season === 'Monsoon') humidity = getRandom(75, 95);
    else if (season === 'Summer') humidity = getRandom(30, 50);
    else humidity = getRandom(40, 65);

    let wind = 0;
    if (season === 'Monsoon') wind = getRandom(10, 35);
    else wind = getRandom(5, 20);

    let weatherIcon = null;
    let weatherDesc = '';
    let weatherColor = '';

    if (season === 'Monsoon') {
      if (humidity > 85 && wind > 20) {
        weatherIcon = <WiThunderstorm size={80} color="#FFD700" />;
        weatherDesc = 'Thunderstorm ⚡';
        weatherColor = '#FFD700';
      } else if (humidity > 75) {
        weatherIcon = <WiRain size={80} color="#ADD8E6" />;
        weatherDesc = 'Rainy 🌧️';
        weatherColor = '#ADD8E6';
      } else {
        weatherIcon = <WiCloudy size={80} color="#E0E0E0" />;
        weatherDesc = 'Humid & Cloudy ☁️';
        weatherColor = '#E0E0E0';
      }
    } else if (season === 'Summer') {
      if (temp > 40) {
        weatherIcon = <WiDaySunny size={80} color="#FF8C00" />;
        weatherDesc = 'Extremely Hot 🔥';
        weatherColor = '#FF8C00';
      } else if (humidity < 30) {
        weatherIcon = <WiDaySunny size={80} color="#FFD700" />;
        weatherDesc = 'Dry and Sunny ☀️';
        weatherColor = '#FFD700';
      } else {
        weatherIcon = isNight ? <WiNightClear size={80} color="#9370DB" /> : <WiDayCloudy size={80} color="#FFD700" />;
        weatherDesc = isNight ? 'Warm Night 🌙' : 'Hot Day ☀️';
        weatherColor = isNight ? '#9370DB' : '#FFD700';
      }
    } else if (season === 'Winter') {
      if (temp < 15 && humidity < 50) {
        weatherIcon = isNight ? <WiSnow size={80} color="#87CEEB" /> : <WiCloudy size={80} color="#D3D3D3" />;
        weatherDesc = isNight ? 'Cold Night ❄️' : 'Cool & Cloudy ☁️';
        weatherColor = isNight ? '#87CEEB' : '#D3D3D3';
      } else {
        weatherIcon = <WiDayCloudy size={80} color="#90EE90" />;
        weatherDesc = 'Mild Winter Day 🌤️';
        weatherColor = '#90EE90';
      }
    }

    return {
      season,
      temp: temp.toFixed(1),
      humidity: humidity.toFixed(0),
      wind: wind.toFixed(1),
      weatherIcon,
      weatherDesc,
      weatherColor,
      isNight
    };
  };

  const generateWeeklyForecast = () => {
    const weekForecast = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      const isNight = i % 2 === 0; // Alternate between day and night
      weekForecast.push({
        ...generateWeather(isNight),
        date: new Date(forecastDate)
      });
    }
    setForecast(weekForecast);
  };

  useEffect(() => {
    generateWeeklyForecast();
  }, [city, currentTime]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return '🌞 Good Morning!';
    if (hours < 18) return '☀️ Good Afternoon!';
    return '🌙 Good Evening!';
  };

  return (
    <div className="weather-app">
      <div className="app-container">
        <div className="header">
          <h1>🇮🇳 Indian Weather Simulator</h1>
          <p>Real-time weather forecasts for Indian cities</p>
          <div className="greeting">{getGreeting()}</div>
          <div className="current-date">{formatDate(currentTime)}</div>
        </div>

        <div className="search-container">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="🔍 Enter city name..."
            className="city-input"
          />
          <button onClick={generateWeeklyForecast} className="search-button">
            Get Weather
          </button>
        </div>

        <div className="weekly-forecast">
          {forecast.map((day, idx) => (
            <div key={idx} className="forecast-day" style={{ backgroundColor: day.weatherColor }}>
              <div className="day-name">{formatDate(day.date)}</div>
              <div className="weather-icon">{day.weatherIcon}</div>
              <div className="temperature">{day.temp}°C</div>
              <div className="description">{day.weatherDesc}</div>
              <div className="details">
                <div>Humidity: {day.humidity}%</div>
                <div>Wind: {day.wind} km/h</div>
                <div>Season: {day.season}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="footer">
          <p>© {new Date().getFullYear()} Indian Weather Simulator | Made with ❤️ in India</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherSimulator; //hgjhjgjhj