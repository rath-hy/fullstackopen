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

export default Home