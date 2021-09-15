import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import { updateBenchOrPraises } from "../../../../store/api";
import { useBenchInfoDataState } from "../../../../store/hooks";

import BenchEditorMainInfo from "./BenchEditorMainInfo";
import { getRandomId } from "../BaseComponents";
import debounce from "lodash.debounce";

/**
 *
 * @param {Object} obj
 * @param {Report} obj.report
 */
const BenchEditorGroup = () => {
  const { reportId } = useParams();
  const [benchInfoData, setBenchInfoData] = useBenchInfoDataState();

  const getAPIPayload = (benchInfoDataObj) => ({
    bench_info: {
      bench_section_enabled: benchInfoDataObj.benchSectionEnabled,
      info: benchInfoDataObj.info.map(({ emphasizeCaption, ...infoItem }) => ({
        ...infoItem,
        emphasize_caption: emphasizeCaption,
      })),
    },
  });

  const saveBenchUpdates = useCallback(
    (payload) => updateBenchOrPraises(reportId, payload),
    [reportId],
  );

  const saveBenchUpdatesDebounced = useCallback(debounce(saveBenchUpdates, 300), [
    saveBenchUpdates,
  ]);

  const switchBenchSectionEnabled = () => {
    const updated = {
      ...benchInfoData,
      benchSectionEnabled: !benchInfoData.benchSectionEnabled,
    };
    setBenchInfoData(updated);
    saveBenchUpdates(getAPIPayload(updated));
  };

  const onAddBenchInfoLine = () => {
    const updated = {
      ...benchInfoData,
      info: [...benchInfoData.info, { id: getRandomId() }],
    };
    setBenchInfoData(updated);
    saveBenchUpdates(getAPIPayload(updated));
  };

  const deleteBenchInfo = (info) => {
    const updated = {
      ...benchInfoData,
      info: benchInfoData.info.filter((record) => record.id !== info.id),
    };
    setBenchInfoData(updated);
    saveBenchUpdates(getAPIPayload(updated));
  };

  const onBenchInfoUpdate = (info, index) => {
    const updated = {
      ...benchInfoData,
      info: benchInfoData.info.map((prevInfo, idx) => (idx === index ? info : prevInfo)),
    };
    console.log(info, updated);
    setBenchInfoData(updated);
    saveBenchUpdatesDebounced(getAPIPayload(updated));
  };

  return (
    <div>
      <h1 className="text-xl m-2">
        Bench
        <input
          type="checkbox"
          className="ml-2"
          checked={benchInfoData.benchSectionEnabled}
          onChange={switchBenchSectionEnabled}
        />
      </h1>

      <BenchEditorMainInfo
        benchInfo={benchInfoData.info}
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
