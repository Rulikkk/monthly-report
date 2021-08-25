import React from "react";

import BenchInfoTable from "./BenchInfoTable";
import BenchInfoRemarks from "./BenchInfoRemarks";

import { config } from "./store/state";
import { useActiveReport } from "./store/hooks";

import { useRecoilValue } from "recoil";

const BenchInfoSection = () => {
  const {
    value: { benchRemarks: remarks }
  } = useRecoilValue(config());

  const { benchInfoData } = useActiveReport();

  return (
    <>
      <h1 className="text-3xl mt-5">Bench</h1>
      <BenchInfoTable benchInfoData={benchInfoData.info} />
      <div className="mt-2">
        <BenchInfoRemarks remarks={remarks} />
      </div>
    </>
  );
};

export default BenchInfoSection;
