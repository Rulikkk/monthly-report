import React from "react";
import ReportAndEditor from "./MonthlyReport/ReportAndEditor";
import { Router } from "@reach/router";
import { RecoilRoot } from "recoil";
import "./styles.css";
import Home from "./Home/Home";

const Main = () => {
  return (
    <RecoilRoot>
      <Router>
        <Home path="/" />
        <ReportAndEditor path="/report/*reportId" />
      </Router>
    </RecoilRoot>
  );
};

export default Main;
