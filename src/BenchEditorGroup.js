import React from "react";
import isNil from "lodash.isnil";

import { getRandomId } from "./BaseComponents";
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

  const onAddBenchInfoLine = () => {
    if (isNil(report.benchInfoData.info)) {
      report.benchInfoData.info = [];
    }

    report.benchInfoData.info.push({
      id: getRandomId()
    });

    updateReport();
  };

  const deleteBenchInfo = info => {
    const filteredInfo = report.benchInfoData.info.filter(
      record => record.id !== info.id
    );
    report.benchInfoData.info = filteredInfo;

    updateReport();
  };

  return (
    <div>
      <h1 className="text-xl">
        Bench
        <input
          type="checkbox"
          className="ml-2"
          checked={report.benchInfoData.benchSectionEnabled}
          onChange={switchBenchSectionEnabled}
        ></input>
      </h1>

      <BenchEditorMainInfo
        benchInfo={report.benchInfoData.info}
        onAddBenchInfoLine={onAddBenchInfoLine}
        onBenchInfoUpdate={() => updateReport()}
        onDeleteBenchInfo={deleteBenchInfo}
      />
      <BenchEditorRemarks />
    </div>
  );
};

export default BenchEditorGroup;
