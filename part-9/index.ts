import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json())

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});


app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight) {
    res.status(400).json({
      error: 'missing parameters'
    });
  }

  const heightInCm = Number(height);
  const weightInKg = Number(weight);

  if (isNaN(heightInCm) || isNaN(weightInKg)) {
    res.status(400).json({
      error: 'malformatted parameters'
    });
  }

  const reponse = {
    height: heightInCm,
    weight: weightInKg,
    bmi: calculateBmi(heightInCm, weightInKg)
  };

  res.json(reponse);
});

app.post('/exercises', (req, res) => {
  const { daily_exercises, target } = req.body

  if (!daily_exercises || !target) {
    res.status(400).json({
      error: 'parameters missing'
    })
  } 

  if (
    isNaN(Number(target))
    || !Array.isArray(daily_exercises)
    || daily_exercises.length === 0
    || !daily_exercises.every(item => !isNaN(Number(item)))
  ) {
    res.status(400).json({
      error: 'malformatted parameters'
    })
  }

  const result = calculateExercises(daily_exercises.map(Number), Number(target))

  res.json(result)
})

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});