import React from "react";

const BenchInfoRemarks = ({ remarks }) => {
  return (
    <table style={styles.tableStyle}>
      {remarks.map(remark => (
        <tr>
          <td className="align-top">-</td>
          <td>{remark}</td>
        </tr>
      ))}
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
