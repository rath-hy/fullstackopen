interface ExerciseData {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

interface Rating {
  success: boolean
  rating: number,
  ratingDescription: string,
}

const rate = (average: number, target: number): Rating => {
  const successCoefficient = average / target 
  switch (true) {
    case (successCoefficient >= 1):
      return {
        success: true,
        rating: 3,
        ratingDescription: 'excellent',
      }

    case (successCoefficient >= 0.9):
      return {
        success: false,
        rating: 2,
        ratingDescription: 'not too bad but could be better',
      }
    
    case (successCoefficient >= 0.7):
      return {
        success: false,
        rating: 1,
        ratingDescription: 'slightly below acceptable',
      }
      
    case (successCoefficient < 0.7):
      return {
        success: false,
        rating: 0,
        ratingDescription:'absolutely horrible',
      }
    default:
      return {
        success: null,
        rating: null,
        ratingDescription: null,
      }
  }
}

const calculateExercises = (dailyExerciseHours: number[], target: number): ExerciseData => {
  const dailyAverage = dailyExerciseHours.reduce((a, b) => a + b) / dailyExerciseHours.length
  const rating = rate(dailyAverage, target)

  return {
    periodLength: dailyExerciseHours.length,
    trainingDays: dailyExerciseHours.filter(x => x !== 0).length,
    ...rating,
    target,
    average: dailyAverage
  }

}

// const dailyExerciseHours = JSON.parse(process.argv[2])
// const target = Number(process.argv[3])

const dailyExerciseHours = [3, 0, 2, 4.5, 0, 3, 1]
const target = 2

console.log(calculateExercises(dailyExerciseHours, target))


// { 
//   periodLength: 7,
//   trainingDays: 5,
//   success: false,
//   rating: 2,
//   ratingDescription: 'not too bad but could be better',
//   target: 2,
//   average: 1.9285714285714286
// }