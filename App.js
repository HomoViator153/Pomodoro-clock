const audioURL =
  "https://orangefreesounds.com/wp-content/uploads/2021/02/Alarm-clock-bell-ringing-sound-effect.mp3?_=1";

const { useState, useEffect, useRef } = React;

const App = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isBreakActive, setIsBreakActive] = useState(false);

  const [changedLast, setChangedLast] = useState("nothing");

  const [sessionTimerValue, setSessionTimerValue] = useState(25 * 60);
  const [breakTimerValue, setBreakTimerValue] = useState(5 * 60);

  const [sessionValue, setSessionValue] = useState(25 * 60);
  const [breakValue, setBreakValue] = useState(5 * 60);

  useEffect(() => {
    if (sessionTimerValue <= 0) {
      setSessionTimerValue(sessionValue);
      setChangedLast("isBreakActive");
      setIsSessionActive(false);
      setIsBreakActive(true);
      document.getElementById("beep").play();
    }
  });

  useEffect(() => {
    if (breakTimerValue <= 0) {
      setBreakTimerValue(breakValue);
      setChangedLast("isSessionActive");
      setIsSessionActive(true);
      setIsBreakActive(false);
      document.getElementById("beep").play();
    }
  });

  useEffect(() => {
    let interval = null;
    if (isSessionActive && !isBreakActive) {
      interval = setInterval(() => {
        setSessionTimerValue((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isSessionActive]);

  useEffect(() => {
    let interval = null;
    if (!isSessionActive && isBreakActive) {
      interval = setInterval(() => {
        setBreakTimerValue((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isBreakActive]);

  const handleTimeSetting = (e) => {
    if (isSessionActive || isBreakActive) return;

    const value = e.target.id;

    if (value === "session-decrement") {
      if (sessionTimerValue < 120) return;
      setSessionTimerValue(sessionTimerValue - 60);
      setSessionValue(sessionValue - 60);
    } else if (value === "session-increment") {
      if (sessionTimerValue >= 60 * 60) return;
      setSessionTimerValue(sessionTimerValue + 60);
      setSessionValue(sessionValue + 60);
    } else if (value === "break-decrement") {
      if (breakTimerValue < 120) return;
      setBreakValue(breakValue - 60);
      setBreakTimerValue(breakTimerValue - 60);
    } else if (value === "break-increment") {
      if (breakTimerValue >= 60 * 60) return;
      setBreakValue(breakValue + 60);
      setBreakTimerValue(breakTimerValue + 60);
    }
  };

  const handleStartStop = () => {
    document.getElementById("start_stop").classList.toggle("start_stop-active");

    if (!isSessionActive && !isBreakActive && changedLast === "isBreakActive") {
      setIsBreakActive(true);
    } else if (!isSessionActive && !isBreakActive) {
      setIsSessionActive(true);
    } else if (isSessionActive && !isBreakActive) {
      setIsSessionActive(false);
    } else if (!isSessionActive && isBreakActive) {
      setIsBreakActive(false);
    }
  };

  const handleReset = () => {
    setIsSessionActive(false);
    setIsBreakActive(false);
    setChangedLast("isSessionActive");
    setSessionTimerValue(25 * 60);
    setBreakTimerValue(5 * 60);
    setSessionValue(25 * 60);
    setBreakValue(5 * 60);
    document.getElementById("beep").pause();
    document.getElementById("beep").load();
  };

  const displayTime = () => {
    if (isSessionActive && !isBreakActive) {
      return (
        <span>
          {sessionTimerValue < 600 ? "0" + Math.floor(sessionTimerValue / 60) : Math.floor(sessionTimerValue / 60)}:
          {sessionTimerValue % 60 < 10 ? "0" + (sessionTimerValue % 60) : sessionTimerValue % 60}
        </span>
      );
    } else if (!isSessionActive && !isBreakActive && changedLast === "isBreakActive") {
      return (
        <span>
          {breakTimerValue < 600 ? "0" + Math.floor(breakTimerValue / 60) : Math.floor(breakTimerValue / 60)}:
          {breakTimerValue % 60 < 10 ? "0" + (breakTimerValue % 60) : breakTimerValue % 60}
        </span>
      );
    } else if (!isSessionActive && isBreakActive) {
      return (
        <span>
          {breakTimerValue < 600 ? "0" + Math.floor(breakTimerValue / 60) : Math.floor(breakTimerValue / 60)}:
          {breakTimerValue % 60 < 10 ? "0" + (breakTimerValue % 60) : breakTimerValue % 60}
        </span>
      );
    } else if (!isSessionActive && !isBreakActive) {
      return (
        <span>
          {sessionTimerValue < 600 ? "0" + Math.floor(sessionTimerValue / 60) : Math.floor(sessionTimerValue / 60)}:
          {sessionTimerValue % 60 < 10 ? "0" + (sessionTimerValue % 60) : sessionTimerValue % 60}
        </span>
      );
    }
  };

  return (
    <div className="pomodoro-app">
      <div className="pomodoro-container">
        <h2 className="title">Pomodoro timer</h2>
        <div className="set-length-container">
          <div className="session-length">
            <h4 id="session-label">Session:</h4>
            <div className="session-spans">
              <span id="session-decrement" onClick={handleTimeSetting} className="material-icons-outlined">
                remove_circle_outline
              </span>
              <span id="session-length">{sessionValue / 60}</span>
              <span id="session-increment" onClick={handleTimeSetting} className="material-icons-outlined">
                add_circle_outline
              </span>
            </div>
          </div>
          <div className="break-length">
            <h4 id="break-label">Break:</h4>
            <div className="break-spans">
              <span id="break-decrement" onClick={handleTimeSetting} className="material-icons-outlined">
                remove_circle_outline
              </span>
              <span id="break-length">{breakValue / 60}</span>
              <span id="break-increment" onClick={handleTimeSetting} className="material-icons-outlined">
                add_circle_outline
              </span>
            </div>
          </div>
        </div>
        <div className="timer-container">
          <h4 id="timer-label">
            {isBreakActive || changedLast === "isBreakActive" ? "Break" : isSessionActive ? "Session" : "Session"}
          </h4>
          <h1 id="time-left">{displayTime()}</h1>
        </div>
        <div className="controls-container">
          <button id="start_stop" onClick={handleStartStop}>
            {isBreakActive || isSessionActive ? "Stop" : "Start"}
          </button>
          <button id="reset" onClick={handleReset}>
            Reset
          </button>
          <audio id="beep" src={audioURL}></audio>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
