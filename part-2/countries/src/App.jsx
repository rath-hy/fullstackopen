import { useState, useEffect } from 'react'
import axios from 'axios'

// notes to self:
// what if db.json is removed?

function App() {
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState(null);                       //all countries data
  const [countriesToShow, setCountriesToShow] = useState(null); //filtered countries
  const [country, setCountry] = useState(null);                 //the only possible country (show in depth info)
  const [countryWeatherData, setCountryWeatherData] = useState(null);
  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }
  
  useEffect(() => {
    axios
      .get(`${baseUrl}/all`)
      .then((response) => {
        setData(response.data);
      })
  }, []); //reads in data for all countries once and never again

  useEffect(() => {
    if (data && inputValue) {
      const countriesShowable = data
        .filter(countryData => countryData.name.common.toLowerCase().includes(inputValue.toLowerCase()))

      setCountriesToShow(countriesShowable);
    } else {
      setCountriesToShow(null);
    }
  }, [data, inputValue]); //checks on countriesToShow every time input or data changes 
                          //(in case data is populated after input is typed)

  useEffect(() => {
    if (countriesToShow && countriesToShow.length === 1) {
      axios
        .get(`${baseUrl}/name/${countriesToShow[0].name.common}`) //countriesToShow is a list of <div>content</div>
        .then(response => setCountry(response.data))
    } else {
      setCountry(null);
    }
  }, [countriesToShow]) 

  useEffect(() => {
    if (country) {
      const latitude = country.capitalInfo.latlng[0]
      console.log('latitude', latitude)
      const longitude = country.capitalInfo.latlng[1]
      console.log('longitude', longitude)
      const units = 'metric'
      const apiKey = import.meta.env.VITE_WEATHER_KEY
      console.log('apikey', apiKey)

      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`)
        .then((response) => {
          console.log(response.data)
          setCountryWeatherData(response.data)
        }) 
      } else {
      setCountryWeatherData(null);
    }
  }, [country])

  const handleShow = (countryClickedOn) => {
    setCountriesToShow([countryClickedOn]); //shouldn't be necessary but okay
    setCountry(countryClickedOn);
  }

  return (
    <div>
      Find countries
      <input value={inputValue} onChange={handleInputChange}/>
      <CountryList countriesToShow={countriesToShow} country={country} handleShow={handleShow} countryWeatherData={countryWeatherData}/>
    </div>
  )
}

const CountryList = ({countriesToShow, country, handleShow, countryWeatherData}) => {
  if (countriesToShow === null) {
    return null;
  }

  if (countriesToShow.length > 10)
    return <div>Too many matches; please specify another filter.</div>;

  const countriesToShowWithButtons = countriesToShow.map((country, index) => 
    <div key={countriesToShow[index].name.official}>
      {country.name.common}
      <button onClick={() => handleShow(country)}>Show</button>
    </div>
  )

  if (countriesToShow.length > 1)
    return <div>{countriesToShowWithButtons}</div>;

  if (country && countryWeatherData) {
    const languagesArray = Object.values(country.languages)
    const languageCodesArray = Object.keys(country.languages)
    const imageUrl = `https://openweathermap.org/img/wn/${countryWeatherData.weather[0].icon}@2x.png`;

    return (
      <div>
          <h3>{country.name.official}</h3>
          <div>Capital: {country.capital}</div>
          <div>Area: {country.area}</div>
          <div>Languages:</div>
          <ul>
            {
              languagesArray.map((language, index) => 
                <li key={languageCodesArray[index]}>{language}</li>)
            }
          </ul>
          <img src={country.flags.png} width="auto" height="250"/>

          <h3>Weather in {country.capital}</h3>
          <div>Temperature: {countryWeatherData.main.temp} celsius</div>
          <img src={imageUrl} width="auto" height="100px"/>
          <div>Wind speed: {countryWeatherData.wind.speed} m/s</div>
      </div>
    );
  }

  return <div>No matches.</div>
}

export default App
