import React, { useState } from "react";
import Navbar from "@/components/my_component/Navbar/Navbar";
import CandidateStepper from "@/components/my_component/candidateStepper/candidateStepper";

import ProcessResume from "@/components/my_component/resumeProcess/processResume";

function Candidate() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="h-screen">
      <div className="p-4">
        <Navbar />
      </div>
      <div className="mt-32 p-4">
        {/* <ProcessResume /> */}
        <CandidateStepper currentStep={currentStep} />
      </div>
    </div>
  );
}

export default Candidate;
