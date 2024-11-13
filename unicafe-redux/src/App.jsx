import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()

  const good = useSelector(state => state.good)
  const ok = useSelector(state => state.ok)
  const bad = useSelector(state => state.bad)

  const handleFeedback = (type) => () => {
    dispatch({ type })
  }

  return (
    <div>
      <h1>Give Feedback</h1>
      <button onClick={handleFeedback('GOOD')}>Good</button> 
      <button onClick={handleFeedback('OK')}>Ok</button> 
      <button onClick={handleFeedback('BAD')}>Bad</button>
      <button onClick={handleFeedback('ZERO')}>Reset Stats</button>
      
      <h2>Statistics</h2>
      <div>Good: {good}</div>
      <div>Ok: {ok}</div>
      <div>Bad: {bad}</div>
    </div>
  )
}

export default App
