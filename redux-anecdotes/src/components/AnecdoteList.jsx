import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector((state) => state.filter);
    const dispatch = useDispatch()
    
    const vote = (id) => {
      dispatch(voteAnecdote(id))

      const anecdote = anecdotes.find((a)=>a.id === id)
      dispatch(setNotification(`You voted '${anecdote.content}'`,10))

      setTimeout(() => {
        dispatch(removeNotification());
      }, 5000);
    }
    
    const filteredAnecdotes = [...anecdotes]
    .filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => b.votes - a.votes)

    return (
        <div>
          {filteredAnecdotes.map(anecdote =>
            <div key={anecdote.id}>
              <div>
                {anecdote.content}
              </div>
              <div>
                has {anecdote.votes}  
                <button onClick={() => vote(anecdote.id)}>vote</button>
              </div>
            </div>
          )}
        </div>
    )
}
export default AnecdoteList