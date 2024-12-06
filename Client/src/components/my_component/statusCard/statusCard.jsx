import React from "react";
import { Progress } from "antd";


const StatusCard = ({ title, percentage, color, icon: Icon }) => {
  const gradientColors = {
    green: "linear-gradient(135deg, #B0EFC1, #7DD8A8)",
    yellow: "linear-gradient(135deg, #FFE49E, #FFD372)",
    red: "linear-gradient(135deg, #FFB4B4, #FF8787)",
  };

  // Get the current date
  const currentDate = new Date();

  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg p-4 shadow-md"
      style={{
        background: gradientColors[color],
        width: "100%", // Change width to 100% for responsiveness
        maxWidth: "520px", // Set a max width
      }}
    >
      <Icon size={48} className={`text-${color}-500`} />
      <h3 className="mt-2 text-xl font-semibold text-gray-700">{title}</h3>
      <Progress
        type="circle"
        size={80}
        percent={percentage}
        strokeColor={color}
        format={(percent) => `${percent}%`}
        className="mt-4"
      />

      {/* Display Current Date */}
      <div className="mt-2 text-lg font-medium text-gray-800">
        {currentDate.toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
};

export default StatusCard;
