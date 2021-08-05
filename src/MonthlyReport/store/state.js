import camelCase from "lodash.camelcase";
import { selector, selectorFamily } from "recoil";

import { PROJECT_STATES_ALL } from "../const";
import { apply, transformKey, transformKeys } from "./helpers";
import { http } from "./utils";

export let allReportsIds = selector({
  key: "allReportsIds",
  get: async () => {
    let { data } = await http.get("/reports");
    return data.map(({ id }) => id).sort((a, b) => (a > b ? -1 : 1));
  }
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

    return apply(data, [transformKey("benchInfo", () => "benchInfoData")]);
  }
});

export const statusesByColor = selectorFamily({
  key: "statusesByColor",
  get: ({ reportId, color }) => ({ get }) =>
    get(reportQuery(reportId)).projects[color]
});

export let configQuery = selectorFamily({
  key: "config",
  get: (configId = "main") => async () => {
    let { data } = await http.get(`/config/${configId}`);
    return transformKeys(data, camelCase);
  }
});
