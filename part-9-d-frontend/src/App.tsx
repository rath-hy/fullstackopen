import axios from "axios";
import { useEffect, useState, Fragment } from "react";


const baseUrl = 'http://localhost:3000/api/diaries'

const weatherOptions: string[] = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy'];

const visibilityOptions: string[] = ['great', 'good', 'okay', 'poor'];

interface Diary {
  id: string,
  date: string,
  weather: string,
  visibility: string,
  comment: string,
}

function App() {
  const [diaries, setDiaries] = useState<Diary[]>([])

  const NewDiaryForm = () => {
    const [date, setDate] = useState('')
    const [weather, setWeather] = useState('')
    const [visibility, setVisibility] = useState('')
    const [comment, setComment] = useState('')
  
    const diaryCreation = (event: React.SyntheticEvent) => {
      event.preventDefault()

      const newDiary = {
        date,
        weather,
        visibility,
        comment
      }

      console.log('newDiary', newDiary)
  
      axios.post<Diary>(baseUrl, newDiary).then(response => {
        setDiaries(diaries.concat(response.data))
      })
  
    }
  
  
    return (
      <form onSubmit={diaryCreation}>
        date:
        <div>
          <input 
            type="date"
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
  
        <div>
          weather:
          <fieldset>
            {
              weatherOptions.map(option => (
                <Fragment key={option}>
                  <input 
                    type="radio" 
                    id={`${option}-weather`}
                    value={option}
                    onChange={() => setWeather(option)}
                  />
                  <label htmlFor={`${option}-weather`}>{option}</label>
                </Fragment>
              ))
            }
          </fieldset>
        </div>
  
  
        <div>
          visibility:
  
          <fieldset>
            {
              visibilityOptions.map(option => (
                <Fragment key={option}>
                  <input 
                    type="radio" 
                    id={`${option}-visibility`}
                    value={option}
                    onChange={() => setVisibility(option)}
                  />
                  <label htmlFor={`${option}-visibility`}>{option}</label>
                </Fragment>
              ))
            }
          </fieldset>
  
          comment:
          <div>
            <input type="input" value={comment} onChange={(e) => setComment(e.target.value)}/>
          </div>
  
          <button type="submit">add</button>
        </div>
  
  
  
  
  
      </form>
    )
  }

  useEffect(() => {
    try {
      axios.get(baseUrl).then(response => {
        console.log(response.data)
        setDiaries(response.data)
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.status)
        console.error(error.response);
      } else {
        console.error(error)
      }
    }

  }, [])

  return (
    <>
      <h1>Diary Entires</h1>

      <NewDiaryForm />

      {
        diaries.map(item => (
          <div key={item.id}>
            <p><strong>{item.date}</strong></p>

            <div>visibility: {item.visibility}</div>
            <div> weather: {item.weather}</div>
              
          </div>
        ))
      }
    
    </>
  )
}

export default App
