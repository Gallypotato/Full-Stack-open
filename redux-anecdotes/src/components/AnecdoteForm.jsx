import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'


const NewAnecdote = () => {
    const dispatch = useDispatch()
  
    const addAnecdote = async (event) => {
      event.preventDefault()
      const content = event.target.anecdote.value.trim()
      event.target.anecdote.value = ''

      if (!content) {
        dispatch(setNotification('Anecdote content cannot be empty', 10));
        setTimeout(() => {
          dispatch(removeNotification());
        }, 5000);
        return;
      }
      dispatch(createAnecdote(content))

      dispatch(setNotification(`'${content}' is created`, 10))

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