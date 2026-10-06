import React, { useEffect, useRef, useState } from "react";
import createSkycons from "skycons";
import axios from 'axios'
const forecast = [
  { day: "saturday", icon: "partly-cloudy-day", temp: "13c" },
  { day: "sunday", icon: "clear-day", temp: "16c" },
  { day: "monday", icon: "rain", temp: "11c" },
  { day: "tuesday", icon: "cloudy", temp: "12c" },
  { day: "wednesday", icon: "wind", temp: "14c" },
];

const WeatherSearch = () => {
  const mainIconRef = useRef(null);
  const forecastIconRefs = useRef([]);
  const [city, setCity]= useState('')
  const [loaded, setLoaded] = useState(false);
  const [weather, setWeather] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const Skycons = createSkycons(window);
    const skycons = new Skycons({
      color: "black",
    });

    if (mainIconRef.current) {
      skycons.add(mainIconRef.current, "partly-cloudy-day");
    }

    forecastIconRefs.current.forEach((iconRef, index) => {
      if (iconRef) {
        skycons.add(iconRef, forecast[index].icon);
      }
    });

    skycons.play();

    return () => {
      skycons.pause();
    };
  }, []);


   function displayWeather(response) {
    setLoaded(true);
    setError("");
    console.log('res=>,',response);

    setWeather({

      city: response.data.name,
      temperature: response.data.main.temp,
      wind: response.data.wind.speed,
      humidity: response.data.main.humidity,
      icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
      description: response.data.weather[0].description,
    });
  }


  const submitHandler=(e)=>{
    e.preventDefault()
    const searchedCity = city.trim();

    if (!searchedCity) {
      setError("Please enter a city name");
      return;
    }

    let apiKey = "874edff40504a9c9a744c7e4498f6f95";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchedCity)}&appid=${apiKey}&units=metric`;
    axios
      .get(apiUrl)
      .then(displayWeather)
      .catch(() => {
        setLoaded(false);
        setError("City not found. Check the spelling and try again.");
      });
  }

  return (
    <>
      <div className="p-10 pb-10 border border-gray-400 rounded max-w-125 h-auto">
        <div>
          <input
            type="text"
            value={city}
            onChange={(e)=>setCity(e.target.value)}
            className="border border-gray-400 rounded w-2/3 h-10"
          />{" "}
          <button onClick={submitHandler} className="bg-blue-600 p-2 rounded text-white">search</button>
        </div>
        {error && <p className="mt-3 text-red-600">{error}</p>}

        <div className="flex flex-col mt-5 text-gray-400">
          <p className="font-bold text-xl">{weather.city}</p>
          <p>friday 12:05</p>
          <p>cloudy</p>
        </div>

        <div className="flex justify-between items-center mt-10">
          <span className="flex items-center gap-2">
            <canvas ref={mainIconRef} width="64" height="64" />
            14c
          </span>
          <span className="flex flex-col pl-10 w-1/2">
            <p>precit :80%</p>
            <p>wind:85km/h</p>
          </span>
        </div>

        <div className="flex justify-between gap-4 mt-10">
          {forecast.map((item, index) => (
            <div className="flex flex-col items-center" key={item.day}>
              <p>{item.day}</p>
              <canvas
                ref={(element) => {
                  forecastIconRefs.current[index] = element;
                }}
                width="42"
                height="42"
              />
              <p>{item.temp}</p>
            </div>
          ))}
        </div>
      </div>
      <h1 className="mt-10 pl-10">repository github link : sdfsfs</h1>
    </>
  );
};

export default WeatherSearch;
