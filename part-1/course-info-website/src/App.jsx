const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course}/>
      <Content partAndExerciseCountArray={[[part1, exercises1], [part2, exercises2], [part3, exercises3]]}/>
      <Total partAndExerciseCountArray={[[part1, exercises1], [part2, exercises2], [part3, exercises3]]}/>
    </div>
  )

}

function Header({course}) {
  return (
    <>
      <h1>{course}</h1>
    </>
  );
}


function Content({partAndExerciseCountArray}) {
  return (
    <>
      <Part partN={partAndExerciseCountArray[0][0]} exercisesN={partAndExerciseCountArray[0][1]}></Part>
      <Part partN={partAndExerciseCountArray[1][0]} exercisesN={partAndExerciseCountArray[1][1]}></Part>
      <Part partN={partAndExerciseCountArray[2][0]} exercisesN={partAndExerciseCountArray[2][1]}></Part>
    </>
  );
}

function Total({partAndExerciseCountArray}) {
  let totalExerciseCount = 0;
  for (let i = 0; i < 3; i++) {
    totalExerciseCount += partAndExerciseCountArray[i][1];
  }

  return (
    <>
      <p>Number of exercises {totalExerciseCount}</p>
    </>
  );
}

function Part({partN, exercisesN}) {
  return (
    <>
      <p>
        {partN} {exercisesN}
      </p>
    </>
  );
}

export default App