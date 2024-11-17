
import ReactDOM from 'react-dom/client'
import anecdoteService from './services/anecdotes'
import { Provider } from 'react-redux'
import store from './store'
import App from './App'
import { setAnecdotes } from './reducers/anecdoteReducer'


anecdoteService.getAll().then((anecdotes)=> {
  store.dispatch(setAnecdotes(anecdotes))
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)