import { useEffect, useState } from 'react'
import './App.css'

function App() {
  //Defines the different timer settings
  const timerTypes = {
    pomodoro: {time: 25, color: "green", label: "Pomodoro"},
    shortBreak: {time: 5, color: "orange", label: "Short Break"},
    longBreak: {time: 15, color: "red", label: "Long Break"}
  }

  const [timerType, setTimerType] = useState('pomodoro')

  return (
    <>
      <Timer 
        timerTypes={timerTypes}
        timerType={timerType}
        setTimerType={setTimerType}
      />
    </>
  )
}

function Timer({timerTypes, timerType, setTimerType}) {
  const [time, setTime] = useState(timerTypes[timerType].time * 60)
  const [isRunning, setIsRunning] = useState(false)

  //Reset timer when timer type changes
  useEffect(() => {
    setTime(timerTypes[timerType].time * 60)
    setIsRunning(false)
  }, [timerType, timerTypes])

  //Countdown logic
  useEffect(() => {
    if(!isRunning || time <= 0) return

    const interval = setInterval(() => {
      setTime((prevTimeLeft) => prevTimeLeft - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, time])

  //Handles basic timer controls
  const handleStartStop = () => setIsRunning(!isRunning)
  const handleReset = () => {
    setTime(timerTypes[timerType].time * 60)
    setIsRunning(false)
  }
  const handleIncrement = (seconds) => setTime((prevTime) => prevTime + seconds)

  return (
    <>
      <TabPanel 
        timerTypes={timerTypes}
        timerType={timerType}
        setTimerType={setTimerType}
      />
      <Clock 
        time={time}
        onTimeChange={setTime}
        isRunning={isRunning}
      />
    <div>
      <Controls
        isRunning={isRunning}
        onStartStop={handleStartStop}
        onReset={handleReset}
        onIncrement={handleIncrement}
      />
    </div>
    </>
  )
}

function Tab({tabKey, config, isActive, onClick}) {
  return (
        <button
          className={isActive ? 'tab active' : 'tab'}
          onClick={() => onClick(tabKey)}
          style={{ '--color': config.color }}
        >
          {config.label}
        </button>
  ) 
}

function TabPanel({timerTypes, timerType, setTimerType}) {
  return (
    <div className='tabs'>
      {Object.entries(timerTypes).map(([key, config]) => (
        <Tab
          key={key}
          tabKey={key}
          config={config}
          isActive={timerType === key}
          onClick={setTimerType}
        />
      ))}
    </div>
  )
}

function Clock({time, onTimeChange, isRunning}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')

  const minutes = Math.floor(time/ 60)
  const seconds = time % 60

  //Handles value change on clicking and submission when user clicks off or presses enter 
  const handleClick = () => {
    if (!isRunning) {
      setIsEditing(true)
      setEditValue(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const [mins, secs] = editValue.split(':').map(Number)
    if (!isNaN(mins) && !isNaN(secs)) {
      onTimeChange(mins * 60 + secs)
    }
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSubmit}
          autoFocus
          style={{ 
            fontSize: '2rem',
            textAlign: 'center',
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            color: 'inherit',
            margin: 0,
            padding: 0,
            width: 'auto'
          }}
        />
      </form>
    )
  }
  
  return (
    <div>
      <h1 onClick={handleClick} style={{ cursor: isRunning ? 'default' : 'pointer' }}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </h1>
    </div>
  )
}

function Controls({isRunning, onStartStop, onReset, onIncrement}) {
  return (
    <>
      <div>
        <button onClick={() => onIncrement(30)}>
          <h2>+0:30</h2>
        </button>
        <button onClick={() => onIncrement(60)}>
          <h2>+1:00</h2>
        </button >
        <button onClick={() => onIncrement(300)}>
          <h2>+5:00</h2>
        </button>
      </div>
      <div>
        <button onClick={onStartStop}>
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button onClick={onReset}>Reset</button>
      </div>
    </>
  )
}

export default App
