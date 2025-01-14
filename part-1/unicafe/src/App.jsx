import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodStat = new Statistic("Good", good);
  const neutralStat = new Statistic("Neutral", neutral);
  const badStat = new Statistic("Bad", bad);

  const totalResponses = good + neutral + bad;
  const allStat = new Statistic("All", totalResponses);

  const average = (good - bad) / totalResponses;
  const averageStat = new Statistic("Average", average);

  const positivePercentage = 100 * good / totalResponses;
  const positivePercentageStat = new Statistic("Positive", positivePercentage);

  const statisticsArray = [goodStat, neutralStat, badStat, allStat, averageStat, positivePercentageStat]

  const metaHandleClick = (statistic, setStatistic) => {
    const handleClick = () => {
      setStatistic(statistic + 1);
    }
    return handleClick;
  }

  return (
    <div>
      <h2>Give us some damn feedback.</h2>
      <Button label="Good" handleClick={metaHandleClick(good, setGood)}/>
      <Button label="Neutral" handleClick={metaHandleClick(neutral, setNeutral)}/>
      <Button label="Bad" handleClick={metaHandleClick(bad, setBad)}/>
      <Statistics title="Statistics" statisticsArray={statisticsArray}/>
    </div>
  )
}

function Button({label, handleClick}) {
  return (
    <>
      <button onClick={handleClick}>
        {label}
      </button>
    </>
  );
}

class Statistic {
  constructor(statisticName, value) {
    this.statisticName = statisticName;
    this.value = value ? value : 0;
  }
}

const StatisticLine = ({statistic, children}) => {
  return (
    <div>
      {statistic.statisticName} {statistic.value} {children}
    </div>
  );
}

const Statistics = ({title, statisticsArray}) => {
  // if at least one of the statistics is not zero, return all statistics
  for (const stat of statisticsArray)
    if (stat.value !== 0) {
      return (
        <div>
          <h2>{title}</h2>
          <StatisticLine statistic={statisticsArray[0]}/>
          <StatisticLine statistic={statisticsArray[1]}/>
          <StatisticLine statistic={statisticsArray[2]}/>
          <StatisticLine statistic={statisticsArray[3]}/>
          <StatisticLine statistic={statisticsArray[4]}/>
          <StatisticLine statistic={statisticsArray[5]}>%</StatisticLine> 
        </div>
      );
  }

  // if all statistics are zero
  return (
    <div>
      <h2>{title}</h2>
      No feedback given
    </div>
  );
}



export default App