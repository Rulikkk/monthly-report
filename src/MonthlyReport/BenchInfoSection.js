import React from "react";

import BenchInfoTable from "./BenchInfoTable";
import BenchInfoRemarks from "./BenchInfoRemarks";

import { config } from "./store/state";

import { useRecoilValue } from "recoil";

const BenchInfoSection = () => {
  const {
    value: { benchRemarks: remarks }
  } = useRecoilValue(config());

  return (
    <>
      <h1 className="text-3xl mt-5">Bench</h1>
      <BenchInfoTable />
      <div className="mt-2">
        <BenchInfoRemarks remarks={remarks} />
      </div>
    </>
  );
};

export default BenchInfoSection;
