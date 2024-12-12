import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Notify from './components/Notify'

const padding = {
  padding: 5
}
const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }
  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <Link style={padding} to="/">authors</Link>
      <Link style={padding} to="/books">books</Link>
      <Link style={padding} to="/add book">add book</Link>


    <Routes>
      <Route path="/" element={<Authors setError={notify}/>} />
      <Route path="/books" element={<Books />} />
      <Route path="/add book" element={<NewBook setError={notify}/>} />
    </Routes>
    </div>
  );
};

export default App;
