import React, { useEffect, useState } from "react";
import Styles from './DateTimeDisplay.module.css'
function DateTimeDisplay() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    const formattedDate = new Date().toLocaleDateString("en-GB", options);
    setCurrentDate(formattedDate);
  }, []);

  return (
    <div className = {Styles["Main-Div"]}>
      <label className = {Styles['Time-P']}>{currentDate.toString()}</label>
    </div>
  );
}

export default DateTimeDisplay;
