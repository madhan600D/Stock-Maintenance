import React, { useEffect, useState } from "react";
import Styles from './DateTimeDisplay.module.css'

//Store
import useOrg from '../../../Stores/OrgStore.js'
function DateTimeDisplay() {
  const [currentDate, setCurrentDate] = useState("");
  const {OrganizationData} = useOrg();

  // useEffect(() => {
  //   const options = {
  //     day: "2-digit",
  //     month: "short",
  //     year: "numeric",
  //   };

  //   const formattedDate = new Date().toLocaleDateString("en-GB", options);
  //   setCurrentDate(formattedDate);
  // }, []);

  return (
    <div className = {Styles["Main-Div"]}>
      <label className = {Styles['Time-P']}>{OrganizationData && OrganizationData[0] && OrganizationData[0][0].RunDate.toString()}</label>
    </div>
  );
}

export default DateTimeDisplay;
