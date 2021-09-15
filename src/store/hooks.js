import { useRecoilState, useRecoilValue, useSetRecoilState, waitForAll } from "recoil";
import { useParams, useHistory } from "react-router-dom";

import {
  allReportsIds,
  statusesByColor,
  statusById,
  reportAtomFamily,
  benchInfoAtomFamily,
} from "./state";

export const useActiveReport = () => {
  const routeParams = useParams();
  const history = useHistory();

  if (!routeParams.reportId) history.push("/report/last");

  const { benchInfoData, projects, praises } = useRecoilValue(
    reportAtomFamily(routeParams.reportId),
  );

  return { reportId: routeParams.reportId, benchInfoData, projects, praises };
};

export const usePrevReport = () => {
  const routeParams = useParams();
  const history = useHistory();

  if (!routeParams.reportId) history.push("/report/last");

  const ids = useRecoilValue(allReportsIds);

  const index = ids.indexOf(routeParams.reportId);

  let prevId = null;

  if (index >= 0 && index + 1 < ids.length) prevId = ids[index + 1];

  const { benchInfoData, projects, praises } = useRecoilValue(reportAtomFamily(prevId));

  return { benchInfoData, projects, praises };
};

export const useActiveAndPrevReport = () => {
  const routeParams = useParams();
  const history = useHistory();
  const activeReportId = routeParams.reportId;
  if (!activeReportId) history.push("/report/last");

  const ids = useRecoilValue(allReportsIds);
  const activeReportIndex = ids.indexOf(activeReportId);

  const prevId =
    (activeReportIndex >= 0 && activeReportIndex + 1 < ids.length && ids[activeReportIndex + 1]) ??
    null;

  return useRecoilValue(
    waitForAll({
      activeReport: reportAtomFamily(activeReportId),
      ...(prevId ? { prevReport: reportAtomFamily(prevId) } : {}),
    }),
  );
};

export const useActiveReportProjectsByColor = (color) => {
  const { reportId } = useParams();

  return useRecoilValue(statusesByColor({ reportId, color }));
};

export const useProjectsByColor = (color) => {
  const { reportId } = useParams();

  return useRecoilState(statusesByColor({ reportId, color }));
};

export const useSetProjectsByColor = (color) => {
  const { reportId } = useParams();

  return useSetRecoilState(statusesByColor({ reportId, color }));
};

export const useProjectStatusById = (color, id) => {
  const { reportId } = useParams();

  return useRecoilState(statusById({ reportId, color, id }));
};

export const useProjectStatusByIdValue = (color, id) => {
  const { reportId } = useParams();

  return useRecoilValue(statusById({ reportId, color, id }));
};

export const useBenchInfoDataState = () => {
  const { reportId } = useParams();

  return useRecoilState(benchInfoAtomFamily({ reportId }));
};

export const useBenchInfoDataValue = () => {
  const { reportId } = useParams();

  return useRecoilValue(benchInfoAtomFamily({ reportId }));
};

export const useSetBenchInfoData = () => {
  const { reportId } = useParams();

  return useSetRecoilState(benchInfoAtomFamily({ reportId }));
};
