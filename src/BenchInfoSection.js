import React from "react";

import BenchInfoTable from "./BenchInfoTable";
import BenchInfoRemarks from "./BenchInfoRemarks";

const BenchInfoSection = ({ benchInfoData }) => {
  return (
    <>
      <h1 className="text-3xl mt-5">Bench</h1>
      <BenchInfoTable benchInfoData={benchInfoData.info} />
      <div className="mt-2">
        <BenchInfoRemarks remarks={benchInfoData.remarks} />
      </div>
    </>
  );
};

export default BenchInfoSection;
