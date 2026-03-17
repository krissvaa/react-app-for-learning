import { useEffect, useRef, useState } from "react";

export default function Timer() {
  const timerRef = useRef<number | null>(null);
  const [running, setRunning] = useState(true);
  const [timeNow, setTimeNow] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setTimeNow(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [running]);

  const stopTimer = () => {
    setRunning(false);
  };

  const startTimer = () => {
    setRunning(true);
  };

  return (
    <>
      <div>Current time is: {timeNow}</div>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={startTimer}>Start</button>
    </>
  );
}
