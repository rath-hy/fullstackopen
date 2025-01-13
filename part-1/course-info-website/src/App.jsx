const App = () => {
  // const course = 'Half Stack application development'
  // const part1 = 'Fundamentals of React'
  // const exercises1 = 10
  // const part2 = 'Using props to pass data'
  // const exercises2 = 7
  // const part3 = 'State of a component'
  // const exercises3 = 14

  // const course = 'Half Stack application development'
  // const part1 = {
  //   name: 'Fundamentals of React',
  //   exercises: 10
  // }
  // const part2 = {
  //   name: 'Using props to pass data',
  //   exercises: 7
  // }
  // const part3 = {
  //   name: 'State of a component',
  //   exercises: 14
  // }

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )

}

function Header({course}) {
  return (
    <>
      <h1>{course.name}</h1>
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

function Content({course}) {
  return (
    <>
      <Part part={course.parts[0]}></Part>
      <Part part={course.parts[1]}></Part>
      <Part part={course.parts[2]}></Part>
    </>
  );
}

function Total({course}) {
  let totalExerciseCount = 0;
  for (let i = 0; i < course.parts.length; i++) {
    totalExerciseCount += course.parts[i].exercises;
  }

  return (
    <>
      <p>Number of exercises {totalExerciseCount}</p>
    </>
  );
}



export default App