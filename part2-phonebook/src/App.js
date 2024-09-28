import { useState , useEffect } from 'react'
import personsService from './services/persons'
import Persons from './components/Person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import './index.css'; 


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('set name')
  const [newNum, setNewNum] = useState('set number')
  const [filterName, setFilterName] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    const dataHook = () => {
        personsService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }

    dataHook()
}, []);

  const filteredPersons = persons.filter(person => {
    const lowerCaseName = person.name.toLowerCase();
    const lowerCaseFilter = filterName.toLowerCase();
    return lowerCaseName.includes(lowerCaseFilter);
  });
  
  const found = persons.find(person => person.name === newName)
  const msg = `${ newName } is already added to phonebook, replace the old number with a new one?`

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      key: newName,
      name: newName,
      number: newNum,
      // id: persons.length + 1
    }

    if(!found && newName && newNum){
      personsService
      .create(nameObject)
      .then(returnedPersons => {

        setNotificationMessage({
          "text": `Added ${ returnedPersons.name }`,
          "type": "notification"
        })
        
        setTimeout(() => {
          setNotificationMessage(null)
          
        }, 5000)
        
        setPersons(persons.concat(returnedPersons))
        setNewName('')
        setNewNum('xxx-xxxxx')
      })
      .catch(error => {
        setNotificationMessage({
          "text": error.response.data.error,  // error from backend
          "type": "error"
        });

        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      })
    } 
    else if(found) {
      if(window.confirm(msg) === true){
        personsService
        .update(found.id, nameObject)
        .then(returnedPersons => {
          setNotificationMessage({
            "text": `Updated really ${ returnedPersons.name }`,
            "type": "notification"
          })  
          
          

          setTimeout(() => {
            setNotificationMessage(null)
            
          }, 5000)
          setPersons(persons.map(p => p.id !== found.id ? p : returnedPersons))
        })
        
      }
    }
  }

  const handleNameChange = (event) => {
    
    setNewName(event.target.value)
  }

  const handleNumChange = (event) => {
    
    setNewNum(event.target.value)
  }

  const handleNameFilter = (event) => {
    
    setFilterName(event.target.value)
  }
  
  const handleDeletion = (event) => {
    
    const id = event.target.id

    const name = event.target.name
    const msg = `Do you really want to deleteeeee ${ name }?`
  
    if(window.confirm(msg) === true){
      personsService
        .destroy(id)
        .then(destroyedPerson => {
          setPersons(persons.filter(p => p.id !== id))
          setNotificationMessage({
            "text": `Deleted ${ name }`,
            "type": "notification"
          })
  
          

          setTimeout(() => {
            setNotificationMessage(null)
            
          }, 5000)
        })
        .catch(error => {
          setNotificationMessage({
              "text": `The person, ${ name } was already removed from server`,
              "type": "error"
          })
          
          
          setTimeout(() => {
            setNotificationMessage(null)
            
          }, 5000)

          setPersons(persons.filter(p => p.id !== id))
      })
    }
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterName={filterName} handleNameFilter={handleNameFilter}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNum={newNum} handleNumChange={handleNumChange} />
      <h2>Numbers</h2>
      { notificationMessage !== null ? <Notification message={ notificationMessage } /> : null }
      <ul>
        {filteredPersons.map(person => <Persons key={person.name} person={person} handleDelete={handleDeletion}/>)}
      </ul>
      
    </div>
    
  );

}

export default App;