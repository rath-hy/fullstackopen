const App = () => {
  // const course = 'Half Stack application development'
  // const part1 = 'Fundamentals of React'
  // const exercises1 = 10
  // const part2 = 'Using props to pass data'
  // const exercises2 = 7
  // const part3 = 'State of a component'
  // const exercises3 = 14

  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header course={course}/>
      <Content partsArray={[part1, part2, part3]}/>
      <Total partsArray={[part1, part2, part3]}/>
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


function Content({partsArray}) {
  return (
    <>
      <Part part={partsArray[0]}></Part>
      <Part part={partsArray[1]}></Part>
      <Part part={partsArray[2]}></Part>
    </>
  );
}

function Total({partsArray}) {
  let totalExerciseCount = 0;
  for (let i = 0; i < 3; i++) {
    totalExerciseCount += partsArray[i].exercises;
  }

  return (
    <>
      <p>Number of exercises {totalExerciseCount}</p>
    </>
  );
}

function Part({part}) {
  return (
    <>
      <p>
        {part.name} {part.exercises}
      </p>
    </>
  );
}

export default App