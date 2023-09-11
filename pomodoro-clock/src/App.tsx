import { useState, useEffect } from 'react';
import { DisplayState } from "./helper";
import TimeSetter from "./TimeSetter";
import Display from "./Display";
import AlarmSound from "./assets/AlarmSound.mp3";
import './App.css';

const defaultBreakTime = 5 * 60;
const defaultSessionTime = 25 * 60;
const min = 60;
const max = 60 * 60;
const interval = 60;

function App() {
  const [breakTime, setBreakTime] = useState(defaultBreakTime);
  const [sessionTime, setSessionTime] = useState(defaultSessionTime);
  const [displayState, setDisplayState] = useState<DisplayState>({
    time: sessionTime,
    timeType: "Session",
    timerRunning: false,
  });

  useEffect(() => {
    let timerID: number;
    if (!displayState.timerRunning) return;

    if (displayState.timerRunning) {
      timerID = window.setInterval(decrementDisplay, 1000);
    }

    return () => {
      window.clearInterval(timerID);
    };
  }, [displayState.timerRunning]);

  useEffect(() => {
    if (displayState.time === 0) {
      const audio = document.getElementById("beep") as HTMLAudioElement;
      audio.currentTime = 2;
      audio.play().catch((err) => console.log(err));
      setDisplayState((prev) => ({
        ...prev,
        timeType: prev.timeType === "Session" ? "Break" : "Session",
        time: prev.timeType === "Session" ? breakTime : sessionTime,
      }));
    }
  }, [displayState, breakTime, sessionTime]);

  const reset = () => {
    setBreakTime(defaultBreakTime);
    setSessionTime(defaultSessionTime);
    setDisplayState({
      time: defaultSessionTime,
      timeType: "Session",
      timerRunning: false,
    });
    const audio = document.getElementById("beep") as HTMLAudioElement;
    audio.pause();
    audio.currentTime = 0;
  };

  const startStop = () => {
    setDisplayState((prev) => ({
      ...prev,
      timerRunning: !prev.timerRunning,
    }));
  };

  const changeBreakTime = (time: number) => {
    if (displayState.timerRunning) return;
    setBreakTime(time);
  };

  const decrementDisplay = () => {
    setDisplayState((prev) => ({
      ...prev,
      time: prev.time - 1,
    }));
  };

  const changeSessionTime = (time: number) => {
    if (displayState.timerRunning) return;
    setSessionTime(time);
    setDisplayState({
      time: time,
      timeType: "Session",
      timerRunning: false,
    });
  };

  return (
    <div className="container">
      <h1 className="title">Pomodoro Clock</h1>
      <div className="clock">
        <div className="left">
          <h3>What is the Pomodoro Technique?</h3>
          <p> It involves breaking work into focused, 25-minute intervals called "Pomodoros," separated by short 5-minute breaks. After completing four Pomodoros, you take a longer break of around 15-30 minutes. This technique is designed to improve productivity, reduce distractions, and enhance concentration by harnessing the power of focused work sprints.</p>
          <h3>How it works:</h3>
          <ol>
            <li>Choose a Task: Start by selecting a task you want to work on. It can be anything, from studying for an exam to writing a report or working on a creative project.</li>
            <li>Set a Timer: Set a timer for a specific period, traditionally 25 minutes, which is known as one Pomodoro. During this time, you commit to working on the task without any distractions or interruptions.</li>
            <li>Work Intensely: Focus on the selected task during the Pomodoro period. Avoid multitasking and stay on track.</li>
            <li>Take a Short Break: After completing a Pomodoro, take a short break of about 5 minutes. Use this time to relax, stretch, or do something enjoyable. The break is essential for recharging and preventing burnout.</li>
            <li>Repeat: Repeat steps 1 through 4 for your task.</li>
          </ol>
        </div>
      <div className="setters">
        <div className="break">
          <h4 id="break-label">Break Length</h4>
          <TimeSetter
            time={breakTime}
            setTime={changeBreakTime}
            min={min}
            max={max}
            interval={interval}
            type="break"
          />
        </div>
        <div className="session">
          <h4 id="session-label">Session Length</h4>
          <TimeSetter
            time={sessionTime}
            setTime={changeSessionTime}
            min={min}
            max={max}
            interval={interval}
            type="session"
          />
        </div>
        <Display
          displayState={displayState}
          reset={reset}
          startStop={startStop}
        />
      </div>
      <audio id="beep" src={AlarmSound} />
    </div>
  </div>
      
  );
}

export default App;