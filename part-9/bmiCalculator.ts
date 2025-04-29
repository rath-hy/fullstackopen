require.main === module

export const calculateBmi = (heightInCm: number, weightInKg: number): string => {
  const heightInMeters: number = heightInCm / 100
  const bmi: number = weightInKg / Math.pow(heightInMeters, 2)

  switch(true) {
    case (bmi <= 18.4):
      return 'underweight'
    case (bmi <= 24.9):
      return 'normal range'
    case (bmi <= 29.9):
      return 'overweight'
    case (bmi >= 29.9):
      return 'obese'
    default:
      return 'error'
  }
}

const heightInCm: number = Number(process.argv[2])
const weightInKg: number = Number(process.argv[3])

console.log(calculateBmi(heightInCm, weightInKg))