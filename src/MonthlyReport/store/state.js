import camelCase from "lodash.camelcase";
import { selector, selectorFamily } from "recoil";
import { PROJECT_STATES_ALL } from "../const";
import { transformKeys, apply, renameKey } from "./helpers";
import { http } from "./utils";

export let allReportsIds = selector({
  key: "allReportsIds",
  get: async () => {
    let { data } = await http.get("/reports");
    data = data.map(({ id }) => id).sort((a, b) => (a > b ? -1 : 1));
    return data;
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

    return apply(data, [renameKey("benchInfo", "benchInfoData")]);
  }
});

export let config = selector({
  key: "config",
  get: async () => {
    let { data } = await http.get("/config/main");
    return transformKeys(data, camelCase);
  }
});
