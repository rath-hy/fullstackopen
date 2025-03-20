import { useEffect, useState } from 'react'
import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    axios
      .get(`${baseUrl}/name/${name}`)
      .then(response => {
        setCountry(response.data)
      })


  }, [])
}