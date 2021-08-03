import camelCase from "lodash.camelcase";
import { atom, selector, selectorFamily } from "recoil";
import { PROJECT_STATES_ALL } from "../const";

import { transformKeys, apply, renameKey } from "./helpers";
import { http } from "./utils";

export let allReportsIds = selector({
  key: "allReportsIds",
  get: async ({ set }) => {
    let { data } = await http.get("/reports");
    data = data.map(({ id }) => id).sort((a, b) => (a > b ? -1 : 1));
    return data;
  }
});

export let activeReportIdDummy = atom({
  key: "activeReportIdDummy",
  default: null
});

export let activeReportId = selector({
  key: "activeReportId",
  get: ({ get }) => {
    const dummy = get(activeReportIdDummy);
    if (dummy) return dummy;

    const ids = get(allReportsIds);

    if (ids && ids.length > 0) return ids[0];
  },
  set: ({ set }, value) => set(activeReportIdDummy, value)
});

export let reportQuery = selectorFamily({
  key: "report",
  get: (reportId) => async () => {
    if (!reportId) return;

    console.log(`LOADING REPORT ${reportId}`);
    let { data: rawData } = await http.get(`/report/${reportId}`);
    let { project_statuses_ids, project_statuses, ...data } = rawData;

    data.projects = {};
    PROJECT_STATES_ALL.forEach(
      (state) =>
        (data.projects[state] = project_statuses
          .filter((x) => x.status_color === state)
          .map((x) => x.status))
    );

    data.code = data.id;
    data = transformKeys(data, camelCase);

    return apply(data, [renameKey("benchInfo", "benchInfoData")]);
  }
});

export let activeReport = selector({
  key: "activeReport",
  get: ({ get }) => {
    let id = get(activeReportId);

    if (!id) return;

    return get(reportQuery(id));
  }
});

export let prevReport = selector({
  key: "prevReport",
  get: async ({ get }) => {
    let activeId = get(activeReportId);
    if (!activeId) return;
    let ids = get(allReportsIds);
    let index = ids.indexOf(activeId) + 1;
    if (index > ids.length) return;
    return get(reportQuery(ids[index]));
  }
});

export let nextReport = selector({
  key: "nextReport",
  get: async ({ get }) => {
    let activeId = get(activeReportId);
    if (!activeId) return;
    let ids = get(allReportsIds);
    let index = ids.indexOf(activeId) - 1;
    if (index < 0) return;
    return get(reportQuery(ids[index]));
  }
});

export let config = selector({
  key: "config",
  get: async () => {
    let { data } = await http.get("/config/main");
    return transformKeys(data, camelCase);
  }
});
