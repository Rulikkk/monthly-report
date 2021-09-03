import React from "react";
import { useRecoilState } from "recoil";
import { useParams } from "@reach/router";
import debounce from "lodash.debounce";

import BenchEditorMainInfo from "./BenchEditorMainInfo";
import { report as reportAtom } from "../../../../store/state";
import { getRandomId } from "../BaseComponents";

/**
 *
 * @param {Object} obj
 * @param {Report} obj.report
 */
const BenchEditorGroup = () => {
  const { reportId } = useParams();
  const [report, setReport] = useRecoilState(reportAtom(reportId));
  console.log(report.benchInfoData.info[0]);
  const switchBenchSectionEnabled = () => {
    setReport({
      ...report,
      benchInfoData: {
        ...report.benchInfoData,
        benchSectionEnabled: !report.benchInfoData.benchSectionEnabled
      }
    });
  };

  const onAddBenchInfoLine = () => {
    setReport({
      ...report,
      benchInfoData: {
        ...report.benchInfoData,
        info: [...report.benchInfoData.info, { id: getRandomId() }]
      }
    });
  };

  const deleteBenchInfo = (info) => {
    setReport({
      ...report,
      benchInfoData: {
        ...report.benchInfoData,
        info: report.benchInfoData.info.filter(
          (record) => record.id !== info.id
        )
      }
    });
  };

  const onBenchInfoUpdate = debounce((info, index) => {
    const newReport = {
      ...report,
      benchInfoData: {
        ...report.benchInfoData,
        info: [...report.benchInfoData.info]
      }
    };
    newReport.benchInfoData.info[index] = info;
    setReport(newReport);
  }, 300);

  return (
    <div>
      <h1 className="text-xl m-2">
        Bench
        <input
          type="checkbox"
          className="ml-2"
          checked={report.benchInfoData.benchSectionEnabled}
          onChange={switchBenchSectionEnabled}
        />
      </h1>

      <BenchEditorMainInfo
        benchInfo={report.benchInfoData.info}
        onAddBenchInfoLine={onAddBenchInfoLine}
        onBenchInfoUpdate={onBenchInfoUpdate}
        onDeleteBenchInfo={deleteBenchInfo}
      />

      {/*<BenchEditorRemarks
        remarks={report.benchInfoData.remarks ?? []}
        onRemarksUpdate={(newRemarks) => {
          // report.benchInfoData.remarks = newRemarks;
        }}
      />*/}
    </div>
  );
};

export default BenchEditorGroup;
