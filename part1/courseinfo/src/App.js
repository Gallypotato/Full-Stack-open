const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}
const Content = (props) => {
  return (
    <div>
      <p>{props.part} {props.exercise}</p>
    </div>
  )
}
const Total = (props) => {
  return (
    <div>
      <p> Number of exercises {props.number}</p>
    </div>
  )
}


const App = () => {
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
      <Header course = {course.name}/>
      <Content part ={course.parts[0].name} exercise ={course.parts[0].exercises}/>
      <Content part ={course.parts[1].name} exercise ={course.parts[1].exercises}/>
      <Content part ={course.parts[2].name} exercise ={course.parts[2].exercises}/>
      <Total number = {course.parts[0].exercises+course.parts[1].exercises+course.parts[2].exercises}/>
    </div>
  )
}

export default App
