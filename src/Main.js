import "./styles.css";
import "react-toastify/dist/ReactToastify.css";

import { Router } from "@reach/router";
import React from "react";
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";

import Home from "./Home/Home";
import ReportAndEditor from "./MonthlyReport/ReportAndEditor";

const Main = () => {
  return (
    <RecoilRoot>
      <Router>
        <Home path="/" />
        <ReportAndEditor path="/report/*reportId" />
      </Router>
      <ToastContainer />
    </RecoilRoot>
  );
};

export default Main;
