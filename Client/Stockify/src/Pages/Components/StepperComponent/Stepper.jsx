import React from "react";
import "./Stepper.css";

const Stepper = ({ CurrentSection , Sections}) => {
  return (
    <div className="stepper">
      {Sections.map((step, index) => (
        <div key={index} className="step-container">
          <div className={`step ${CurrentSection === index ? "active" : ""}`} >
            {index + 1}
          </div>
          {index < Sections.length - 1 && <div className="bar"></div>}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
