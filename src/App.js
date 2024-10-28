import React from 'react';
import WeatherApp from './WeatherApp';
import logo from './logo.svg'; 

function App() {
  return (
    <div className="App">
      <img src={logo} alt="App Logo" className="app-logo" />
      <WeatherApp />
    </div>
  );
}

export default App;

