import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
 const [fontEffect, setFontEffect] = useState('');
 const [temperature, setTemperature] = useState(0);
 const [humidity, setHumidity] = useState(0);
 const [windSpeed, setWindSpeed] = useState(0);
 const [feelsLike, setFeelsLike] = useState(0);
 const [selectedCity, setSelectedCity] = useState(null);
 const [position, setPosition] = useState(null);
 const [iconUrl, setIconUrl] = useState(null);
 const [detailedLocation, setDetailedLocation] = useState('');
 const apiKey = 'a0c8fb273d2d76f558a84599bf8bff01';
 const [currentDate, setCurrentDate] = useState('');
 const [pressure, setPressure] = useState('');
 const [dewPoint, setDewPoint] = useState(0);
//  const [uvIndex, setUvIndex] = useState(0);
//  const [visibility, setVisibility] = useState('visible');
//  const [weatherCondition, setWeatherCondition] = useState('');

 function getWeather(city, latitude, longitude) {
  setSelectedCity(city);

  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    )
    .then((data) => {
      const temp = data.data.main.temp - 273.15; 
      const feelsLikeTemp = data.data.main.feels_like - 273.15; 
      const humidity = data.data.main.humidity;
      const windSpeed = data.data.wind.speed;
      const pressure = data.data.main.pressure; 
      const dewPointKelvin = calculateDewPoint(temp, humidity);
      // const uvIndex = data.data.uv;

      const iconUrl = data.data.weather[0].icon
        ? `http://openweathermap.org/img/wn/${data.data.weather[0].icon}@2x.png`
        : null;

      setFontEffect(fontEffect);
      setPosition(position);
      setDetailedLocation(detailedLocation);
      setTemperature(temp.toFixed(2));
      setFeelsLike(feelsLikeTemp.toFixed(2));
      setHumidity(humidity.toFixed(2));
      setWindSpeed(windSpeed.toFixed(2));
      setIconUrl(iconUrl);
      setPressure(pressure);
      setDewPoint(dewPoint);

      let calculatedPressure = ''; 
      if (temp >= 25) {
        calculatedPressure = 'High';
      } else if (temp >= 10 && temp < 25) {
        calculatedPressure = 'Medium';
      } else {
        calculatedPressure = 'Low';
      }
      setPressure(calculatedPressure);

      setDewPoint((dewPointKelvin - 273.15).toFixed(2)); 

    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
    });
}

function calculateDewPoint(temperature, humidity) {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100);
  return (b * alpha) / (a - alpha);
}

 function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, handleGeolocationError);
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
 }

 function handleGeolocationError(error) {
    console.error('Error getting geolocation:', error);
 }

 function showPosition(position) {
  setPosition({ latitude: position.coords.latitude, longitude: position.coords.longitude });

  axios
    .get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=en`
    )
    .then((data) => {
      getWeather(data.data.display_name, position.coords.latitude, position.coords.longitude);
      setDetailedLocation(data.data.address);
    })
    .catch((error) => {
      console.error('Error fetching reverse geocoding data:', error);
    });
}


 function getCurrentDate() {
  const dateObj = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString(undefined, options);
  setCurrentDate(formattedDate);
}

 useEffect(() => {
    getLocation();
    getCurrentDate();
 }, []);

 return (
  <>
    <header></header>
    <main className="weather-container">
      <h1 className={fontEffect}>My weather app</h1>
      <div className="date">
        <p>{currentDate}</p>
      </div>
      <div className='feels'>
        <p>{temperature}°C</p>
        <p><span className='judul'>Feels like: </span>{feelsLike}°C</p>
      </div>
      <div className="icon">
        {iconUrl && <img id='icon' src={iconUrl} alt='weather icon' />}
      </div>
      <div className="location">
          <p>{selectedCity}</p>
        </div>
      <div className="weather-details">
        <div className="weather-data">
          <p><span className='judul'>Pressure: </span>{pressure}</p>
          <p><span className='judul'>Humidity: </span>{humidity}%</p>
          <p><span className='judul'>Wind Speed: </span>{windSpeed}%</p>
          <p><span className='judul'>Dew Point: </span>{dewPoint}°C</p>
        </div>
      </div>
    </main>
    <footer></footer>
  </>
);



}

export default App;
