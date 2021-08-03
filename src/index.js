import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import ReportAndEditor from "./ReportAndEditor";
import { RecoilRoot } from "recoil";

const App = () => {
  return (
    <RecoilRoot>
      <Suspense fallback={<span>Loading...</span>}>
        <ReportAndEditor />
      </Suspense>
    </RecoilRoot>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
