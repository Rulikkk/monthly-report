import React from "react";

import { Button } from "./BaseComponents";
import BenchEditorMainInfoCard from "./BenchEditorMainInfoCard";

/**
 *
 * @param {Object} obj
 * @param {BenchInfoRecord[]} obj.benchInfo
 */
const BenchEditorMainInfo = ({
  benchInfo,
  onAddBenchInfoLine,
  onBenchInfoUpdate,
  onDeleteBenchInfo,
}) => {
  return (
    <>
      {benchInfo?.map((info) => {
        return (
          <BenchEditorMainInfoCard
            key={info.id}
            info={info}
            onBenchInfoUpdate={onBenchInfoUpdate}
            onDelete={onDeleteBenchInfo}
          />
        );
      })}
      <Button small onClick={onAddBenchInfoLine} className="ml-2">
        Add line
      </Button>
    </>
  );
};

export default BenchEditorMainInfo;
