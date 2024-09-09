const Header = (props) => {
  return (
    <div>
      <h2>{props.name}</h2>
    </div>
  )
}
const Part = ({part}) => {
  return (
    <div>
      <p>{part.name} {part.exercises}</p>
    </div>
  )
}

const Total = ({total}) => {
  return (
    <div>
      <b> total of {total} exercises</b>
    </div>
  )
}

const Course = ({ course }) => {
    const total = course.parts.reduce( (sum,part) => sum + part.exercises, 0)
    return (
      <div>
        <Header name = {course.name}/>
        {course.parts.map(part => <Part key={part.id} part={part}/>)}
        <Total total = {total}/>
      </div>
    )
  }


const Courses = ({courses}) => {

    return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(course => <Course key={course.id} course={course}/>)}
    </div>
  )
}


  
  export default Courses