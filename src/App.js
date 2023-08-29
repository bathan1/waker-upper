import { useState } from 'react';
import Form from './components/Form'

function App() {
  const [bedtime, setBedtime] = useState('');
  const [wakeUpTimes, setWakeUpTimes] = useState([]);

  const handleTimeChange = (event) => {
    let userBedtime = event.target.value;
    setBedtime(userBedtime);
  }

  const calculateWakeTime = (event) => {
    event.preventDefault();

    // Create new Date object with today's date
    let fallAsleepTime = new Date();

    // Set the time to user bedtime
    let [fallAsleepHour, minutes] = bedtime.split(':');
    fallAsleepHour = Number(fallAsleepHour);
    let fallAsleepMinutes = Number(minutes) + 14;

    // Set time
    while (fallAsleepMinutes >= 60) {
      fallAsleepMinutes -= 60;
      fallAsleepHour += 1;
    }

    fallAsleepTime.setHours(fallAsleepHour);
    fallAsleepTime.setMinutes(fallAsleepMinutes);

    const wakeUpTime = new Date(fallAsleepTime);
    let wakeUpTimesArr = [];
    for (let i = 0; i <= 6; i++) {
      wakeUpTime.setMinutes(wakeUpTime.getMinutes() + 90);
      const wakeUpTimeString = wakeUpTime.toLocaleTimeString('en-US', {
        timeStyle: 'short'
      });
      wakeUpTimesArr.push(wakeUpTimeString);
    }
    
    setWakeUpTimes(wakeUpTimesArr);
    console.log(wakeUpTimes);
  }

  return (
    <div className="App">
      <h1>Waker Upper App</h1>
      <p> A sleep cycle lasts about 90 minutes, and a good night's sleep consists of 5-6 sleep cycles.</p>
      <p>If you wake up in the middle of a sleep cycle, you will feel groggy, even if you've completed several cycles prior to waking up.</p>
      <p>If you go to bed now, when should you wake up? </p>

      <Form bedtime={bedtime} calculateWakeTime={calculateWakeTime} handleTimeChange={handleTimeChange}/>
    </div>
  );
}

export default App;
