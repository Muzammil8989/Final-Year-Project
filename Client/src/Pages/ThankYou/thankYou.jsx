// src/ThankYouPage.jsx

import React from "react";
import { FaCheckCircle } from "react-icons/fa"; // Import the icon from react-icons

const ThankYou = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="max-w-lg rounded-lg bg-white p-8 text-center shadow-lg">
        <FaCheckCircle className="mb-4 text-6xl text-green-500" />
        <h1 className="mb-4 text-4xl font-bold text-green-500">Thank You!</h1>
        <p className="mb-6 text-lg text-gray-700">
          Your test link has already been used or is no longer valid.
        </p>
        <p className="mb-8 text-sm text-gray-500">
          If you have any questions, feel free to reach out to support.
        </p>
        <a
          href="/"
          className="rounded-full bg-blue-500 px-6 py-3 text-lg text-white hover:bg-blue-600"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default ThankYou;
