import isNil from "lodash.isnil";
import React from "react";
import { useSetRecoilState } from "recoil";

import { getRandomId } from "./BaseComponents";
import BenchEditorMainInfo from "./BenchEditorMainInfo";
import BenchEditorRemarks from "./BenchEditorRemarks";
import { reportQuery } from "./store/state";

/**
 *
 * @param {Object} obj
 * @param {Report} obj.report
 */
const BenchEditorGroup = ({ report }) => {
  let setReport = useSetRecoilState(reportQuery(report.reportId));

  const switchBenchSectionEnabled = () => {
    setReport({
      id: report.reportId,
      benchInfo: {
        benchSectionEnabled: !report.benchInfoData.benchSectionEnabled,
      },
    });
  };

  const onAddBenchInfoLine = () => {
    if (isNil(report.benchInfoData.info)) {
      report.benchInfoData.info = [];
    }

    report.benchInfoData.info.push({
      id: getRandomId(),
    });

    updateReport();
  };

  const deleteBenchInfo = (info) => {
    const filteredInfo = report.benchInfoData.info.filter((record) => record.id !== info.id);
    report.benchInfoData.info = filteredInfo;

    updateReport();
  };

  return !report ? (
    "Loading..."
  ) : (
    <div>
      <h1 className="text-xl m-2">
        Bench
        <input
          type="checkbox"
          className="ml-2"
          checked={report.benchInfoData.benchSectionEnabled}
          onChange={switchBenchSectionEnabled}></input>
      </h1>

      <BenchEditorMainInfo
        benchInfo={report.benchInfoData.info}
        onAddBenchInfoLine={onAddBenchInfoLine}
        onBenchInfoUpdate={() => updateReport()}
        onDeleteBenchInfo={deleteBenchInfo}
      />

      <BenchEditorRemarks
        remarks={report.benchInfoData.remarks ?? []}
        onRemarksUpdate={(newRemarks) => {
          // report.benchInfoData.remarks = newRemarks;
          updateReport();
        }}
      />
    </div>
  );
};

export default BenchEditorGroup;
