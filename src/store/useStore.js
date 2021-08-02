import { useRecoilState, useRecoilValue } from "recoil";

import * as api from "./api";
import * as state from "./state";

/**
 * @typedef State
 * @property {Report} report
 * @property {Report} prevReport
 * @property {Report} activeReport
 * @property {Report} nextReport
 */

/**
 * @typedef API
 * @property {(arg: string) => void} setActiveReportId
 * @property {(arg: Report) => Promise} pushReport
 * @property {(arg: *) => Promise} pushStatus // :FIXME
 * @property {(arg: Project) => Promise} pushProject
 */

/** @returns {[State, API]} [State, API] */
export function useStore() {
  let [activeReportId, setActiveReportId] = useRecoilState(state.activeReportId);
  let activeReport = useRecoilValue(state.activeReport);
  let prevReport = useRecoilValue(state.prevReport);
  let nextReport = useRecoilValue(state.nextReport);

  return [
    {
      prevReport,
      nextReport,
      activeReport: {
        ...activeReport,
        id: activeReportId
      }
    },
    {
      ...api,
      setActiveReportId
    }
  ];
}
