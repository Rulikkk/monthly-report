import React from "react";

const orangeColor = "rgb(196, 89, 17)";

function getEmphasizedStyle(info, paintOrange) {
  const style = { fontWeight: "bold" };
  if (info.emphasizeCaption) {
    style.fontSize = "1.2em";
    if (paintOrange) {
      style.color = orangeColor;
    }
  }

  return style;
}

const BenchInfoTable = ({ benchInfoData }) => {
  return (
    (benchInfoData?.length > 0 && (
      <table className="table-auto w-full">
        <thead>
          <tr style={{ color: orangeColor }}>
            <th className="w-3/12"></th>
            <th className="w-1/12" style={{ fontWeight: "bold" }}>Count</th>
            <th style={{ fontWeight: "normal" }}>Info</th>
          </tr>
        </thead>
        <tbody>
          {benchInfoData.map(
            (info, idx) =>
              info.disabled || (
                <tr key={info.id} className={`${idx % 2 === 1 && "bg-gray-200"} align-top`}>
                  <td className="p-1" style={getEmphasizedStyle(info, true)}>
                    {info.caption}
                  </td>
                  <td className="p-1 text-center" style={getEmphasizedStyle(info)}>
                    {info.count}
                  </td>
                  <td className="p-1 text-justify">{info.info}</td>
                </tr>
              )
          )}
        </tbody>
      </table>
    )) || <div className="w-full text-center">No data</div>
  );
};

export default BenchInfoTable;
