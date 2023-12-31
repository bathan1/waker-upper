import { useState } from 'react';
import BedtimeForm from './components/BedtimeForm'
import WakeUpViewer from './components/WakeUpViewer'
import SignupForm from './components/SignupForm'

function App() {
  // Set up states
  const [bedtime, setBedtime] = useState('');
  const [wakeUpTimes, setWakeUpTimes] = useState([]);
  const [timeDesignation, setTimeDesignation] = useState('PM');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userBedtimes, setUserBedtimes] = useState([]);
  const [formData, setFormData] = useState({
        username: '',
        password: '',
        bedtimes: []
  });
  const [currentUser, setCurrentUser] = useState({
    _id: "",
    username: "",
    password: "",
    bedtimes: []
  });
  
  const handleTimeChange = (event) => {
    let userBedtime = event.target.value;
    setBedtime(userBedtime);
  }

  const calculateWakeTime = (event) => {
    event.preventDefault();

    // Set the time to user bedtime
    let [fallAsleepHour, fallAsleepMinutes] = bedtime.split(':');
    fallAsleepMinutes = Number(fallAsleepMinutes);
    fallAsleepHour = Number(fallAsleepHour);

    // Create new Date object with today's date
    let fallAsleepTime = new Date();
    fallAsleepTime.setMinutes(fallAsleepMinutes);
    fallAsleepTime.setHours(fallAsleepHour);

    // Check time designation
    if (timeDesignation === 'AM') {
      fallAsleepHour = Number(fallAsleepHour);
      fallAsleepMinutes += 14;
    } else {
      fallAsleepHour = Number(fallAsleepHour) + 12;
      fallAsleepMinutes += 14;
    }

    // Set time
    while (fallAsleepMinutes >= 60) {
      fallAsleepMinutes -= 60;
      fallAsleepHour += 1;
    }
    fallAsleepTime.setHours(fallAsleepHour);
    fallAsleepTime.setMinutes(fallAsleepMinutes);

    // Get wakeUpTimes
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
  }

  return (
    <div className="App">
      <h1>Waker Upper App</h1>
      <p> A sleep cycle lasts about 90 minutes, and a good night's sleep consists of 5-6 sleep cycles.</p>
      <p>If you wake up in the middle of a sleep cycle, you will feel groggy, even if you've completed several cycles prior to waking up.</p>
      <p>If you go to bed at the time you write, when should you wake up? </p>

      <BedtimeForm currentUser={currentUser} formData={formData} setFormData={setFormData} bedtime={bedtime} 
                  timeDesignation={timeDesignation} setTimeDesignation={setTimeDesignation} 
                  calculateWakeTime={calculateWakeTime} handleTimeChange={handleTimeChange} 
                  isSignedIn={isSignedIn} userBedtimes={userBedtimes} setUserBedtimes={setUserBedtimes}
      />
      <WakeUpViewer wakeUpTimes={wakeUpTimes} />
      <br></br>

      <p>Sign up to save your bedtimes</p>
      <SignupForm currentUser={currentUser} setCurrentUser={setCurrentUser} formData={formData} setFormData={setFormData} isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} userBedtimes={userBedtimes} setUserBedtimes={setUserBedtimes} timeDesignation={timeDesignation}/>
    </div>
  );
}

export default App;


//test test test