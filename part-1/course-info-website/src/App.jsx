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
      <p>
        {partAndExerciseCountArray[0][0]} {partAndExerciseCountArray[0][1]}
      </p>
      <p>
        {partAndExerciseCountArray[1][0]} {partAndExerciseCountArray[1][1]}
      </p>
      <p>
        {partAndExerciseCountArray[2][0]} {partAndExerciseCountArray[2][1]}
      </p>
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

export default App