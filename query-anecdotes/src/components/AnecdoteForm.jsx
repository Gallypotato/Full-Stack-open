import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { showNotification, useNotification } from '../notificationContext'
const AnecdoteForm = () => {
  const { dispatch } = useNotification()
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess:(newAnecdote)=> {
      queryClient.invalidateQueries({queryKey:['anecdotes']})
      dispatch(showNotification(`Anecdote '${newAnecdote.content}' created!`))
    },
    onError:(error)=>{
      dispatch(showNotification(`Error: ${error.response?.data?.error || 'An unknown error occurred'}`))
    }

  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    const newAnecdote = {
      content,
      votes: 0,
      id: (Math.random() * 1000000).toFixed(0), // generate only id
    };
    newAnecdoteMutation.mutate(newAnecdote)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
