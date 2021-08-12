import { useRecoilState, useRecoilValue, waitForAll } from "recoil";
import { useParams, navigate } from "@reach/router";

import {
  reportQuery,
  allReportsIds,
  statusesByColor,
  statusByIndex
} from "./state";

export const useActiveReport = () => {
  const routeParams = useParams();

  if (!routeParams.reportId) navigate("/report/last");

  const { benchInfoData, projects, praises } = useRecoilValue(
    reportQuery(routeParams.reportId)
  );

  return { reportId: routeParams.reportId, benchInfoData, projects, praises };
};

export const usePrevReport = () => {
  const routeParams = useParams();

  if (!routeParams.reportId) navigate("/report/last");

  const ids = useRecoilValue(allReportsIds);

  const index = ids.indexOf(routeParams.reportId);

  let prevId = null;

  if (index >= 0 && index + 1 < ids.length) prevId = ids[index + 1];

  const { benchInfoData, projects, praises } = useRecoilValue(
    reportQuery(prevId)
  );

  return { benchInfoData, projects, praises };
};

export const useActiveAndPrevReport = () => {
  const routeParams = useParams();

  if (!routeParams.reportId) navigate("/report/last");

  const ids = useRecoilValue(allReportsIds);
  const index = ids.indexOf(routeParams.reportId);

  let prevId = null;

  if (index >= 0 && index + 1 < ids.length) prevId = ids[index + 1];

  return useRecoilValue(
    waitForAll({
      activeReport: reportQuery(routeParams.reportId),
      prevReport: reportQuery(prevId)
    })
  );
};

export const useActiveReportProjectsByColor = (color) => {
  const { reportId } = useParams();

  return useRecoilValue(statusesByColor({ reportId, color }));
};

export const useProjectStatusByIndex = (color, index) => {
  const { reportId } = useParams();

  return useRecoilState(statusByIndex({ reportId, color, index }));
};
