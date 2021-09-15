import "./styles.css";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { RecoilRoot, useRecoilCallback, useRecoilSnapshot } from "recoil";

import Home from "./pages/Home";
import MonthlyReport from "./pages/MonthlyReport";
import { config } from "./store/state";

const RecoilRootTopLevelCmp = ({ children }) => {
  const preloadConfig = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        snapshot.getLoadable(config());
      },
    [],
  );

  useEffect(() => {
    preloadConfig();
  }, []);

  return children;
};

const DebugObserver = () => {
  const snapshot = useRecoilSnapshot();
  useEffect(() => {
    console.debug("The following atoms were modified:");
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return null;
};

const Main = () => (
  <RecoilRoot>
    <DebugObserver />
    <RecoilRootTopLevelCmp>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/report/:reportId">
            <MonthlyReport />
          </Route>
        </Switch>
      </Router>
      <ToastContainer />
    </RecoilRootTopLevelCmp>
  </RecoilRoot>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);
