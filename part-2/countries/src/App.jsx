import { useState, useEffect } from 'react'
import axios from 'axios'

// notes to self:
// what if db.json is removed?

function App() {
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
  
  useEffect(() => {
    axios
      .get(baseUrl)
      .then( (response) => {
        // console.log(response.data);
        setData(response.data);
      })
  }, []);

  return (
    <>
      Find countries
      <input value={inputValue} onChange={handleInputChange}/>

      <CountryList data={data} inputValue={inputValue}/>
    </>
  )
}

const CountryList = ({data, inputValue}) => {
  if (!data) {
    return null;
  }

  const countriesShowable = data
    .filter(countryData => countryData.name.common.toLowerCase().includes(inputValue.toLowerCase()))
    .map(countryData => 
      <div key={countryData.name.common}>
        {countryData.name.common}
      </div>)

  if (countriesShowable.length > 10) {
    return (
      <div>
        Too many matches; please specify another filter.
      </div>
    );
  }

  return (
    <div>{countriesShowable}</div>
  );
}

export default App
