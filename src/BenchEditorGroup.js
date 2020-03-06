import React from "react";

import BenchEditorMainInfo from "./BenchEditorMainInfo";
import BenchEditorRemarks from "./BenchEditorRemarks";

/**
 *
 * @param {Object} obj
 * @param {Report} obj.report
 */
const BenchEditorGroup = ({ report, updateReport }) => {
  const switchBenchSectionEnabled = () => {
    report.benchInfoData.benchSectionEnabled = !report.benchInfoData
      .benchSectionEnabled;
    updateReport();
  };

  return (
    <>
      <h1 className="text-xl m-2">
        Bench
        <input
          type="checkbox"
          className="ml-2"
          checked={report.benchInfoData.benchSectionEnabled}
          onChange={switchBenchSectionEnabled}
        ></input>
      </h1>

      <BenchEditorMainInfo />
      <BenchEditorRemarks />
    </>
  );
};

export default BenchEditorGroup;
