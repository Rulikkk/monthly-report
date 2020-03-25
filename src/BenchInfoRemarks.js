import React from "react";

const BenchInfoRemarks = ({ remarks }) => {
  return (
    <table style={styles.tableStyle}>
      <tbody>
        {remarks.map((remark, ix) => (
          <tr key={ix}>
            <td className="align-top">-</td>
            <td>{remark}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/**
 * @type {Object.<string, React.CSSProperties>}
 */
const styles = {
  tableStyle: {
    color: "#7f7f7f",
    fontSize: "0.8em"
  }
};

export default BenchInfoRemarks;
