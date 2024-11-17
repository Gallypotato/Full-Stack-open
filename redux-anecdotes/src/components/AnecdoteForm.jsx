import { useDispatch } from 'react-redux'
import { createAnecdotes } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'


const NewAnecdote = () => {
    const dispatch = useDispatch()
  
    const addAnecdote = (event) => {
      event.preventDefault()
      const content = event.target.anecdote.value
      event.target.anecdote.value = ''
      dispatch(createAnecdotes(content))

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