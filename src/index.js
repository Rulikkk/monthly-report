import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import ReportAndEditor from "./ReportAndEditor";
import { RecoilRoot } from "recoil";

const App = () => {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <RecoilRoot>
        <ReportAndEditor />
      </RecoilRoot>
    </Suspense>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
