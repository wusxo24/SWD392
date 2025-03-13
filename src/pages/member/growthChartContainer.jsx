import React, { useState } from "react";
import { ChildGrowth } from "./ChildGrowth"; // Assuming ChildGrowth is in a separate file

const GrowthChartContainer = () => {
  const [gender, setGender] = useState("girls");

  return (
    <div>
      <div>
        <button onClick={() => setGender("girls")} disabled={gender === "girls"}>
          Girls Chart
        </button>
        <br></br>
        <button onClick={() => setGender("boys")} disabled={gender === "boys"}>
          Boys Chart
        </button>
      </div>
      
      <ChildGrowth gender={gender} />
    </div>
  );
};

export default GrowthChartContainer;
