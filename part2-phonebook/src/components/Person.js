const Persons = ({ person, handleDelete }) => {
  return (
    <li>
      {person.name} {person.number}
      <button name={ person.name } id={ person.id } onClick={handleDelete}>delete</button>
      </li>
  )
  }

  export default Persons