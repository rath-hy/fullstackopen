import express from 'express'
import { calculateBmi } from './bmiCalculator'

const app = express()

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!')
})


app.get('/bmi', (req, res) => {
  const { height, weight } = req.query

  if (!height || !weight) {
    res.status(400).json({
      error: 'missing parameters'
    })
  }

  const heightInCm = Number(height)
  const weightInKg = Number(weight)

  if (isNaN(heightInCm) || isNaN(weightInKg)) {
    res.status(400).json({
      error: 'malformatted parameters'
    })
  }

  const reponse = {
    height: heightInCm,
    weight: weightInKg,
    bmi: calculateBmi(heightInCm, weightInKg)
  }

  res.json(reponse)
})

const PORT = 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})