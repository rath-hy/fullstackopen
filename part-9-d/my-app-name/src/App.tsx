import type { JSX } from "react";

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartWithDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartWithDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartWithDescription {
  requirements: string[];
  kind: "special",
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group"
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
    kind: "background"
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
  {
    name: "Backend development",
    exerciseCount: 21,
    description: "Typing the backend",
    requirements: ["nodejs", "jest"],
    kind: "special"
  }
];

const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

interface HeaderProps {
  name: string,
};

const Part = ({part}: {part: CoursePart}) => {
  switch (part.kind) {
    case "basic":
      return (
        <p>
          <div><strong>{part.name} {part.exerciseCount}</strong></div>
          <div><em>{part.description}</em></div>
        </p>)
    case "group":
      return (
        <p>
          <div><strong>{part.name} {part.exerciseCount}</strong></div>
          <div>project exercises: {part.groupProjectCount}</div>
        </p>)
    case "background":
      return (
        <p>
          <div><strong>{part.name} {part.exerciseCount}</strong></div>
          <div><em>{part.description}</em></div>
          <div>submit to {part.backgroundMaterial}</div>
        </p>)
    case "special":
      return (
        <p>
          <div><strong>{part.name} {part.exerciseCount}</strong></div>
          <div><em>{part.description}</em></div>
          <div>required skills: {part.requirements.join(', ')}</div>
        </p>)
    default:
      return (<>error</>)
  }
}

const Header = (props: HeaderProps): JSX.Element => {
  return (
    <>
      <h1>{props.name}</h1>
    </>
  );
};

interface ContentProps {
  content: CoursePart[]
}

const Content = (props: ContentProps): JSX.Element => {
  return (
    <>
      {props.content.map(coursePart => (
        <Part part={coursePart}/>
      ))}
    </>
  )
};

interface TotalProps {
  total: number
}

const Total = (props: TotalProps) => {
  return (
    <>
      <p>Number of exercises: { props.total }</p>
    </>
  );
};

const App = () => {
  return (
    <div>
      <Header name="Half Stack Web Development"/>
      <Content content={courseParts}/>
      <Total total={totalExercises}/>
    </div>
  );
};

export default App;