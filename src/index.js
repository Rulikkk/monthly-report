import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import ReportAndEditor from "./MonthlyReport/ReportAndEditor";
import { RecoilRoot } from "recoil";
import "./styles.css";

const App = () => {
  return (
    <RecoilRoot>
      <Suspense fallback={<span>Loading report...</span>}>
        <ReportAndEditor />
      </Suspense>
    </RecoilRoot>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
