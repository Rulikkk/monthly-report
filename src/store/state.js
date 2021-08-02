import camelCase from "lodash.camelCase";
import groupBy from "lodash.groupby";
import { atom, selector, selectorFamily } from "recoil";

import { transformKeys } from "./helpers";
import { http } from "./utils";

export let allReportsIds = selector({
  key: "allReportsIds",
  default: [],
  get: async () => {
    let { data } = await http.get("/months");
    return data.sort((a, b) => (a.id > b.id ? -1 : 1));
  }
});

export let activeReportId = atom({
  key: "activeReportId",
  default: ""
});

export let reportQuery = selectorFamily({
  key: "report",
  get: reportId => async () => {
    let { data } = await http.get(`/month/${reportId}`);
    data.projects = groupBy(data.projects, ({ status_color }) => status_color);
    return transformKeys(data, camelCase);
  }
});

export let activeReport = selector({
  key: "activeReport",
  get: ({ get }) => {
    return get(reportQuery(get(activeReportId)));
  }
});

export let prevReport = selector({
  key: "prevReport",
  get: async ({ get }) => {
    let i = get(allReportIds).indexOf(get(activeReportId));
    return get(reportQuery(i - 1));
  }
});

export let nextReport = selector({
  key: "nextReport",
  get: async ({ get }) => {
    let i = get(allReportIds).indexOf(get(activeReportId));
    return get(reportQuery(i + 1));
  }
});
