import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

  useEffect(() => {
      axios
        .get(`${baseUrl}/api/name/${name}`)
        .then(response => {
          setCountry({ ...response, found: true })
        })
        .catch(error => {
          if (error.response.status === 404) {
            setCountry({found: false})
          }
        })
  }, [name])

  // useEffect(() => {
  //   const fetchCountry = async () => {
  //     try {
  //       const response = await axios.get(`${baseUrl}/api/name/${name}`)
  //       setCountry({ ...response.data, found: true })
  //     } catch (error) {
  //       setCountry({ found: false })
  //     }
  //   }

  //   if (name) {
  //     fetchCountry()
  //   }
  // }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name.official} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flags.png} height='100' alt={`flag of ${country.data.name}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('name')
  // const [name, setName] = useState('')
  // const country = useCountry(name)

  const name = nameInput.value
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App