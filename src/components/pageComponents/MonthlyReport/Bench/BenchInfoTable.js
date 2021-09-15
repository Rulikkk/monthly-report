import React from "react";
import { useBenchInfoDataValue } from "../../../../store/hooks";

const orangeColor = "rgb(196, 89, 17)";

function getEmphasizedStyle(emphasizeCaption, paintOrange) {
  const style = { fontWeight: "bold" };
  if (emphasizeCaption) {
    style.fontSize = "1.2em";
    if (paintOrange) {
      style.color = orangeColor;
    }
  }

  return style;
}

const BenchInfoTable = () => {
  const { info: benchInfo } = useBenchInfoDataValue();

  return (
    (benchInfo?.length > 0 && (
      <table className="table-auto w-full">
        <thead>
          <tr style={{ color: orangeColor }}>
            <th className="w-3/12" />
            <th className="w-1/12 text-left p-2 pr-8" style={{ fontWeight: "bold" }}>
              Count
            </th>
            <th className="text-left p-2" style={{ fontWeight: "normal" }}>
              Info
            </th>
          </tr>
        </thead>
        <tbody>
          {benchInfo.map(
            (info, idx) =>
              info.disabled || (
                <tr key={idx} className={`${idx % 2 === 0 && "bg-gray-200"} align-top`}>
                  <td className="p-2" style={getEmphasizedStyle(info.emphasizeCaption, true)}>
                    {info.caption}
                  </td>
                  <td className="p-2" style={getEmphasizedStyle(info.emphasizeCaption)}>
                    {info.count}
                  </td>
                  <td className="p-2 pr-4 text-justify">{info.info}</td>
                </tr>
              ),
          )}
        </tbody>
      </table>
    )) || <div className="w-full text-center">No data</div>
  );
};

export default BenchInfoTable;
