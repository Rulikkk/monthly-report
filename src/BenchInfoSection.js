import React from "react";

import BenchInfoTable from "./BenchInfoTable";
import BenchInfoRemarks from "./BenchInfoRemarks";

import { useStore } from "./store/index";

const BenchInfoSection = ({ benchInfoData }) => {
  const [{ config }] = useStore();

  console.log(config.value.benchRemarks);

  return (
    <>
      <h1 className="text-3xl mt-5">Bench</h1>
      <BenchInfoTable benchInfoData={benchInfoData.info} />
      <div className="mt-2">
        <BenchInfoRemarks remarks={config.value.benchRemarks} />
      </div>
    </>
  );
};

export default BenchInfoSection;
