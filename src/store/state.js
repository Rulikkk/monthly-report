import camelCase from "lodash.camelcase";
import groupBy from "lodash.groupby";
import { atom, selector, selectorFamily } from "recoil";

import { transformKeys } from "./helpers";
import { http } from "./utils";

export let allReportsIds = selector({
  key: "allReportsIds",
  default: [],
  get: async () => {
    let { data } = await http.get("/months");
    return data.map(({ id }) => id).sort((a, b) => (a > b ? -1 : 1));
  }
});

export let activeReportId = atom({
  key: "activeReportId",
  default: null
});

export let reportQuery = selectorFamily({
  key: "report",
  get: reportId => async () => {
    if (!reportId) return;
    let { data } = await http.get(`/month/${reportId}`);
    data.projects = groupBy(data.projects, ({ status_color }) => status_color);
    return transformKeys(data, camelCase);
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
    let index = ids.indexOf(activeId) - 1;
    if (index < 0) return;
    return get(reportQuery(ids[index]));
  }
});

export let nextReport = selector({
  key: "nextReport",
  get: async ({ get }) => {
    let activeId = get(activeReportId);
    if (!activeId) return;
    let ids = get(allReportsIds);
    let index = ids.indexOf(activeId) + 1;
    if (index < 0) return;
    return get(reportQuery(ids[index]));
  }
});