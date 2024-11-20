import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import AnecdoteList from './components/AnecdoteList'
import { useQuery } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote } from './requests'


const App = () => {
  
  // retriving data
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  console.log(JSON.parse(JSON.stringify(result)))
  
  if ( result.isLoading ) {
    return <div>loading data...</div>
  }
  if ( result.error) {
    return <div>anecdote servive not available due to problems in server</div>
  }
  const anecdotes = result.data
  

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
      <AnecdoteList anecdotes={anecdotes}/>
    </div>
  )
}


export default App
