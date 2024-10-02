import React, { useState, useEffect } from "react";
import { calculateTimeLeft } from "../../utils";

const Cronometro: React.FC<{ newSaleString: string | undefined }> = ({
  newSaleString,
}) => {
  const newSaleTstamp = new Date(newSaleString ?? 0).getTime();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(newSaleTstamp));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(newSaleTstamp));
    }, 1000);

    return () => clearInterval(interval);
  }, [newSaleTstamp]);

  return (
    <div className="cronometro">
      <span className="numeroCron">{timeLeft.days}</span>
      <span className="label">d </span>
      <span className="numeroCron">{timeLeft.hours}</span>
      <span className="label">h </span>
      <span className="numeroCron">{timeLeft.minutes}</span>
      <span className="label">m </span>
      <span className="numeroCron">{timeLeft.seconds}</span>
      <span className="label">s</span>
    </div>
  );
};

export default Cronometro;
