import { useState } from 'react'
import { ALL_AUTHORS, UPDATE_YEAR } from '../queries'
import { useQuery, useMutation } from '@apollo/client';


const Authors = ({setError}) => {
  const [author, setAuthor] = useState('')
  const [birthYear, setBornTo] = useState('')

  const { loading, error, data } = useQuery(ALL_AUTHORS);

  const [ updateYear ] = useMutation(UPDATE_YEAR, {
    refetchQueries: [ { query: ALL_AUTHORS} ],
    
    onError: (error) => {
      const messages =
        error.graphQLErrors?.map((e) => e.message).join('\n') ||
        error.networkError?.message ||
        'An unknown error occurred';
      setError(messages);
      console.log('Error state updated with:', messages);
    },
  })

  if (loading || error) {
    return (
      <div>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
      </div>
    );
  }

  const submit = async (event) => {
    event.preventDefault()
   
    try{
      const parsedBirthYear = parseInt(birthYear, 10) 
      if (isNaN(parsedBirthYear)) {
        setError('Birth year must be a valid number')
        return
      }
      const variables = { name: author, setBornTo: parsedBirthYear };
      const result = await updateYear( { variables:variables })

      if (result?.data) {
        setError('');
        setAuthor('');
        setBornTo('');
      }
    } catch(error){
      setError('Failed to update birth year')
    }
  }

  if (!data || !data.allAuthors || data.allAuthors.length === 0) {
    return (
      <div>
        <h2>Authors</h2>
        <p>No authors available</p>
      </div>
    );
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>  
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set Birthyear</h3>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="author">Name</label>
          <select
            id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)} 
          >
            <option value="">Select an author</option>
            {data.allAuthors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="birthYear">Born</label>
          <input
            id="birthYear"
            type="number"
            value={birthYear}
            onChange={({ target }) => setBornTo(target.value)}
            disabled={!author}  
          />
        </div>
        <button type="submit" disabled={!author || !birthYear}>Update Author</button>
      </form>

    </div>
  )
}

export default Authors
