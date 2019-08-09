import React from "react";
import ReactDOM from "react-dom";
import ReportAndEditor from "./ReportAndEditor";

/**
 * ToDO:
 * - solve header image flicker in Safari
 */

const App = () => <ReportAndEditor />;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

// const useAll = ({ state, ref }) => {
//     const result = {};
//     for (let t in state) {
//       const a = useState(state[t]);
//       result[t] = a[0];
//       result["set" + t] = a[1];
//     }
//     for (let r in ref) {
//       result[r] = useRef(ref[r]);
//     }
//     return result;
//   },
//   use = useAll;

// { data, setData, yml, setYml, paneSize, setPaneSize, lastSize } = use({
//   state: {
//     data: parsedData,
//     yml: actualYml,
//     paneSize: initialSidebarState.open ? initialSidebarState.size : 0
//   },
//   ref: {
//     lastSize: initialSidebarState.size
//   }
// }),
