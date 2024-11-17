import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const NewAnecdote = () => {
    const dispatch = useDispatch()
  
    const addAnecdote = async (event) => {
      event.preventDefault()
      const content = event.target.anecdote.value
      event.target.anecdote.value = ''
      const newNote = await anecdoteService.createNew(content)
      dispatch(createAnecdote(newNote))

      dispatch(setNotification(`'${content}' is created`))

      setTimeout(() => {
        dispatch(removeNotification());
      }, 5000);
    }

    return (
      <form onSubmit={addAnecdote}>
        <div><input name='anecdote'/></div>
        <button type="submit">create</button>
      </form>
    )
  }
  
  export default NewAnecdote