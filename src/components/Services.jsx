import { useState, useEffect, useRef } from "react";
import Section from "./Section";
import Heading from "./Heading";
import { service1} from "../assets";
import {
  Gradient,
} from "./design/Services";
import Button from "./Button";

const Services = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [data, setData] = useState({});
  const [prediction, setPrediction] = useState('');
  const [details, setDetails] = useState({});
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/data');
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Fetch Data Error:', error);
      setError(error.message);
    }
  };

  const analyzeData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorDetail = await response.json();
        throw new Error(`Error analyzing data: ${JSON.stringify(errorDetail.detail)}`);
      }
      const result = await response.json();
      setPrediction(result.prediction);
      setDetails(result.details);
    } catch (error) {
      console.error('Analyze Data Error:', error);
      setError(error.message);
    }
  };

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setTimeLeft(10);
    } else {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
      fetchData().then(analyzeData);
    }
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setTimeLeft(10);
      setIsRunning(false);
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <Section id="analysis">
      <div className="container">
        <Heading
          title="Analysis"
          text="Start Analyzing your Network and Detect Malicious Attacks"
        />

        <div className="relative">
          <div className="relative z-1 flex items-center h-[39rem] mb-5 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 xl:h-[46rem]">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none md:w-3/5 xl:w-auto">
              <img
                className="w-full h-full object-cover md:object-right"
                width={800}
                alt="Service"
                height={730}
                src={service1}
              />
            </div>

            <div className="relative z-1 max-w-[17rem] ml-auto">
              <h4 className="h4 mb-4">Deloitte IntelliShield</h4>
              <p className="body-2 mb-[1rem] text-n-3">
                Deloitte IntelliShield unlocks the potential of AI-powered intrusion detection system.
              </p>
              <Button onClick={handleStartStop}>{isRunning ? "Stop" : "Start"}</Button>
              <p className="body-1 mt-4 text-n-1">{timeLeft} seconds left</p>
            </div>
          </div>

          <div className="relative z-1 grid gap-5 lg:grid-cols-2">
            <div className="relative min-h-[39rem] border border-n-1/10 rounded-3xl overflow-hidden">
              <h1 className="text-lg ml-[30px] mt-[40px] font-bold mb-4">Network Analysis Result</h1>
                <p className="ml-[30px] mt-[30px]"><strong>Prediction:</strong> {prediction}</p>
                <p className="ml-[30px] mt-[30px] mb-[10px]" ><strong>Details:</strong></p>
                <ul className="ml-[40px] mb-[10px]">
                  {Object.entries(details).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
            </div>

          </div>


          {error && (
            <div className="mt-8 bg-red-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4 text-red-800">Error</h3>
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <Gradient />
        </div>
      </div>
    </Section>
  );
};

export default Services;
