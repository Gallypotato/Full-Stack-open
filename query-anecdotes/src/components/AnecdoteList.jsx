import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, vote } from '../requests'
import PropTypes from 'prop-types'
import { showNotification, useNotification } from '../notificationContext';

const AnecdoteList = ({anecdotes}) => {
    const queryClient = useQueryClient()
    const { dispatch } = useNotification()
    // fetch anecdote
    const data = useQuery({
      queryKey: ['anecdotes'],
      queryFn: getAnecdotes,
    })

    const voteMutation = useMutation({
    mutationFn: vote,
    onSuccess:(updatedAnecdote)=> {
      queryClient.invalidateQueries({queryKey:['anecdotes']})
      dispatch(showNotification(`anecdote '${updatedAnecdote.content}' voted`))
    }
    })

    const handleVote = (anecdote) => {
      voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
    };
/*
    .filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => b.votes - a.votes)
*/
    return (
        <div>
          {anecdotes.map((anecdote) =>
            <div key={anecdote.id}>
              <div>
                {anecdote.content}
              </div>
              <div>
                has {anecdote.votes}  
                <button onClick={() => handleVote(anecdote)}>vote</button>
              </div>
            </div>
          )}
        </div>
    )
}

AnecdoteList.propTypes = {
    anecdotes: PropTypes.array.isRequired
  }
  
export default AnecdoteList