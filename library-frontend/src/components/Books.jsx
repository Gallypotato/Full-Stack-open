import { ALL_BOOKS } from '../queries'
import { useQuery } from '@apollo/client';

const Books = () => {
  const { loading, error, data } = useQuery(ALL_BOOKS);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  if (!data || !data.allBooks || data.allBooks.length === 0) {
    return (
      <div>
        <h2>Books</h2>
        <p>No books available</p>
      </div>
    );
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
