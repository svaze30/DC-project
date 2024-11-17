import React from "react";
import RegisterCandidate from "./RegisterCandidate";
import RegisterRecruiter from "./RegisterRecruiter";
import LoginCandidate from "./LoginCandidate";
import LoginRecruiter from "./LoginRecruiter";

function App() {
  return (
    <div className="App">
      <h1>Register Candidate</h1>
      <RegisterCandidate />
      <h1>Register Recruiter</h1>
      <RegisterRecruiter />
      <h1>Login Candidate</h1>
      <LoginCandidate />
      <h1>Login Recruiter</h1>
      <LoginRecruiter />
    </div>
  );
}

export default App;
