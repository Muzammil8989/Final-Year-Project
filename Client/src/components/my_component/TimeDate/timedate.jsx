// src/components/my_component/DateTimeComponent.jsx
import React, { useEffect, useState } from "react";
import { format } from "date-fns"; // For formatting dates

const DateTimeComponent = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update current date and time every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flex items-center rounded-lg p-4">
      <p className="text-xl">
        {format(currentDateTime, "MMMM d, yyyy HH:mm:ss")}{" "}
        {/* Format as needed */}
      </p>
    </div>
  );
};

export default DateTimeComponent;
