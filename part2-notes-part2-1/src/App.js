import { useState, useEffect } from 'react'

import Note from './components/Note'
import Notification from './components/notification'
import Footer from './components/Footer'
import noteService from './services/notes'
import loginService from './services/login' 
import './index.css'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null) //'some error happened...'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({
        username,password,
      })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))

      console.log('Login successful, user:', user);
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error('Login failed:', exception);
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      },5000)
    }
  }
  
  const handleLogout = async(event) =>{
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    console.log('Logout successful, user:', user);

  }
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
      //id: notes.length + 1,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })

  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }
  
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
    
  }
  
  const loginForm = () => (
    <form onSubmit={handleLogin}>
    <div>
      username
        <input
        type="text"
        value={username}
        name="Username"
        onChange={({target}) => {
          console.log('Username', target.value)
          setUsername(target.value)}}
        />
    </div>
    <div>
      password
        <input
        type="password"
        value={password}
        name="Password"
        onChange={({ target}) => setPassword(target.value)}/>
    </div>
    <button type="submit">login</button>
    </form>
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
        <input value={newNote} 
               onChange={handleNoteChange}/>
        <button type="submit">save</button>
    </form>   
  )

  const logoutForm = () => (
    <div>
      <p>{user.name} logged-in</p>
      <button onClick={handleLogout}>log out</button>
    </div>  
  )

  const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important === true)
  
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      
      {user === null ?
      loginForm() :
      <div>
        {logoutForm()}
        {noteForm()}
      </div>
    }
      
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note}
            toggleImportance={()=>toggleImportanceOf(note.id)} />
        )}
      </ul>
      
      <Footer />
    </div>
  )
}

export default App 