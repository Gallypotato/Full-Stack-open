import React from 'react'

const PersonForm = ({ addPerson, newName, handleNameChange, newNum, handleNumChange}) => {


  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange}/>
      </div>
      <div>
        number: <input id="phone" value={newNum} onChange={handleNumChange} type="tel" pattern="^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$"/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
  }

  export default PersonForm

  