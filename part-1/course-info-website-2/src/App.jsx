const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 

    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return <Home courses={courses} />
}

const Home = ({courses}) => {
  return (
    <div>
      {courses.map(course => <Course course={course} key={course.id}/>)}
    </div>
  );
}

const Course = ({course}) => {
  course.totalExerciseCount = course.parts.reduce((a, p) => a + p.exercises, 0);

  return (
    <div>
      <Header course={course}/>
      <Content parts={course.parts}/>
      <Total sum={course.totalExerciseCount}/>
    </div>
  );
}

const Header = ({ course }) => <h1>{course.name}</h1>

const Total = ({ sum }) => <strong><p>Total of {sum} exercises.</p></strong>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <div>
      {parts.map(part => <Part key={part.id} part={part}/>)}
  </div>

export default App