import React, { useState } from "react";
import Navbar from "@/components/my_component/Navbar/Navbar";

import ProcessResume from "@/components/my_component/resumeProcess/processResume";

function Candidate() {
  return (
    <div className="h-screen">
      <div className="p-4">
        <Navbar />
      </div>
      <div className="mt-32 p-4">
        <ProcessResume />
      </div>
    </div>
  );
}

export default Candidate;
