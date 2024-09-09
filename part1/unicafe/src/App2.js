import { useState } from "react"

const StatisticLine = ({text, value}) => (
  <tr>
    <td>{text} </td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({good, neutral, bad, all}) => {
  if (all === 0) {
    return (
      <div>
      <h1>statistics</h1>
      No feedback given
      </div>
    )
  }

  const average = (good - bad) / all;
  const positive = (good / all) * 100;


  return(
  <div>
    <h1>statistics</h1>
    <table>
      <tbody>
        <StatisticLine text="Good" value={good} />
        <StatisticLine text="Neutral" value={neutral} />
        <StatisticLine text="Bad" value={bad} />
        <StatisticLine text="All" value={all} />
        <StatisticLine text="Average" value={average.toFixed(2)} />
        <StatisticLine text="Positive" value={positive.toFixed(1) + '%'} />
      </tbody>
    </table>
  </div>
  )
}

const Button = ({handleClick,text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  
  const handleGood = () => {
    const newGood = good + 1
    const newAll = newGood + neutral + bad
    setGood(newGood)
    setAll(newAll)
  }
  const handleNeutral = () => {
    const newNeutral = neutral + 1
    const newAll = good + newNeutral +bad
    setNeutral(newNeutral)
    setAll(newAll)
  }

  const handleBad = () => {
    const newBad = bad + 1
    const newAll = good + neutral +newBad
    setBad(newBad)
    setAll(newAll)

  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGood} text='good'/> 
      <Button handleClick={handleNeutral} text='neutral'/>
      <Button handleClick={handleBad} text='bad'/>
      
      <Statistics good={good} neutral={neutral} bad={bad} all={all}/>
    </div>
  )
}


export default App