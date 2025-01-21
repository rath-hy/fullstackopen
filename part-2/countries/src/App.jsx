import { useState, useEffect } from 'react'
import axios from 'axios'

// notes to self:
// what if db.json is removed?

function App() {
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState(null);                       //all countries data
  const [countriesToShow, setCountriesToShow] = useState(null); //filtered countries
  const [country, setCountry] = useState(null);                 //the only possible country (show in depth info)

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
        .map(countryData => 
          <div key={countryData.name.common}>
            {countryData.name.common}
          </div>)
        
      setCountriesToShow(countriesShowable);
    } else {
      setCountriesToShow(null);
    }
  }, [inputValue]); //checks on countriesToShow every time input changes

  useEffect(() => {
    if (countriesToShow && countriesToShow.length === 1) {
      axios
        .get(`${baseUrl}/name/${countriesToShow[0].props.children}`) //countriesToShow is a list of <div>content</div>
        .then(response => setCountry(response.data))
    } else {
      setCountry(null);
    }
  }, [countriesToShow]) 

  return (
    <div>
      Find countries
      <input value={inputValue} onChange={handleInputChange}/>

      <CountryList countriesToShow={countriesToShow} country={country}/>
    </div>
  )
}

//can use components to make the request function simpler
const CountryList = ({countriesToShow, country}) => {
  if (countriesToShow === null) {
    return null;
  }

  if (countriesToShow.length > 10)
    return <div>Too many matches; please specify another filter.</div>;

  if (countriesToShow.length > 1)
    return <div>{countriesToShow}</div>;

  if (countriesToShow.length === 1 && country !== null) {
    const languagesArray = Object.values(country.languages)
    const languageCodesArray = Object.keys(country.languages)

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
      </div>
    );
  }

  return <div>No matches.</div>
}

export default App
