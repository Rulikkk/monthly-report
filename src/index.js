import "./styles.css";
import "react-toastify/dist/ReactToastify.css";
import React, {useEffect} from "react"
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import { Router } from "@reach/router";
import {RecoilRoot, useRecoilCallback} from "recoil"

import Home from "./pages/Home";
import MonthlyReport from "./pages/MonthlyReport";
import {config} from './store/state'


const RecoilRootTopLevelCmp = ({ children }) => {
  const preloadConfig = useRecoilCallback(({ snapshot }) => () => {
    snapshot.getLoadable(config());
  });

  useEffect(() => {
    preloadConfig();
  }, []);

  return children;
}

const Main = () => (
  <RecoilRoot>
    <RecoilRootTopLevelCmp>
      <Router>
        <Home path="/" />
        <MonthlyReport path="/report/*reportId" />
      </Router>
      <ToastContainer />
    </RecoilRootTopLevelCmp>
  </RecoilRoot>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);
